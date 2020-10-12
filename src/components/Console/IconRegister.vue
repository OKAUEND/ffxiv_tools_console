<template>
  <div class="IconManagement">
    <h1>画像管理</h1>

    <article>
      <icon-list-query @change="onChildClick" />
    </article>

    <input type="text" v-model="engnameRegex" placeholder="アイテム名(英語)" />

    <input type="file" @change="e => setUploadFile(e.target.files[0])" />
    <img class="icon" :src="ImgFile" />
    <div class="IconManagement__Status">{{ ProcessingStatusComment }}</div>
    <button @click="updateStorageAndFirestore()">
      Store更新
    </button>
    <ul class="IconManagement__Icons">
      <li v-for="(Icon, ID) in icons" :key="ID">
        <button @click="applyVueData(Icon)">
          <img class="MediumSize" :src="Icon.URL" />
        </button>
      </li>
    </ul>
    <button @click="fetchIconAllList()">アイコン取得</button>
    <button @click="fetchIcons()">条件取得</button>
  </div>
</template>

<script>
import firebase from "../../firebase.js";
import IconListQuery from "@/components/Console/IconListQuery.vue";

export default {
  name: "IconManagement",
  components: {
    IconListQuery
  },
  data() {
    return {
      statusComments: ["準備中", "登録中", "登録完了"],
      category: "",
      rank: "",
      detail: "",
      crafter: "",
      engname: "",

      file: {},
      imagefile: "",
      progressstatus: 0,
      icons: []
    };
  },
  computed: {
    engnameRegex: {
      set(engname) {
        this.engname = engname.replace(/\s/g, "");
      },
      get() {
        return this.engname;
      }
    },

    ProcessingStatusComment() {
      return this.statusComments[this.progressstatus];
    },
    ImgFile() {
      if (this.imagefile === "") {
        return "static/none.png";
      } else {
        return this.imagefile;
      }
    }
  },
  methods: {
    onChildClick(value) {
      this.category = value.document;
      this.rank = value.rank;
      this.detail = value.detail;
    },
    /*
        @param   {file}    file  - 画像ファイル
    */
    setUploadFile(file) {
      //ステータスを準備中を示す0にする
      this.progressstatus = 0;

      //先に初期化を行い、選択されなかったときでもリセットがかかるようにする
      this.imagefile = "";
      this.file = {};
      if (!file) {
        return;
      }
      this.renderImageFile(file);
      this.file = file;
    },

    /*
        @param   {file}    file  - 画像ファイル
    */
    renderImageFile(file) {
      const render = new FileReader();
      render.onload = e => {
        this.imagefile = e.target.result;
      };
      render.readAsDataURL(file);
    },

    async updateStorageAndFirestore() {
      if (!this.engnameRegex) {
        alert("アイテム名を入力してください");
        return;
      }

      //Storageのfullパスは、group名/type名/ドキュメント名.拡張子 で作成する
      const fullpath = `${this.createStoragePath}/${this.engnameRegex}.png`;

      //statusを進行中を示す1にする
      this.progressstatus = 1;
      //アップロード処理を開始する
      //先にstorageへアップロードを試み、成功したらFirestoreへアップロードしたファイルの情報を保存する
      this.uploadFirestorage(fullpath)
        .then(() => {
          console.log("Storage Upload Success");
          const GCP_FULLURL = `${process.env.VUE_APP_GCP_URL}${fullpath}`;
          //連番形式のドキュメント名は、Firestoreのバッドルールのため、アイテム名にする
          //なお、アイテム名はゲーム内で最初に登場したアイテムの名前を使用する
          return this.createFirestoreDocument(this.engnameRegex, GCP_FULLURL);
        })
        .then(() => {
          this.progressstatus = 2;
          console.log("Firestore Update Success");
        })
        //エラー処理は上側で行う
        .catch(error => {
          console.error({ error });
        });
    },

    /*
        @param   {string}    fullpath      - Storageの階層を示した文字列
        @return  {storage Reference}       - storage Referenceの結果を返す
    */
    async uploadFirestorage(fullpath) {
      const baseRef = firebase.storage().ref();
      const storageRef = baseRef.child(fullpath);
      return await storageRef.put(this.file);
    },

    /*
        @param   {string}    DocumentName  - 登録するドキュメント名
        @param   {string}    fullpath      - GCP Storageにある対象ファイルのURL
    */
    async createFirestoreDocument(DocumentName, GCP_URL) {
      //アイテムカテゴリー
      const GroupName = this.category;
      //製作段階
      const Rank = this.rank;
      //素材の種類
      const MaterialTypeName = this.detail;

      const storeDocument = {
        Group: GroupName,
        name: this.engnameRegex,
        Rank: Rank,
        MaterialType: MaterialTypeName,
        URL: GCP_URL
      };

      return await firebase
        .firestore()
        .collection("Image")
        .doc(GroupName)
        .collection(Rank)
        .doc(DocumentName)
        .set(storeDocument);
    },

    /*
        @param  {Boolean}  isMaterialTypeInfo  - 素材の情報を扱うかどうか
        @param  {string}   MaterialName        - 素材名
        @return {FirebaseQuery}                - FirestoreQueryを返す
    */
    createDocumentRef() {
      //材料のアイコンであった場合、種類で条件検索を行いたいため、
      //FirestoreQueryの作成方法を分ける
      return firebase
        .firestore()
        .collection("Image")
        .doc(this.category)
        .collection(this.rank)
        .where("Rank", "==", this.rank)
        .where("MaterialType", "==", this.detail);
    },
    fetchIcons() {
      this.icons.length = 0;
      const ImageRef = this.createDocumentRef();
      ImageRef.get().then(querySnapshot => {
        this.icons = querySnapshot.docs.map(doc => doc.data());
      });
    },

    /*
        @param  {Object}   storeData        - Firestoreから取得したオブジェクト
    */
    applyVueData(storeData) {
      //取得したIDを保持する
      this.engnameRegex = storeData.name;

      //取得した文字列を元に、配列のインデックスを取得しそれを変数へ反映
      this.category = storeData.Group;
      this.rank = storeData.Rank;
      this.detail = storeData.MaterialType;
      this.imagefile = storeData.URL;
    }
  }
};
</script>

<style lang="scss" scoped>
.IconManagement {
  display: flex;
  flex-direction: column;
  align-items: center;
  & .icon {
    height: 128px;
    width: 128px;
  }

  & .MediumSize {
    height: 90px;
    width: 90px;
  }

  &__Icons {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }
}

.RadioList {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 50%;
  margin: 0 auto;
}

.ConsoleInput {
  width: 120px;
  display: flex;
  margin: 2px;
}
</style>
