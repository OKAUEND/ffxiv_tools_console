<template>
  <div class="Ingredient" :class="DisabledBorderColor">
    必須素材
    <div>有効化<input type="checkbox" v-model="isEnable" /></div>
    <div class="Ingredient__Child">
      <label>必要個数</label>
      <input
        type="text"
        :disabled="!isEnable"
        v-model.number="ReqValue"
        @input="EventEmit"
      />
    </div>
    <div class="Ingredient__Child">
      素材のID
      <input
        type="text"
        :disabled="!isEnable"
        v-model.number="ChildDocumentID"
        @input="EventEmit"
      />
    </div>
    <button @click="fetchDocument">取得</button>
    <div>
      現在の選択中<br />
      <img class="minisize" :src="ImgUrl" /><br />
      {{ Name }}
    </div>
  </div>
</template>

<script>
import firebase from "@/firebase.js";
export default {
  name: "Ingredient",
  data() {
    return {
      isEnable: false,
      ReqValue: 0,
      ImgUrl: "none",
      Name: "",
      ChildDocumentID: 0,
      CandidateData: {}
    };
  },
  props: {
    value: {
      type: Object,
      required: true
    },
    SortID: {
      type: Number,
      required: true
    }
  },
  computed: {
    DisabledBorderColor() {
      return {
        isDisabled: !this.isEnable
      };
    }
  },
  watch: {
    value: function(LogData) {
      this.isEnable = LogData.isEnable;
      this.ReqValue = LogData.Value ? LogData.Value : 0;
      this.IconName = LogData.image;
      this.ChildDocumentID = LogData.IngredientID ? LogData.IngredientID : 0;
      this.ImgUrl = LogData.Imgurl;
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
        this.ImgUrl = DocData.ImgUrl;
        this.Name = DocData.Name;
        this.EventEmit();
      });
    },
    EventEmit() {
      if (!this.isEnable) {
        return this.$emit("input", {
          isEnable: false,
          IngredientID: 0
        });
      }

      if (this.value <= 0) {
        return;
      }

      if (this.ChildDocumentID === 0 || this.ChildDocumentID === "") {
        return;
      }

      const ZeroPadding = `"0000000${this.ChildDocumentID}`.slice(-7);
      const DocumentID = `Log${ZeroPadding}`;
      const DocumentPath = `CraftLog/${DocumentID}`;
      const DocRef = firebase.firestore().doc(DocumentPath);

      return this.$emit("input", {
        isEnable: true,
        Value: this.ReqValue,
        Imgurl: this.ImgUrl,
        LogPath: DocRef,
        IngredientID: this.ChildDocumentID,
        SortID: this.SortID
      });
    }
  }
};
</script>

<style lang="scss">
.Ingredient {
  display: flex;
  flex-direction: column;
  border: solid 2px;
  border-radius: 5px;
  padding: 5px;
  margin: 5px;
  box-sizing: border-box;
  &.isDisabled {
    border: solid 2px red;
  }

  & input {
    width: 50px;
  }

  &__Child {
    display: flex;
    flex-direction: row;
  }
}

.minisize {
  height: 45px;
  width: 45px;
}
</style>
