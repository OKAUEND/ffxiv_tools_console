<template>
  <div class="IconManagement">
    <div>
      <div v-if="!isUpadateMode">新規追加モード</div>
      <div v-else-if="isUpadateMode && !isUpdateStoreOnly">全体更新モード</div>
      <div v-else-if="isUpadateMode && isUpdateStoreOnly">
        Storeのみ更新モード
      </div>
      <button @click="isUpadateMode = !isUpadateMode">
        モード切り替え
      </button>
      <button @click="isUpdateStoreOnly = !isUpdateStoreOnly">
        更新範囲の切り替え
      </button>
    </div>
    <div>
      <input type="radio" id="Material" value="0" v-model.number="groupindex" />
      <label for="Material">素材</label>
      <input type="radio" id="Weapon" value="1" v-model.number="groupindex" />
      <label for="Weapon">武器</label>
      <input type="radio" id="Tools" value="2" v-model.number="groupindex" />
      <label for="Tools">道具</label>
      <input type="radio" id="Armor" value="3" v-model.number="groupindex" />
      <label for="Armor">防具</label>
    </div>
    <div class="RadioList">
      <div
        v-for="(Type, index) in selectTypes"
        :key="index"
        class="ConsoleInput"
      >
        <input
          type="radio"
          :id="Type.name"
          :value="index"
          v-model.number="typeindex"
        />
        <label :for="Type.name">{{ Type.name }}</label>
      </div>
    </div>
    <div class="RadioList">
      <div
        v-for="(MaterialType, index) in GroupMaterialTypes"
        :key="index"
        class="ConsoleInput"
      >
        <input
          type="radio"
          :id="MaterialType.name"
          :value="index"
          v-model.number="materialindex"
        />
        <label :for="MaterialType.name">{{ MaterialType.name }}</label>
      </div>
    </div>
    <input type="file" @change="e => setUploadFile(e.target.files[0])" />
    <img class="icon" :src="ImgFile" />
    <div class="IconManagement__Status">{{ ProcessingStatusComment }}</div>
    <button v-if="!isUpadateMode" @click="updateStorageAndFirestore()">
      新規追加
    </button>
    <button
      v-if="isUpadateMode && !isUpdateStoreOnly"
      @click="updateStorageAndFirestore()"
    >
      更新
    </button>
    <button
      v-else-if="isUpadateMode && isUpdateStoreOnly"
      @click="updateFirestore()"
    >
      Storeのみ更新
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
import Group from "@/IconGroup.js";
export default {
  name: "IconManagement",
  data() {
    return {
      statusComments: ["準備中", "登録中", "登録完了"],
      groupindex: 0,
      typeindex: 0,
      materialindex: 0,
      imagefile: "",
      icons: [],
      file: {},
      isUpadateMode: false,
      isUpdateStoreOnly: false,
      storedocumentID: 0,
      progressstatus: 0
    };
  },
  computed: {
    selectGroups() {
      return Group.groups[this.groupindex];
    },
    selectTypes() {
      return Group.types[this.groupindex];
    },
    selectMaterialType() {
      return this.selectGroups.isMaterialTypeInfo === true
        ? Group.materialtype[this.materialindex]
        : { name: "none" };
    },
    GroupMaterialTypes() {
      return Group.materialtype;
    },
    createStoragePath() {
      const group = this.selectGroups.name;
      const type = this.selectTypes[this.typeindex].name;
      return `${group}/${type}`;
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
      //Firestoreのドキュメントで最後のIDから1つ先に追加したいので最後のIDを取得する
      const id = await this.fetchLastID().then(value => {
        return this.isUpadateMode ? value : value + 1;
      });

      //ドキュメント名を、Type+5桁0埋めのIDで作成するために0埋め番号文字列を作成する
      const ZeroPaddingNumber = `"00000${id}`.slice(-5);

      //Type名と0埋め番号文字列を結合し、ドキュメント名を作成する
      const typename = this.selectTypes[this.typeindex].name;
      const documentName = `${typename}${ZeroPaddingNumber}`;

      //Storageのfullパスは、group名/type名/ドキュメント名.拡張子 で作成する
      const fullpath = `${this.createStoragePath}/${documentName}.png`;

      //statusを進行中を示す1にする
      this.progressstatus = 1;
      //アップロード処理を開始する
      //先にstorageへアップロードを試み、成功したらFirestoreへアップロードしたファイルの情報を保存する
      this.uploadFirestorage(fullpath)
        .then(() => {
          console.log("Storage Upload Success");
          const GCP_FULLURL = `${process.env.VUE_APP_GCP_URL}${fullpath}`;
          return this.createFirestoreDocument(documentName, id, GCP_FULLURL);
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

    async updateFirestore() {
      //Storeにすでに存在するデータを上書きするため、取得したIDを使用する
      //ドキュメント名を、Type+5桁0埋めのIDで作成するために0埋め番号文字列を作成する
      const ZeroPaddingNumber = `"00000${this.storedocumentID}`.slice(-5);

      //Type名と0埋め番号文字列を結合し、ドキュメント名を作成する
      const typename = this.selectTypes[this.typeindex].name;
      const documentName = `${typename}${ZeroPaddingNumber}`;

      //statusを進行中を示す1にする
      this.progressstatus = 1;

      this.createFirestoreDocument(
        documentName,
        this.storedocumentID,
        this.imagefile
      ).then(() => {
        console.log("Firestore Update Success");
        this.progressstatus = 2;
        //更新作業が終わったので初期化する
        this.storedocumentID = 0;
        this.isUpdateStoreOnly = false;
        this.isUpadateMode = false;
        this.groupindex = 0;
        this.typeindex = 0;
        this.materialindex = 0;
        this.imagefile = "";
      });
    },

    /*
        @param   {string}    DocumentName  - 登録するドキュメント名
        @param   {Number}    DocumentID    - 登録するID番号
        @param   {string}    fullpath      - GCP Storageにある対象ファイルのURL
    */
    async createFirestoreDocument(DocumentName, DocumentID, GCP_URL) {
      const GroupName = this.selectGroups.name;
      const TypeName = this.selectTypes[this.typeindex].name;
      const MaterialTypeName = this.selectMaterialType.name;

      const storeDocument = {
        ID: DocumentID,
        Group: GroupName,
        Type: TypeName,
        MaterialType: MaterialTypeName,
        URL: GCP_URL
      };

      return await firebase
        .firestore()
        .collection("Image")
        .doc(this.selectGroups.name)
        .collection(this.selectTypes[this.typeindex].name)
        .doc(DocumentName)
        .set(storeDocument);
    },

    /*
        @return {Number}                - Firestoreに存在する最後のIDか、なかった場合は1を返す
    */
    async fetchLastID() {
      const documentRef = firebase
        .firestore()
        .collection("Image")
        .doc(this.selectGroups.name)
        .collection(this.selectTypes[this.typeindex].name);

      const lastdocument = documentRef.orderBy("ID", "desc").limit(1);

      const querySnapshot = await lastdocument.get();
      const id = querySnapshot.docs.map(doc => doc.data().ID)[0];
      //取得した数値が0もしくは存在しない場合には、0を返すようにして初期値を生成する
      return id > 0 ? id : 0;
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
        .doc(this.selectGroups.name)
        .collection(this.selectTypes[this.typeindex].name)
        .where("Type", "==", this.selectTypes[this.typeindex].name)
        .where(
          "MaterialType",
          "==",
          this.selectMaterialType[this.materialindex].name
        );
    },
    fetchIcons() {
      this.icons.length = 0;
      const ImageRef = this.createDocumentRef(
        this.selectGroups.isMaterialTypeInfo,
        this.selectTypes[this.typeindex].name,
        this.selectMaterialTypes[this.materialindex].name
      );
      ImageRef.get().then(querySnapshot => {
        this.icons = querySnapshot.docs
          .map(doc => doc.data())
          .map(Doc => {
            return {
              ID: Doc.ID,
              Group: Doc.Group,
              Type: Doc.Type,
              MaterialType: Doc.MaterialType,
              URL: Doc.URL
            };
          });
      });
    },

    /*
        @param  {Object}   storeData        - Firestoreから取得したオブジェクト
    */
    applyVueData(storeData) {
      this.isUpdateStoreOnly = true;
      this.isUpadateMode = true;
      console.log({ storeData });

      //取得したIDを保持する
      this.storedocumentID = storeData.ID;

      //取得した文字列を元に、配列のインデックスを取得しそれを変数へ反映
      this.groupindex = this.groups.findIndex(
        group => group.name === storeData.Group
      );
      this.typeindex = this.types[this.groupindex].findIndex(
        type => type.name === storeData.Type
      );
      this.materialindex = this.materialtype.findIndex(
        material => material.name === storeData.MaterialType
      );
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
