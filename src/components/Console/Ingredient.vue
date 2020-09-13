<template>
  <div class="Ingredient" :class="DisabledBorderColor">
    必須素材
    <div>有効化<input type="checkbox" v-model="isEnable" /></div>
    <modal
      ><template v-slot:ButtonText>検索</template
      ><template v-slot:content><search-form @click="setChildData"/></template
    ></modal>
    <div class="Ingredient__Child">素材名:{{ this.name }}</div>
    <div class="Ingredient__Child">ENG:{{ this.engname }}</div>
    <div><img class="minisize" :src="imageurl" /></div>
    <div class="Ingredient__Child">
      <label>個数</label>
      <input type="text" :disabled="!isEnable" v-model.number="ReqValue" />
    </div>
  </div>
</template>

<script>
import Modal from "@/components/Console/modal/BaseModal.vue";
import SearchForm from "@/components/Console/StoreList.vue";
import firebase from "@/firebase.js";
export default {
  name: "Ingredient",
  components: {
    Modal,
    SearchForm
  },
  data() {
    return {
      isEnable: false,
      value: 1,
      imageurl: "",
      name: "",
      engname: "",
      ChildDocumentID: 0,
      CandidateData: {}
    };
  },
  props: {
    childlog: {
      type: Object,
      required: true
    }
  },
  computed: {
    DisabledBorderColor() {
      return {
        isDisabled: !this.isEnable
      };
    },
    ImgURL() {
      if (this.imageurl === "") {
        return "static/none.png";
      } else {
        return this.imageurl;
      }
    },
    ReqValue: {
      get() {
        return this.value;
      },
      set(val) {
        //必要個数が0はありえないので、0の場合は1を代入させて0にするのを防ぐ
        console.log(val);
        this.value = val > 0 ? val : 1;
        this.$forceUpdate();
      }
    }
  },
  watch: {
    childlog: function(props) {
      this.isEnable = props.isDisabled;
      this.ReqValue = props.Value;
      this.imageurl = props.image;
      this.ChildDocumentID = props.IngredientID ? props.IngredientID : 0;
      this.ImgUrl = props.Image;
    }
  },
  methods: {
    /**
     * Firestoreから取得した値をセットする
     * @
     */
    setChildData(data) {
      this.isEnable = true;
      this.ReqValue = 1;
      this.name = data.name;
      this.engname = data.engname;
      this.imageurl = data.imageurl;
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
