<template>
  <div class="LogRegister">
    <store-list @click="setCraftData"></store-list>
    <div v-if="isUpadateMode">更新モード</div>
    <div v-else-if="!isUpadateMode">新規追加モード</div>
    <button @click="isUpadateMode = !isUpadateMode">新規追加モードへ</button>
    <button @click="resetData">リセット</button>
    <div class="LogRegister__Body">
      <div>名前:<input type="text" v-model="Name" /></div>
      <div>
        画像パス:<input type="text" v-model="Image" /><br />
        <button @click="fetchIcon()">取得</button><br />
        <img :src="ImgUrl" />
      </div>
      <section>
        <h2>情報</h2>
        <category-list :Category="DivisionInfo.rank" v-model="rank"
          >段階</category-list
        >
        <category-list :Category="DivisionInfo.category" v-model="category"
          >種別</category-list
        >
        <category-list :Category="DivisionInfo.job" v-model="job"
          >ジョブ</category-list
        >
      </section>
      <section>
        <h2>グループ</h2>
        <div>
          <ul>
            製作種別:
            <li v-for="(value, key) in DivisionInfo.other" :key="key">
              <input
                type="radio"
                :id="value.type"
                :value="value.type"
                v-model="other"
              />
              <label :for="value">{{ value.name }}</label>
            </li>
          </ul>
        </div>
        <template v-if="other === 'default'">
          <div>製作レベル:<input type="text" /></div>
          <div>アイテムレベル:<input type="text" /></div>
          <div>ランク<input type="text" /></div
        ></template>
        <template v-if="other === 'Master'">
          <div>秘伝書番号:<input type="text" /></div>
          <div>製作レベル:<input type="text" /></div>
          <div>ランク<input type="text" /></div>
        </template>
        <template v-if="other === 'Ishgard'">
          <div>イシュガルド復興段階:<input type="text" /></div>
          <div>製作レベル:<input type="text" /></div>
          <div>ランク<input type="text" /></div>
          <div>高難易度ランク<input type="text" /></div>
        </template>
      </section>
      <div class="LogRegister__Ingredients">
        <ingredient
          v-for="(Log, ID) in childrenlogs"
          :key="ID"
          :value="Log"
          @change="Test"
        ></ingredient>
      </div>
    </div>
    <button @click="writeInterface()">追加/更新</button>
  </div>
</template>

<script>
import firebase from "@/firebase.js";
import Ingredient from "@/components/Console/Ingredient.vue";
// import StoreList from "@/components/Console/StoreList.vue";
import CategoryList from "@/components/Console/CategoryList.vue";
import divisions from "../../assets/category.json";

export default {
  name: "LogRegister",
  components: {
    Ingredient,
    // StoreList,
    CategoryList
  },
  data() {
    return {
      backupdata: {},

      name: "",
      engname: "",
      imageurl: "",
      level: 0,
      itemlevel: 0,
      category: "",
      job: "",
      rank: "",
      other: "",
      starmark: 0,
      MeisterBookNumber: "",
      ishighlevel: false,
      patchversion: 0,
      childrenlogs: [],

      isUpadateMode: true,
      Paths: [
        { url: "Material/Raw/" },
        { url: "Material/End/" },
        { url: "Material/Middle/" }
      ]
    };
  },
  created() {
    //必要アイテムの配列を初期化し、最初から配列の中身を作っておく
    for (let step = 0; step < 6; step++) {
      let child = { isDisable: true, order: step };
      this.childrenlogs.push(child);
    }
  },
    DivisionInfo() {
      return divisions;
    }
  },
  methods: {
    writeInterface() {
      if (this.name === "" && this.engname === "") {
        alert("名前が入力されていません");
        return;
      }

      //選択した[段階]のオブジェクト情報がほしいため検索する
      const rank = this.DivisionInfo.rank.find(rank => {
        return rank.type === this.rank;
      });

      //選択した[秘伝書]のオブジェクト情報がほしいため検索する
      const MeisterBookRank = this.DivisionInfo.MeisterBook.find(
        MeisterBook => {
          return MeisterBook.type === this.MeisterBookNumber;
        }
      );

      const UpdateLog = {
        //アイテム名
        text: {
          name: this.name,
          engname: this.engname
        },
        //製作レベルとアイテムレベル
        level: {
          level: this.level,
          itemlevel: this.itemlevel
        },

        imageurl: this.imageurl,

        type: {
          craftcontent: this.other,
          job: this.job,
          category: this.category,
          MeisterBookrank: MeisterBookRank
        },

        //制作段階
        rank: rank.stagename,

        //表示優先度
        priority: rank.priority,

        //星マークの数
        starmark: this.starmark,

        //高難易度レシピかどうか
        ishighlevel: this.ishighlevel,

        patchversion: this.patchversion,
        childrenlogs: this.childrenlogs,

        createTime: "",
        updateTime: ""
      };

    },
    async writeStoreLog(DocumentID, LogData) {
      return await firebase
        .firestore()
        .collection("CraftLog")
        .doc(DocumentID)
        .set(LogData)
        .then(() => {
          alert("Success!");
        })
        .catch(error => {
          console.error("Firestore Error", error);
        });
    },
    async fetchLastID() {
      const LogCollection = firebase.firestore().collection("CraftLog");
      const LastLog = LogCollection.orderBy("ID", "desc").limit(1);
      return await LastLog.get().then(function(querySnapshot) {
        return querySnapshot.docs.map(doc => doc.data().ID)[0];
      });
    },
    fetchIcon() {
      if (this.Image === "") {
        return "";
      }
      const Path = this.Paths[this.crafttype].url;
      const GCP_URL =
        "https://storage.googleapis.com/ffxivcrafttools.appspot.com/";
      this.ImgUrl = `${GCP_URL}${Path}${this.Image}.png`;
    },
    fetchIconsList() {
      this.iconpath.length = 0;
      const ImageRef = firebase
        .firestore()
        .collection("Image")
        .doc("Material")
        .collection("End")
        .where("ProductionStageLevel", "==", 1)
        .where("type", "==", 1);
      ImageRef.get().then(querySnapshot => {
        const List = querySnapshot.docs.map(doc => doc.data());
        const URLs = List.map(Doc => {
          const Image = {
            sortID: Doc.ID,
            url: ""
          };

          firebase
            .storage()
            .ref(Doc.path)
            .getDownloadURL()
            .then(url => {
              Image.url = url;
            });
          return Image;
        });
        this.iconpath = URLs;
      });
    },
    setCraftData(Data) {
      //編集前に戻す用のために、取得したデータをバックアップする
      //でもこのページから移動したら消したいのでComponent内のみで保持する
      this.BackUpData = Data;

      //編集用データとして変数へ代入する
      //アイテム名とアイコンのパス
      this.name = Data.Name;
      this.imgurl = Data.ImgUrl;

      //レベル情報
      this.level = Data.level;
      this.itemlevel = Data.ItemLevel;

      //製作可能ジョブと製作段階の情報とマイスターが必須かどうか
      this.rank = Data.Type;
      this.rank = Data.rank;
      this.isMaster = Data.isMaster;

      //必要な素材の情報
      this.childrenlogs = Data.Ingredients;

      //更新モードをオンにし、FireStoreへ書き込み時に同じドキュメントへ書き込むようにする
      this.isUpadateMode = true;
    },
    }
  }
};
</script>

<style lang="scss">
.LogRegister {
  display: flex;
  align-items: center;
  flex-direction: column;

  @media screen and (min-width: 780px) {
    flex-direction: column;
  }

  &__Body {
    margin: 5px;
  }

  &__Ingredients {
    display: flex;
    flex-direction: column;
    @media screen and (min-width: 780px) {
      flex-direction: row;
    }
  }
}
</style>
