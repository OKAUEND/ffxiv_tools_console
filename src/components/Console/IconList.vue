<template>
  <div>
  </div>
</template>

<script>
import firebase from "@/firebase.js";
export default {
  name: "IconList",
  },
  data() {
    return {
      icons: [],
    };
  },
  methods: {
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
        .where("Type", "==", value.typecriteria)
        .where("MaterialType", "==", value.materialtypecriteria);

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
