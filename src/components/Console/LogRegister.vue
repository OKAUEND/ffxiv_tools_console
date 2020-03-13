<template>
  <div class="LogRegister">
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
        <div>
          段階:
          <input type="radio" id="Raw" value="0" v-model.number="crafttype" />
          <label for="Raw">原材</label>
          <input type="radio" id="End" value="1" v-model.number="crafttype" />
          <label for="End">末端</label>
          <input
            type="radio"
            id="Middle"
            value="2"
            v-model.number="crafttype"
          />
          <label for="Middle">中間</label>
          <input
            type="radio"
            id="Complete"
            value="3"
            v-model.number="crafttype"
          />
          <label for="Complete">完成</label>
        </div>
        <div>
          種別:
          <input type="radio" id="Battle" value="0" v-model.number="loggroup" />
          <label for="Battle">戦闘</label>
          <input
            type="radio"
            id="NoBattle"
            value="1"
            v-model.number="loggroup"
          />
          <label for="NoBattle">非戦闘</label>
          <input
            type="radio"
            id="Fashionable"
            value="2"
            v-model.number="loggroup"
          />
          <label for="Fashionable">おしゃれ</label>
          <input
            type="radio"
            id="Furniture"
            value="3"
            v-model.number="loggroup"
          />
          <label for="Furniture">家具</label>
          <input
            type="radio"
            id="GardenTools"
            value="4"
            v-model.number="loggroup"
          />
          <label for="GardenTools">庭具</label>
        </div>
        <div>
          作成ジョブ:
          <input type="radio" id="Carpenter" value="0" v-model.number="job" />
          <label for="Carpenter">木工</label>
          <input type="radio" id="Blacksmith" value="1" v-model.number="job" />
          <label for="Blacksmith">鍛冶</label>
          <input type="radio" id="Armorer" value="2" v-model.number="job" />
          <label for="Armorer">甲冑</label>
          <input type="radio" id="Goldsmith" value="3" v-model.number="job" />
          <label for="Goldsmith">彫金</label>
          <input
            type="radio"
            id="Leatherworker"
            value="4"
            v-model.number="job"
          />
          <label for="Leatherworker">革細工</label>
          <input type="radio" id="Weaver" value="5" v-model.number="job" />
          <label for="Weaver">裁縫</label>
          <input type="radio" id="Alchemist" value="6" v-model.number="job" />
          <label for="Alchemist">錬金</label>
          <input type="radio" id="Culinarian" value="7" v-model.number="job" />
          <label for="Culinarian">調理</label>
        </div>
      </section>
      <section>
        <h2>グループ</h2>
        <div>
          製作種別:
          <input
            type="radio"
            id="Nomal"
            value="0"
            v-model.number="craftgroup"
          />
          <label for="Nomal">通常</label>
          <input
            type="radio"
            id="Master"
            value="1"
            v-model.number="craftgroup"
          />
          <label for="Master">秘伝書</label>
          <input
            type="radio"
            id="IshgardianRestoration"
            value="2"
            v-model.number="craftgroup"
          />
          <label for="IshgardianRestoration">イシュガルド復興</label>
        </div>
        <template v-if="craftgroup === 0">
          <div>製作レベル:<input type="text" v-model.number="level" /></div>
          <div>
            アイテムレベル:<input type="text" v-model.number="itemlevel" />
          </div>
          <div>ランク<input type="text" v-model.number="rank" /></div
        ></template>
        <template v-if="craftgroup === 1">
          <div>秘伝書番号:<input type="text" v-model.number="master" /></div>
          <div>製作レベル:<input type="text" v-model.number="level" /></div>
          <div>ランク<input type="text" v-model.number="rank" /></div>
        </template>
        <template v-if="craftgroup === 2">
          <div>
            イシュガルド復興段階:<input
              type="text"
              v-model.number="contentversion"
            />
          </div>
          <div>製作レベル:<input type="text" v-model.number="level" /></div>
          <div>ランク<input type="text" v-model.number="rank" /></div>
          <div>
            高難易度ランク<input type="text" v-model.number="expertlevel" />
          </div>
        </template>
      </section>
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
      <li v-for="(Icon, ID) in iconpath" :key="ID">
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
      level: 0,
      rank: 0,
      itemlevel: 0,
      expertlevel: 0,
      job: 0,
      crafttype: 0,
      loggroup: 0,
      craftgroup: 0,
      master: 0,
      contentversion: 0,

      slot0: { isEnable: false, IngredientID: 0 },
      slot1: { isEnable: false, IngredientID: 0 },
      slot2: { isEnable: false, IngredientID: 0 },
      slot3: { isEnable: false, IngredientID: 0 },
      slot4: { isEnable: false, IngredientID: 0 },
      slot5: { isEnable: false, IngredientID: 0 },
      Logs: [],
      isUpadateMode: true,
      iconpath: [],
      Paths: [
        { url: "Material/Raw/" },
        { url: "Material/End/" },
        { url: "Material/Middle/" }
      ]
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
        Job: this.job,
        CraftGroup: this.craftgroup,
        Equipped: this.loggroup,
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
    writeInterface() {
      if (this.CraftingLog.name === "") {
        alert("名前が入力されていません");
        return;
      }

      this.fetchLastID().then(ID => {
        const LastID = ID > 0 ? ID : 1;
        const nextNumber =
          this.isUpadateMode === true ? this.CraftingLog.ID : LastID + 1;
        const UpdateScheduleLogdata = {
          ...this.UpdateScheduleData,
          Ingredients: this.Ingredients,
          ID: nextNumber
        };
        const ZeroPadding = `"0000000${nextNumber}`.slice(-7);
        const DocumentID = `Log${ZeroPadding}`;
        return this.writeStoreLog(DocumentID, UpdateScheduleLogdata);
      });
      // this.writeStoreLog(NewLogDataNoID);
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
    bindLog(Log) {
      this.CraftingLog = Log;
      this.Name = Log.Name;
      this.ImgUrl = Log.ImgUrl;
      this.isUpadateMode = true;
    },
    resetData() {
      Object.assign(this.$data, this.$options.data());
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
