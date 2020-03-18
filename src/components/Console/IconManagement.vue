<template>
  <div>
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
      <div v-for="(Type, index) in selectTypes" :key="index">
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
      <div v-for="(MaterialType, index) in selectMaterialTypes" :key="index">
        <input
          type="radio"
          :id="MaterialType.name"
          :value="index"
          v-model.number="MaterialNumber"
        />
        <label :for="MaterialType.name">{{ MaterialType.name }}</label>
      </div>
    </div>
    <label>名前</label>
    <input type="text" />
    <input type="file" @change="e => setUploadFile(e.target.files[0])" />
    <img :src="imagefile" />
    <button>追加</button>
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
        { name: "Material", isChildType: true },
        { name: "Weapon", isChildType: false },
        { name: "Tools", isChildType: false },
        { name: "Armor", isChildType: false },
        { name: "House", isChildType: false }
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
      imagefile: ""
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
      return this.selectGroups.isChildType === true ? this.materialtype : [];
    },
    createStoragePath() {
      const group = this.selectGroups.name;
      const type = this.selectTypes[this.selecttype].name;
      return `${group}/${type}`;
    }
  },
  methods: {
    setUploadFile(file) {
      if (!file) {
        //何も無い時はインスタンスも初期化し、何も表示しないようにしておく
        this.imagefile = "";
        return;
      }
      this.renderImageFile(file);
      const storageRef = firebase.storage().ref();
      const mountainImageRef = storageRef.child(this.createStoragePath);
      console.log(mountainImageRef);
    },
    renderImageFile(file) {
      const render = new FileReader();
      render.onload = e => {
        this.imagefile = e.target.result;
      };
      render.readAsDataURL(file);
    },
    createDocumentRef(isChildType, MaterialName) {
      if (isChildType) {
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
      const ImageRef = this.createDocumentRef(
        false,
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
    },
    fetchIcons() {
      this.iconpath.length = 0;
      const ImageRef = this.createDocumentRef(
        this.selectGroups.isChildType,
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
.RadioList {
  display: flex;
  flex-direction: row;
  justify-content: center;
  flex-wrap: wrap;
  width: 50%;
  margin: 0 auto;
}
</style>
