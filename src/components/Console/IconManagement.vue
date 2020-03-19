<template>
  <div class="IconManagement">
    <div>
      <div v-if="isUpadateMode">更新モード</div>
      <div v-else-if="!isUpadateMode">新規追加モード</div>
      <button @click="isUpadateMode = !isUpadateMode">新規追加モードへ</button>
    </div>
    <div>
      <input
        type="radio"
        id="Material"
        value="0"
        v-model.number="selectgroup"
      />
      <label for="Material">素材</label>
      <input type="radio" id="Weapon" value="1" v-model.number="selectgroup" />
      <label for="Weapon">武器</label>
      <input type="radio" id="Tools" value="2" v-model.number="selectgroup" />
      <label for="Tools">道具</label>
      <input type="radio" id="Armor" value="3" v-model.number="selectgroup" />
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
          v-model.number="selecttype"
        />
        <label :for="Type.name">{{ Type.name }}</label>
      </div>
    </div>
    <div class="RadioList">
      <div
        v-for="(MaterialType, index) in selectMaterialTypes"
        :key="index"
        class="ConsoleInput"
      >
        <input
          type="radio"
          :id="MaterialType.name"
          :value="index"
          v-model.number="MaterialNumber"
        />
        <label :for="MaterialType.name">{{ MaterialType.name }}</label>
      </div>
    </div>
    <input type="file" @change="e => setUploadFile(e.target.files[0])" />
    <img class="icon" :src="imagefile" />
    <button @click="updateStorageAndFirestore()">全体更新/追加</button>
    <ul>
      <li v-for="(Icon, ID) in iconpath" :key="ID">
        <img :src="Icon.url" />
      </li>
    </ul>
    <button @click="fetchIconAllList()">アイコン取得</button>
    <button @click="fetchIcons()">条件取得</button>
  </div>
</template>

<script>
import firebase from "../../firebase.js";
export default {
  name: "IconManagement",
  data() {
    return {
      groups: [
        { name: "Material", isMaterialTypeInfo: true },
        { name: "Weapon", isMaterialTypeInfo: false },
        { name: "Tools", isMaterialTypeInfo: false },
        { name: "Armor", isMaterialTypeInfo: false },
        { name: "House", isMaterialTypeInfo: false }
      ],
      types: [
        [{ name: "Raw" }, { name: "End" }, { name: "Middle" }],
        [
          { name: "Gladiator" },
          { name: "Marauder" },
          { name: "DarkKnight" },
          { name: "Gunbreaker" },
          { name: "Lancer" },
          { name: "Pugilist" },
          { name: "Samurai" },
          { name: "Rogue" },
          { name: "Archer" },
          { name: "Machinist" },
          { name: "Dancer" },
          { name: "Thaumaturge" },
          { name: "Arcanist" },
          { name: "RedMage" },
          { name: "BlueMage" },
          { name: "Conjurer" },
          { name: "Scholar" },
          { name: "Astrologian" }
        ],
        [
          { name: "Carpenter" },
          { name: "Blacksmith" },
          { name: "Armorer" },
          { name: "Goldsmith" },
          { name: "Leatherworker" },
          { name: "Weaver" },
          { name: "Alchemist" },
          { name: "Culinarian" },
          { name: "Miner" },
          { name: "Botanist" },
          { name: "Fisher" }
        ],
        [
          { name: "Shield" },
          { name: "Head" },
          { name: "Body" },
          { name: "Hands" },
          { name: "Waist" },
          { name: "Legs" },
          { name: "Feet" },
          { name: "Earrings" },
          { name: "Necklace" },
          { name: "Bracelets" },
          { name: "Ring" }
        ]
      ],
      materialtype: [
        { name: "Ingredient" },
        { name: "Seafood" },
        { name: "Stone" },
        { name: "Metal" },
        { name: "Lumber" },
        { name: "Cloth" },
        { name: "Leather" },
        { name: "Bone" },
        { name: "Reagent" },
        { name: "Part" },
        { name: "GuildCraft" }
      ],
      selectgroup: 0,
      selectsubducument: 0,
      selectname: 0,
      selecttype: 0,
      MaterialNumber: 0,
      imagefile: "",
      iconpath: [],
      file: {},
      isUpadateMode: false
    };
  },
  computed: {
    selectGroups() {
      return this.groups[this.selectgroup];
    },
    selectTypes() {
      return this.types[this.selectgroup];
    },
    selectMaterialTypes() {
      return this.selectGroups.isMaterialTypeInfo === true
        ? this.materialtype
        : [];
    },
    createStoragePath() {
      const group = this.selectGroups.name;
      const type = this.selectTypes[this.selecttype].name;
      return `${group}/${type}`;
    }
  },
  methods: {
    /*
        @param   {file}    file  - 画像ファイル
    */
    setUploadFile(file) {
      if (!file) {
        //何も無い時はインスタンスも初期化し、何も表示しないようにしておく
        this.imagefile = "";
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
        return value;
      });

      //ドキュメント名を、Type+5桁0埋めのIDで作成するために0埋め番号文字列を作成する
      const ZeroPaddingNumber = `"00000${id}`.slice(-5);

      //Type名と0埋め番号文字列を結合し、ドキュメント名を作成する
      const typename = this.selectTypes[this.selecttype].name;
      const documentName = `${typename}${ZeroPaddingNumber}`;

      //Storageのfullパスは、group名/type名/ドキュメント名.拡張子 で作成する
      const fullpath = `${this.createStoragePath}/${documentName}.png`;

      //アップロード処理を開始する
      //先にstorageへアップロードを試み、成功したらFirestoreへアップロードしたファイルの情報を保存する
      this.uploadFirestorage(fullpath)
        .then(() => {
          console.log("Storage Upload Success");
          return this.createFirestoreDocument(documentName, id, fullpath);
        })
        .then(() => {
          console.log("Firestore Update Success");
        })
        //エラー処理は上側で行う
        .catch(error => {
          console.error({ error });
        });
    },

    /*
        @param   {string}    fullpath  - storageの階層フルパス
    */
    async uploadFirestorage(fullpath) {
      const baseRef = firebase.storage().ref();
      const storageRef = baseRef.child(fullpath);

      return await storageRef.put(this.file);
    },

    /*
        @param   {string}    DocumentName  - 登録するドキュメント名
        @param   {Number}    DocumentID    - 登録するID番号
        @param   {string}    fullpath      - storageの階層フルパス
    */
    async createFirestoreDocument(DocumentName, DocumentID, fullpath) {
      const Type =
        this.selectGroups.isMaterialTypeInfo === true
          ? this.selectMaterialTypes[this.MaterialNumber].name
          : this.selectTypes[this.selecttype].name;

      const GCP_fullurl = `${process.env.VUE_APP_GCP_URL}${fullpath}`;

      const storeDocument = {
        ID: DocumentID,
        Type: Type,
        URL: GCP_fullurl
      };

      return await firebase
        .firestore()
        .collection("Image")
        .doc(this.selectGroups.name)
        .collection(this.selectTypes[this.selecttype].name)
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
        .collection(this.selectTypes[this.selecttype].name);

      const lastdocument = documentRef.orderBy("ID", "desc").limit(1);

      const querySnapshot = await lastdocument.get();
      const id = querySnapshot.docs.map(doc => doc.data().ID)[0];
      //取得した数値が0もしくは存在しない場合には、1を返すようにして初期値を生成する
      return id > 0 ? id : 1;
    },

    /*
        @param  {Boolean}  isMaterialTypeInfo  - 素材の情報を扱うかどうか
        @param  {string}   MaterialName        - 素材名
        @return {FirebaseQuery}                - FirestoreQueryを返す
    */
    createDocumentRef(isMaterialTypeInfo = false, MaterialName = "") {
      //材料のアイコンであった場合、種類で条件検索を行いたいため、
      //FirestoreQueryの作成方法を分ける
      if (isMaterialTypeInfo) {
        return firebase
          .firestore()
          .collection("Image")
          .doc(this.selectGroups.name)
          .collection(this.selectTypes[this.selecttype].name)
          .where("Type", "==", MaterialName);
      } else {
        return firebase
          .firestore()
          .collection("Image")
          .doc(this.selectGroups.name)
          .collection(this.selectTypes[this.selecttype].name);
      }
    },
    fetchIconAllList() {
      this.iconpath.length = 0;
      const ImageRef = this.createDocumentRef();
      ImageRef.get().then(querySnapshot => {
        this.iconpath = querySnapshot.docs
          .map(doc => doc.data())
          .map(Doc => {
            return {
              ID: Doc.ID,
              url: Doc.URL
            };
          });
      });
    },
    fetchIcons() {
      this.iconpath.length = 0;
      const ImageRef = this.createDocumentRef(
        this.selectGroups.isMaterialTypeInfo,
        this.selectMaterialTypes[this.MaterialNumber].name
      );
      ImageRef.get().then(querySnapshot => {
        this.iconpath = querySnapshot.docs
          .map(doc => doc.data())
          .map(Doc => {
            return {
              ID: Doc.ID,
              url: Doc.URL
            };
          });
      });
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
