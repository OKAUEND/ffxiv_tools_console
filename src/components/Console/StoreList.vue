<template>
  <div>
    <button @click="writeInterface()">追加/更新</button>
    調整したいIL帯を選択してください
    <input type="text" placeholder="上限IL" />
    <input type="text" placeholder="下限IL" />
    <button @click="onFetchStoreLogs()">取得</button>
    <ul>
      <li v-for="(Log, ID) in StoreLogs" :key="ID">
        <button @click="selectProps(Log)">{{ Log.Name }}</button>
      </li>
    </ul>
  </div>
</template>

<script>
import firebase from "@/firebase.js";
export default {
  name: "StoreList",
  data() {
    return {
      StoreLogs: []
    };
  },
  methods: {
    onFetchStoreLogs() {
      //選択したレベル帯に該当するログを取得する
      this.fetchCraftLogs().then(Logs => {
        console.log(Logs);
        this.StoreLogs = Logs;
      });
    },

    async fetchCraftLogs() {
      //Firestoreからデータを取り出すクエリを作成する
      const docRef = firebase.firestore().collectionGroup("CraftLog");
      //すべてを取得するのは負荷がかかるため、選択したクラフターと同じもので、IL帯で絞り込みを行えるようにする
      const queryRef = docRef
        .where("job", "==", this.job)
        .where("itemlevel", "<=", this.upperItemlevel)
        .where("itemlevel", ">=", this.lowerItemlevel);
      //DBへ問い合わせる
      return await queryRef
        .get()
        .then(querySnapshot => {
          const docs = querySnapshot.docs.map(doc => doc.data());
          return docs;
        })
        .catch(error => {
          console.error("Firest Error getting document", error);
        });
    },
    selectProps(Data) {
      this.$props("click", Data);
    }
  }
};
</script>

<style></style>
