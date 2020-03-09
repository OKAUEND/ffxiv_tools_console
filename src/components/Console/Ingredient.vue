<template>
  <div class="Ingredient" :class="DisabledBorderColor">
    必須素材
    <div>
      有効化<input type="checkbox" v-model="isEnable" @change="EventEmit" />
    </div>
    <div>
      必要個数<input
        type="text"
        :disabled="!isEnable"
        v-model="value"
        @input="EventEmit"
      />
    </div>
    <div>
      <label>素材のID</label>
      <input
        type="text"
        :disabled="!isEnable"
        v-model="IconName"
        @input="EventEmit"
      />
    </div>
    <div>
      素材のID<input
        type="text"
        :disabled="!isEnable"
        v-model="ChildDocumentID"
        @input="EventEmit"
      />
      <button @click="fetchDocument">取得</button>
      <div>
        現在の選択中<br />
        <img class="minisize" :src="CandidateData.imgurl" /><br />
        {{ CandidateData.name }}
      </div>
    </div>
    <!-- <div>{{ DocumentReference.path }}</div> -->
  </div>
</template>

<script>
import firebase from "@/firebase.js";
export default {
  name: "Ingredient",
  data() {
    return {
      isEnable: false,
      value: 0,
      IconName: "none",
      ChildDocumentID: 0,
      CandidateData: {}
    };
  },
  props: {
    storeLog: {
      type: Object,
      required: true
    },
    SortID: {
      type: Number,
      required: true
    }
  },
  computed: {
    DocumentReference() {
      console.log(this.ChildDocumentID);
      if (this.ChildDocumentID === 0 || this.ChildDocumentID === "") {
        return {
          path: "none"
        };
      }
      const DocumentPath = `CraftLog/${Number(this.ChildDocumentID)}`;
      const Ref = firebase.firestore().doc(DocumentPath);
      return Ref;
    },
    DisabledBorderColor() {
      return {
        isDisabled: !this.isEnable
      };
    }
  },
  watch: {
    storeLog: function(LogData) {
      this.isEnable = LogData.isEnable;
      this.value = LogData.value ? LogData.value : 0;
      this.IconName = LogData.image;
      this.ChildDocumentID = LogData.IngredientID ? LogData.IngredientID : 0;
    }
  },
  methods: {
    fetchDocument() {
      if (this.ChildDocumentID === 0) {
        return;
      }

      const ZeroPadding = `"0000000${this.ChildDocumentID}`.slice(-7);
      // const DocumentPath = `CraftLog/Log${ZeroPadding}`;
      const DocRef = firebase
        .firestore()
        .collection("CraftLog")
        .doc(`Log${ZeroPadding}`);
      DocRef.get().then(doc => {
        const DocData = doc.data();
        const CandidateData = {
          ID: DocData.ID,
          name: DocData.name,
          imgurl: DocData.image
        };
        this.CandidateData = CandidateData;
      });
    },
    EventEmit() {
      if (!this.isEnable) {
        return this.$emit("change", {
          isEnable: false,
          IngredientID: 0
        });
      }

      if (this.value <= 0) {
        return this.$emit("change", {
          isEnable: false,
          IngredientID: 0
        });
      }

      if (this.ChildDocumentID === 0 || this.ChildDocumentID === "") {
        return this.$emit("change", {
          isEnable: false,
          IngredientID: 0
        });
      }

      const ZeroPadding = `"0000000${this.ChildDocumentID}`.slice(-7);
      const DocumentID = `Log${ZeroPadding}`;
      const DocumentPath = `CraftLog/${DocumentID}`;
      const DocRef = firebase.firestore().doc(DocumentPath);

      return this.$emit("change", {
        isEnable: this.isEnable,
        value: this.value,
        Icon: this.CandidateData.imgurl,
        LogPath: DocRef,
        IngredientID: this.ChildDocumentID,
        sort: this.SortID
      });
    }
  }
};
</script>

<style lang="scss">
.Ingredient {
  margin: 5px;
  padding: 5px;
  border: solid 2px;
  border-radius: 5px;

  &.isDisabled {
    border: solid 2px red;
  }
}

.minisize {
  height: 45px;
  width: 45px;
}
</style>
