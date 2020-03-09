<template>
  <div class="LogRegister">
    <div v-if="isUpadateMode">更新モード</div>
    <div v-else-if="!isUpadateMode">新規追加モード</div>
    <button @click="isUpadateMode = false">新規追加モードへ</button>
    <div class="LogRegister__Body">
      <div>名前:<input type="text" v-model="Name" /></div>
      <div>
        種類:
        <input type="radio" id="Raw" value="0" v-model="crafttype" />
        <label for="Raw">原材</label>
        <input type="radio" id="End" value="1" v-model="crafttype" />
        <label for="End">末端</label>
        <input type="radio" id="Middle" value="2" v-model="crafttype" />
        <label for="Middle">中間</label>
        <input type="radio" id="Complete" value="3" v-model="crafttype" />
        <label for="Complete">完成</label>
      </div>
      <div>
        画像パス:<input type="text" v-model="Image" /><br />
        <button @click="fetchIcon()">取得</button><br />
        <img :src="ImgUrl" />
      </div>
      <div>
        下限レベル:<input
          type="text"
          v-model.number="CraftingLog.BottomLevel"
        />
      </div>
      <div>
        上限レベル:<input type="text" v-model.number="CraftingLog.UpperLevel" />
      </div>
      <div>
        アイテムレベル:<input
          type="text"
          v-model.number="CraftingLog.ItemLevel"
        />
      </div>
      <div class="LogRegister__Ingredients">
        <ingredient v-model="IngredientSlot0" :SortID="1" />
        <ingredient v-model="IngredientSlot1" :SortID="2" />
        <ingredient v-model="IngredientSlot2" :SortID="3" />
        <ingredient v-model="IngredientSlot3" :SortID="4" />
        <ingredient v-model="IngredientSlot4" :SortID="5" />
        <ingredient v-model="IngredientSlot5" :SortID="6" />
      </div>
    </div>
    <button @click="writeInterface()">追加/更新</button>
    <input type="text" placeholder="下限レベル" />
    <input type="text" placeholder="上限レベル" />
    <button @click="fetchCraftLogs()">取得</button>
    <ul>
      <li v-for="(Log, ID) in Logs" :key="ID">
        <button @click="bindLog(Log)">{{ Log.Name }}</button>
      </li>
    </ul>
    <ul>
      <li v-for="(Icon, index) in iconpath" :key="index">
        <img :src="Icon.url" />
      </li>
    </ul>
    <button @click="fetchIconsList()">アイコン取得</button>
  </div>
</template>

<script>
import firebase from "@/firebase.js";
import Ingredient from "@/components/Console/Ingredient.vue";
export default {
  name: "LogRegister",
  components: {
    Ingredient
  },
  data() {
    return {
      CraftingLog: {
        BottomLevel: 0,
        UpperLevel: 0,
        ItemLevel: 0,
        Ingredients: {
          slot0: {},
          slot1: {},
          slot2: {},
          slot3: {},
          slot4: {},
          slot5: {}
        }
      },
      Name: "",
      Icon: "",
      Image: "",
      ImgUrl: "",
      crafttype: 0,
      slot0: { isEnable: false, IngredientID: 0 },
      slot1: { isEnable: false, IngredientID: 0 },
      slot2: { isEnable: false, IngredientID: 0 },
      slot3: { isEnable: false, IngredientID: 0 },
      slot4: { isEnable: false, IngredientID: 0 },
      slot5: { isEnable: false, IngredientID: 0 },
      Logs: [],
      isUpadateMode: true,
      iconpath: []
    };
  },
  computed: {
    IngredientSlot0: {
      set(val) {
        this.slot0 = val;
      },
      get() {
        return this.CraftingLog.Ingredients.slot0;
      }
    },
    IngredientSlot1: {
      set(val) {
        this.slot1 = val;
      },
      get() {
        return this.CraftingLog.Ingredients.slot1;
      }
    },
    IngredientSlot2: {
      set(val) {
        this.slot2 = val;
      },
      get() {
        return this.CraftingLog.Ingredients.slot2;
      }
    },
    IngredientSlot3: {
      set(val) {
        this.slot3 = val;
      },
      get() {
        return this.CraftingLog.Ingredients.slot3;
      }
    },
    IngredientSlot4: {
      set(val) {
        this.slot4 = val;
      },
      get() {
        return this.CraftingLog.Ingredients.slot4;
      }
    },
    IngredientSlot5: {
      set(val) {
        this.slot5 = val;
      },
      get() {
        return this.CraftingLog.Ingredients.slot5;
      }
    },
    UpdateScheduleData() {
      return {
        Name: this.Name,
        ImgUrl: this.ImgUrl,
        Type: this.crafttype,
        UpperLevel: this.CraftingLog.UpperLevel,
        BottomLevel: this.CraftingLog.BottomLevel,
        ItemLevel: this.CraftingLog.ItemLevel
      };
    },
    Ingredients() {
      return {
        slot0: this.slot0,
        slot1: this.slot1,
        slot2: this.slot2,
        slot3: this.slot3,
        slot4: this.slot4,
        slot5: this.slot5
      };
    }
  },
  methods: {
    async fetchCraftLogs() {
      const docRef = firebase
        .firestore()
        .collection("CraftLog")
        .orderBy("ID");
      const storeLogs = await docRef
        .get()
        .then(querySnapshot => {
          const docs = querySnapshot.docs.map(doc => doc.data());
          alert("First Getting Document");
          return docs;
        })
        .catch(error => {
          console.error("Firest Error getting document", error);
        });
      this.Logs = storeLogs;
    },
    async createCollectionRef(DocumentPath) {
      return firebase.firestore().doc(DocumentPath);
    },
    async createFirestoreDocRef(DocumentPath) {
      const DocRef = await firebase.firestore().doc(DocumentPath);
      return await DocRef.get().then(function(doc) {
        return doc.data();
      });
    },
    async createIngredientsArray(Ingredients) {
      console.log("Ingredients", Ingredients);

      const Slot0Ingredients = await this.testFunction(
        Ingredients.slot0.ChildDocument.path
      );

      const Slot0Data = { ...Slot0Ingredients, value: Ingredients.slot0.value };

      console.log("Slot0Data", Slot0Data);

      console.log("Slot1", Ingredients.slot1);
      const Slot1Ingredients = await this.testFunction(
        Ingredients.slot1.ChildDocument.path
      );
      console.log("Slot1", Ingredients.slot1.ChildDocument.path);
      const Slot1Data = { ...Slot1Ingredients, value: Ingredients.slot1.value };
      console.log("Slot1Data", Slot1Data);
      return Slot0Data;
    },
    async testFunction(IngredientPath) {
      const LogData = await this.createFirestoreDocRef(IngredientPath).then(
        value => {
          return value;
        }
      );

      //子の必須素材情報がなかった場合は、処理を抜ける
      //フラグ管理にしたほうがいいかもしれない
      if (LogData.Ingredients === undefined) {
        return {
          name: LogData.name,
          image: LogData.image
        };
      }

      //再帰的に処理をし、親から見て孫の素材情報を取得する
      const ChildIngredients = await this.createIngredientsArray(
        LogData.Ingredients
      ).then(value => {
        console.log("Ingredients", value);
        return value ? value : [];
      });
      return {
        name: LogData.name,
        image: LogData.image,
        ingredients: ChildIngredients
      };
    },
    writeInterface() {
      if (this.CraftingLog.name === "") {
        alert("名前が入力されていません");
        return;
      }

      this.fetchLastID().then(ID => {
        const nextNumber = this.isUpadateMode ? ID : ID + 1;
        const Logdata = { ...NewLogDataNoID, ID: nextNumber };
        const ZeroPadding = `"0000000${nextNumber}`.slice(-7);
        const DocumentID = `Log${ZeroPadding}`;
        return this.writeStoreLog(DocumentID, Logdata);
      });
      // this.writeStoreLog(NewLogDataNoID);
    },
    async writeStoreLog(DocumentID, LogData) {
      return await firebase
        .firestore()
        .collection("CraftLog")
        .doc(DocumentID)
        .set(LogData);

      //   .then(function() {
      //     console.log("Document successfully written!");
      //     const DocID = firebase
      //       .firestore()
      //       .collection("CraftingLog")
      //       .orderBy("ID");
      //     return DocID.get();
      //   })
      //   .then(function(querySnapshot) {
      //     const docs = querySnapshot.docs.map(doc => doc.data());
      //     console.log(docs);
      //     return docs;
      //   })
      //   .catch(function(error) {
      //     console.error("Error writing document: ", error);
      //   });

      // console.log("RESULT", Logs);
      // this.Logs = Logs;
    },
    async fetchLastID() {
      const LogCollection = firebase.firestore().collection("CraftLog");
      const LastLog = LogCollection.orderBy("ID", "desc").limit(1);
      return await LastLog.get().then(function(querySnapshot) {
        return querySnapshot.docs.map(doc => doc.data().ID)[0];
      });
    },
    bindLog(Log) {
      console.log("BIND", Log);
      console.log("BIND", Log.name);
      this.CraftingLog = Log;
      this.Name = Log.Name;
      this.ImgUrl = Log.ImgUrl;
      this.isUpadateMode = true;
    },
    fetchIcon() {
      const storageRef = firebase.storage().ref();
      storageRef
        .child("Material/End/Wood1.png")
        .getDownloadURL()
        .then(url => {
          const test = url;
          console.log("TEST", test);
          this.iconpath = test;
        });
      console.log(this.iconpath);
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
