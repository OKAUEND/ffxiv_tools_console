<template>
  <div class="LogRegister">
    <store-list @click="setCraftData"></store-list>
    <div v-if="isUpadateMode">更新モード</div>
    <div v-else-if="!isUpadateMode">新規追加モード</div>
    <button @click="isUpadateMode = !isUpadateMode">新規追加モードへ</button>
    <base-modal>
      <template v-slot:ButtonText>検索</template>
      <template v-slot:content
        ><store-list @query="fetchlogs" @select="setCraftLog" :logs="logs"
      /></template>
    </base-modal>
    <div class="LogRegister__Body">
      <div>名前:<input type="text" v-model="name" /></div>
      <div>英名:<input type="text" v-model.lazy="engnameRegex" /></div>
      <div>製作レベル:<input type="text" v-model.number="level" /></div>
      <div>アイテムレベル:<input type="text" v-model.number="itemlevel" /></div>
      <div>
        <category-list
          :Category="DivisionInfo.patchversion"
          v-model="patchversion"
          >実装パッチ</category-list
        >
      </div>
      <img :src="itemicon" />
      <div>
        <icon-list
          :icons="icons"
          @select="onModalIconClick"
          @change="fetchIconlist"
        ></icon-list>
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
        <h2>分類</h2>
        <category-list :Category="DivisionInfo.other" v-model="other"
          >製作種別</category-list
        >
        <div>高難易<input type="checkbox" v-model="ishighlevel" /></div>
        <div>星<input type="text" v-model.number="starmark" /></div>
        <div v-show="checkedMeister">
          <category-list
            :Category="DivisionInfo.MeisterBook"
            v-model="MeisterBookNumber"
            >秘伝書番号</category-list
          >
        </div>
      </section>
      <div class="LogRegister__Ingredients">
        <ingredient
          v-for="(Log, order) in childrenlogs"
          :key="order"
          :childlog="Log"
          :order="order"
          @change="updateChildrenLogs"
        >
        </ingredient>
      </div>
    </div>
    <button @click="executeCraftLog()">追加/更新</button>
  </div>
</template>

<script>
import firebase from "@/firebase.js";
import BaseModal from "@/components/Console/modal/BaseModal.vue";
import Ingredient from "@/components/Console/Ingredient.vue";
import IconList from "@/components/Console/IconList.vue";
import CategoryList from "@/components/Console/BaseRadioButtonList.vue";
import StoreList from "@/components/Console/StoreList.vue";
import divisions from "../../assets/category.json";

export default {
  name: "LogRegister",
  components: {
    Ingredient,
    IconList,
    BaseModal,
    CategoryList,
    StoreList
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

      lodestone: "",
      eriones: "",

      collectionarea: "",
      areaXpoint: "",
      areaYpoint: "",

      isUpadateMode: false,
      Paths: [
        { url: "Material/Raw/" },
        { url: "Material/End/" },
        { url: "Material/Middle/" }
      ],

      logs: [],
      icons: []
    };
  },
  created() {
    //必要アイテムの配列を初期化し、最初から配列の中身を作っておく
    for (let step = 0; step < 6; step++) {
      let child = { isEnable: false, order: step };
      this.childrenlogs.push(child);
    }
  },
  computed: {
    DivisionInfo() {
      return divisions;
    },
    checkedMeister() {
      return this.other === "Meister";
    },
    itemicon() {
      if (this.imageurl === "") {
        return "static/none.png";
      } else {
        return this.imageurl;
      }
    },
    engnameRegex: {
      set(engname) {
        this.engname = engname.replace(/\s/g, "");
      },
      get() {
        return this.engname;
      }
    }
  },
  methods: {
    async executeCraftLog() {
      if (this.name === "" && this.engname === "") {
        alert("名前が入力されていません");
        return;
      }

      if (this.level === 0 && this.itemlevel === 0) {
        alert("レベルが入力されていません");
        return;
      }

      if (this.imageurl === "") {
        alert("画像が選択されていません");
        return;
      }

      const updatelog = this.createUpdateLog();

      //FirestoreのドキュメントIDは名前にIDを意味のあるユニークIDにしたいためアイテムの英語名を使用する
      // なので英語名がない場合は拒否する
      await firebase
        .firestore()
        .collection("CraftLog")
        .doc(this.engname)
        .set(updatelog)
        .then(() => {
          alert("登録が完了しました");
        })
        .catch(error => {
          console.error("Firestore Error", error);
          alert("登録に失敗しました");
        });

      //Vuexに一時キャッシュを行い、次回以降再度利用できるようにする
      this.$store.dispatch("log/cacheAdditionalData", {
        crafter: this.job,
        logs: [updatelog]
      });
    },

    /**
     * Firestoreより製作レシピを取得する
     * @param {Object}  query - FirestoreにつかうQueryキー
     */
    async fetchlogs(query) {
      //一時キャッシュ内に該当データが無いかを検索して、あったらキャッシュデータを使い通信量を節約する
      const templogs = await this.$store
        .dispatch("log/searchStateTempData", query)
        .then(value => value);

      //キャッシュされているデータの最大Lvと最小Lvを取得し、実際にどのLvから取得スべきかの判断材料としたい

      //オブジェクトの中身があるかを確認し、あるならキャッシュしていると考えてそっちを使う
      if (Object.keys(templogs).length != 0) {
        return (this.icons = templogs.list);
      }

      //Firestoreからデータを取り出すクエリを作成する
      const docRef = firebase.firestore().collection("CraftLog");
      //すべてを取得するのは負荷がかかるため、選択したクラフターと同じもので、IL帯で絞り込みを行えるようにする
      const queryRef = docRef
        .where("type.job", "==", query.crafter)
        .where("level.itemlevel", "<=", query.upperItemlevel)
        .where("level.itemlevel", ">=", query.lowerItemlevel);

      //DBへ問い合わせるlog
      const storelogs = await queryRef
        .get()
        .then(querySnapshot => {
          return querySnapshot.docs.map(doc => doc.data());
        })
        .catch(error => {
          console.error("Firest Error getting document", error);
        });

      this.logs = storelogs;

      //Vuexに一時キャッシュを行い、次回以降再度利用できるようにする
      this.$store.dispatch("log/cachelistAcquiredfromDB", {
        crafter: query.crafter,
        logs: storelogs
      });
    },
    /**
     * Firestoreよりアイコン画像を取得する
     * @param {Object}  key - FirestoreにつかうQueryキー
     */
    async fetchIconlist(key) {
      //一時キャッシュ内に該当データが無いかを検索して、あったらキャッシュデータを使い通信量を節約する
      const tempicon = await this.$store
        .dispatch("icon/searchStateTempData", key)
        .then(value => {
          return value;
        });

      //オブジェクトの中身があるかを確認し、あるならキャッシュしていると考えてそっちを使う
      if (Object.keys(tempicon).length != 0) {
        this.icons = tempicon.list;
        return;
      }

      // 選択した内容から、Firestoreへ通信を行うdocumentを作成する
      const documentRef = firebase
        .firestore()
        .collection("Image")
        .doc(key.document)
        .collection(key.collection)
        .where("Type", "==", key.rank)
        .where("MaterialType", "==", key.detail);

      const storeicons = await documentRef
        .get()
        .then(querySnapshot => {
          return querySnapshot.docs.map(doc => doc.data());
        })
        .catch(error => {
          console.error("Firest Error getting document", error);
        });

      this.icons = storeicons;

      const list = { list: storeicons };

      //Vuexに一時キャッシュを行い、次回以降再度利用できるようにする
      this.$store.dispatch("icon/cachelistAcquiredfromDB", {
        ...key,
        ...list
      });
    },

    /**
     * Firestoreに書き込みを行うオブジェクトを作成する
     */
    createUpdateLog() {
      //選択した[段階]のオブジェクト情報がほしいため検索する
      const rank = this.DivisionInfo.rank.find(rank => {
        return rank.type === this.rank;
      });

      //選択した[秘伝書]のオブジェクト情報がほしいため検索する
      const MeisterBookRank =
        this.MeisterBookNumber === ""
          ? 0
          : this.DivisionInfo.MeisterBook.find(MeisterBook => {
              return MeisterBook.type === this.MeisterBookNumber;
            });

      //初期作成時間とアップデート時間を記録しておきたいので、Firestoreのサーバータイムを取得する
      const servertime = firebase.firestore.FieldValue.serverTimestamp();

      // console.log(servertime);

      // 更新モードの時は初期作成時間を上書きしたくないため、元々あるのをつかう
      const createtime = this.isUpadateMode ? this.createtime : servertime;

      return {
        //アイテム名
        text: {
          name: this.name,
          engname: this.engnameRegex
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

        createTime: createtime,
        updateTime: servertime,

        gathering: {
          collectionarea: "",
          Xpoint: "",
          Zpoint: ""
        },

        website: {
          lodestone: "",
          eriones: ""
        }
      };
    },
    setCraftLog(Data) {
      console.log(Data);
      //編集前に戻す用のために、取得したデータをバックアップする
      //でもこのページから移動したら消したいのでComponent内のみで保持する
      this.BackUpData = Data;

      //編集用データとして変数へ代入する
      //アイテム名とアイコンのパス
      this.name = Data.text.name;
      this.engname = Data.text.engname;

      //レベル情報
      this.level = Data.level.level;
      this.itemlevel = Data.level.itemlevel;

      this.imageurl = Data.imageurl;

      //製作可能ジョブと製作段階の情報とマイスターが必須かどうか
      this.craftcontent = Data.type.craftcontent;
      this.job = Data.type.job;
      this.category = Data.type.category;

      // const MeisterBook =
      //   Data.type.MeisterBookrank === 0
      //     ? ""
      //     : this.DivisionInfo.MeisterBook.find(MeisterBook => {
      //         return MeisterBook.rank === Data.type.MeisterBookrank;
      //       });

      // this.MeisterBookNumber = MeisterBook.type;

      this.rank = Data.rank;

      //必要な素材の情報
      this.childrenlogs = Data.childrenlogs;

      //更新モードをオンにし、FireStoreへ書き込み時に同じドキュメントへ書き込むようにする
      this.isUpadateMode = true;
    },
    /**
     * 入力した内容へ配列を更新する
     *
     */
    updateChildrenLogs(value) {
      // 同インデックスの場所を更新したいので、配列のどこにあるかインデックスを取得する
      const updateIndex = this.childrenlogs
        .map(Log => Log.order)
        .indexOf(value.order);

      // //配列の中身を更新したいオブジェクトで置換する
      this.childrenlogs.splice(updateIndex, 1, value);
    },
    /**
     * URLを代入する
     */
    onModalIconClick(url) {
      this.imageurl = url;
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
