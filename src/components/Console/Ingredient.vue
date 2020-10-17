<template>
  <div class="Ingredient" :class="DisabledBorderColor">
    <slot></slot>
    必須素材
    <div>有効化<input type="checkbox" v-model="isEnable" /></div>
    <div class="Ingredient__Child">素材名:{{ this.name }}</div>
    <div class="Ingredient__Child">ENG:{{ this.engname }}</div>
    <div>
      <img
        class="minisize"
        :src="imageurl"
        :alt="ImageAltText"
        v-if="isImageShow"
      />
    </div>
    <div class="Ingredient__Child">
      <label>個数</label>
      <input type="text" :disabled="!isEnable" v-model.number="ReqValue" />
    </div>
    <button @click="EventEmit()">セット</button>
  </div>
</template>

<script>
import firebase from "@/firebase.js";
export default {
  name: "Ingredient",
  data() {
    return {
      isEnable: false,
      value: 1,
      imageurl: "",
      name: "",
      engname: "",
      ChildDocumentRef: {}
    };
  },
  props: {
    childlog: {
      type: Object,
      required: true
    },
    order: {
      type: Number,
      required: true
    }
  },
  computed: {
    DisabledBorderColor() {
      return {
        isDisabled: !this.isEnable
      };
    },
    ReqValue: {
      get() {
        return this.value;
      },
      set(val) {
        //必要個数が0はありえないので、0の場合は1を代入させて0にするのを防ぐ
        this.value = val > 0 ? val : 1;
      }
    },
    ImageAltText() {
      return `${this.name}のアイコンです`;
    },
    isImageShow() {
      return this.imageurl != "";
    }
  },
  watch: {
    childlog: function(props) {
      this.isEnable = props.isEnable;
      this.name = props.name;
      this.engname = props.engname ? props.engname : "";
      this.ReqValue = props.value ? props.value : 0;
      this.imageurl = props.imageurl ? props.imageurl : "";
      this.ChildDocumentRef = props.ChildDocumentRef
        ? props.ChildDocumentRef
        : {};
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
    /**
     * 親へ編集内容を伝える
     * @
     */
    EventEmit() {
      //ドキュメントIDからドキュメントのパスを生成する
      const DocumentPath = `CraftLog/${this.ChildDocumentID}`;
      const DocRef = firebase.firestore().doc(DocumentPath);

      return this.$emit("change", {
        isEnable: true,
        name: this.name,
        engname: this.engname,
        value: this.ReqValue,
        imageurl: this.imageurl,
        childrenDocumentRef: DocRef,
        order: this.order
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
