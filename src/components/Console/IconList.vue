<template>
  <div>
    <modal>
      <template v-slot:ButtonText>{{ createButtonText }}</template>
      <template v-slot:content>
        <icon-list-query @change="fetchIconDetailes" />
        <div>
          <img
            :src="selecticon.URL"
            alt="Select Item Icon"
            decoding="async"
            width="100"
            height="100"
          />
          <ul>
            <li v-for="(icon, key) in icons" :key="key">
              <button @click="onClickIcon(icon)">
                <img
                  :src="icon.URL"
                  alt="Item Icon"
                  decoding="async"
                  width="60"
                  height="60"
                />
              </button>
            </li>
          </ul>
        </div>
      </template>
    </modal>
  </div>
</template>

<script>
import IconListQuery from "@/components/Console/IconListQuery.vue";
import modal from "@/components/Console/modal/BaseModal.vue";
import firebase from "@/firebase.js";
import mergeiconlist from "@/util/mergeiconlist.js";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "IconList",
  components: {
    IconListQuery,
    modal
  },
  data() {
    return {
      icons: [],
      selecticon: {}
    };
  },
  computed: {
    createButtonText() {
      return "アイコン検索";
    },
    ...mapGetters("icon", {
      getCacheicons: "getCacheicons"
    }),
    ...mapActions("icon", {
      cachelistAcquiredfromDB: "cachelistAcquiredfromDB"
    })
  },
  methods: {
    onClickIcon(value) {
      //選択中のアイコンを表示させたいので、dataへ代入する
      this.selecticon = value;

      //画像のパスだけが必要なので、パスの情報だけを親へ渡す
      this.$emit("change", value.URL);
    },
    /**
     * Firestoreから条件にあったアイコンの一覧を取得する
     */
    async fetchIconDetailes(value) {
      //選択した内容から、Firestoreへ通信を行うdocumentを作成する
      const documentRef = firebase
        .firestore()
        .collection("Image")
        .doc(value.document)
        .collection(value.collection)
        .where("Type", "==", value.rank)
        .where("MaterialType", "==", value.detail);

      //0から再描画させたいのでIconsを初期化する
      this.icons.length = 0;

      const querysnapshot = documentRef.get();

      this.icons = await querysnapshot.then(querySnapshot => {
        return querySnapshot.docs.map(doc => {
          return doc.data();
        });
      });
    }
  }
};
</script>
