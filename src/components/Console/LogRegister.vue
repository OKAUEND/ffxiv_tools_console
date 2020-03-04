<template>
  <div class="LogRegister">
    <div v-if="isUpadateMode">更新モード</div>
    <div v-else-if="!isUpadateMode">新規追加モード</div>
    <button @click="isUpadateMode = false">新規追加モードへ</button>
    <div>
      <div>名前:<input type="text" v-model="CraftingLog.name" /></div>
      <div>画像パス:<input type="text" v-model="CraftingLog.image" /></div>
      <div class="LogRegister__Ingredients">
        <ingredient
          :storeLog="CraftingLog.Ingredients.slot0"
          @change="setSlot0"
        />
        <ingredient
          :storeLog="CraftingLog.Ingredients.slot1"
          @change="setSlot1"
        />
        <ingredient
          :storeLog="CraftingLog.Ingredients.slot2"
          @change="setSlot2"
        />
        <ingredient
          :storeLog="CraftingLog.Ingredients.slot3"
          @change="setSlot3"
        />
        <ingredient
          :storeLog="CraftingLog.Ingredients.slot4"
          @change="setSlot4"
        />
        <ingredient
          :storeLog="CraftingLog.Ingredients.slot5"
          @change="setSlot5"
        />
      </div>
    </div>
    <button @click="writeInterface()">追加/更新</button>
    <ul>
      <li v-for="(Log, ID) in Logs" :key="ID">
        <button @click="bindLog(Log)">{{ Log.name }}</button>
      </li>
    </ul>
  </div>
</template>

<script>
// import firebase from "@/firebase.js";
import Ingredient from "@/components/Console/Ingredient.vue";
export default {
  name: "LogRegister",
  components: {
    Ingredient
  },
  data() {
    return {
      CraftingLog: {
        name: "",
        image: "",
        Ingredients: {
          slot0: {},
          slot1: {},
          slot2: {},
          slot3: {},
          slot4: {},
          slot5: {}
        }
      },
      name: "TEST",
      Icon: "TEST",
      slot0: { isEnable: false },
      slot1: { isEnable: false },
      slot2: { isEnable: false },
      slot3: { isEnable: false },
      slot4: { isEnable: false },
      slot5: { isEnable: false },
      Logs: [],
      isUpadateMode: false
    };
  },
  computed: {
    IngredientSlot0: {
      set(val) {
        this.slot0 = val;
      },
      get() {
        return this.slot0;
      }
    },
    IngredientSlot1: {
      set(val) {
        this.slot1 = val;
      },
      get() {
        return this.slot1;
      }
    },
    IngredientSlot2: {
      set(val) {
        this.slot2 = val;
      },
      get() {
        return this.slot2;
      }
    },
    IngredientSlot3: {
      set(val) {
        this.slot3 = val;
      },
      get() {
        return this.slot3;
      }
    },
    IngredientSlot4: {
      set(val) {
        this.slot4 = val;
      },
      get() {
        return this.slot4;
      }
    },
    IngredientSlot5: {
      set(val) {
        this.slot5 = val;
      },
      get() {
        return this.slot5;
      }
    }
  },
  methods: {
    setSlot0(val) {
      this.IngredientSlot0 = val;
    },
    setSlot1(val) {
      this.IngredientSlot1 = val;
    },
    setSlot2(val) {
      this.IngredientSlot2 = val;
    },
    setSlot3(val) {
      this.IngredientSlot3 = val;
    },
    setSlot4(val) {
      this.IngredientSlot4 = val;
    },
    setSlot5(val) {
      this.IngredientSlot5 = val;
    }
    //   async createdComponent() {
    //     const docRef = firebase
    //       .firestore()
    //       .collection("CraftingLog")
    //       .orderBy("ID");
    //     const storeLogs = await docRef
    //       .get()
    //       .then(querySnapshot => {
    //         const docs = querySnapshot.docs.map(doc => doc.data());
    //         alert("First Getting Document");
    //         return docs;
    //       })
    //       .catch(error => {
    //         console.error("Firest Error getting document", error);
    //       });
    //     this.Logs = storeLogs;
    //   },
    //   async createCollectionRef(DocumentPath) {
    //     return firebase.firestore().doc(DocumentPath);
    //   },
    //   async createFirestoreDocRef(DocumentPath) {
    //     const DocRef = await firebase.firestore().doc(DocumentPath);
    //     return await DocRef.get().then(function(doc) {
    //       return doc.data();
    //     });
    //   },
    //   async createIngredientsArray(Ingredients) {
    //     console.log("Ingredients", Ingredients);

    //     const Slot0Ingredients = await this.testFunction(
    //       Ingredients.slot0.ChildDocument.path
    //     );

    //     const Slot0Data = { ...Slot0Ingredients, value: Ingredients.slot0.value };

    //     console.log("Slot0Data", Slot0Data);

    //     console.log("Slot1", Ingredients.slot1);
    //     const Slot1Ingredients = await this.testFunction(
    //       Ingredients.slot1.ChildDocument.path
    //     );
    //     console.log("Slot1", Ingredients.slot1.ChildDocument.path);
    //     const Slot1Data = { ...Slot1Ingredients, value: Ingredients.slot1.value };
    //     console.log("Slot1Data", Slot1Data);
    //     return Slot0Data;
    //   },
    //   async testFunction(IngredientPath) {
    //     const LogData = await this.createFirestoreDocRef(IngredientPath).then(
    //       value => {
    //         return value;
    //       }
    //     );

    //     //子の必須素材情報がなかった場合は、処理を抜ける
    //     //フラグ管理にしたほうがいいかもしれない
    //     if (LogData.Ingredients === undefined) {
    //       return {
    //         name: LogData.name,
    //         image: LogData.image
    //       };
    //     }

    //     //再帰的に処理をし、親から見て孫の素材情報を取得する
    //     const ChildIngredients = await this.createIngredientsArray(
    //       LogData.Ingredients
    //     ).then(value => {
    //       console.log("Ingredients", value);
    //       return value ? value : [];
    //     });
    //     return {
    //       name: LogData.name,
    //       image: LogData.image,
    //       ingredients: ChildIngredients
    //     };
    //   },
    //   writeInterface() {
    //     const Ingredients = {
    //       slot0: this.IngredientSlot0,
    //       slot1: this.IngredientSlot1,
    //       slot2: this.IngredientSlot2,
    //       slot3: this.IngredientSlot3,
    //       slot4: this.IngredientSlot4,
    //       slot5: this.IngredientSlot5
    //     };
    //     const NewLogDataNoID = {
    //       name: this.CraftingLog.name,
    //       image: this.CraftingLog.image,
    //       Ingredients: Ingredients
    //     };
    //     if (this.isUpadate === true) {
    //       console.log("NEW", "新規作成");
    //       // this.writeStoreLog(NewLogDataNoID);
    //     } else if (!this.isUpadate) {
    //       this.updateStoreLog(NewLogDataNoID);
    //       console.log("UPDATE", "更新");
    //     }
    //   },
    //   async writeStoreLog(NewLogDataNoID) {
    //     const LogCollection = firebase.firestore().collection("CraftingLog");
    //     const LastLog = LogCollection.orderBy("ID", "desc").limit(1);
    //     const Logs = await LastLog.get()
    //       .then(function(querySnapshot) {
    //         const DocID = querySnapshot.docs.map(doc => doc.data().ID)[0];
    //         const ID = DocID > 0 ? DocID + 1 : 6;

    //         const LogData = { ...NewLogDataNoID, ID: ID };
    //         return firebase
    //           .firestore()
    //           .collection("CraftingLog")
    //           .doc(String(ID))
    //           .set(LogData);
    //       })
    //       .then(function() {
    //         console.log("Document successfully written!");
    //         const DocID = firebase
    //           .firestore()
    //           .collection("CraftingLog")
    //           .orderBy("ID");
    //         return DocID.get();
    //       })
    //       .then(function(querySnapshot) {
    //         const docs = querySnapshot.docs.map(doc => doc.data());
    //         console.log(docs);
    //         return docs;
    //       })
    //       .catch(function(error) {
    //         console.error("Error writing document: ", error);
    //       });

    //     console.log("RESULT", Logs);
    //     this.Logs = Logs;
    //   },
    //   async updateStoreLog(NewLogDataNoID) {
    //     console.log("UPDATE", NewLogDataNoID);
    //   },
    //   bindLog(Log) {
    //     console.log("BIND", Log);
    //     console.log("BIND", Log.name);
    //     this.CraftingLog = Log;
    //     this.isUpadateMode = true;
    //   }
  }
};
</script>

<style lang="scss">
.LogRegister {
  display: flex;
  align-items: center;
  flex-direction: column-reverse;

  @media screen and (min-width: 780px) {
    flex-direction: row;
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
