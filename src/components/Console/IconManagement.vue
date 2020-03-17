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
    <div class="RadioList Stage">
      <div v-for="(Stage, index) in selectStages" :key="index">
        <input
          type="radio"
          :id="Stage.name"
          :value="index"
          v-model.number="selectsubducument"
        />
        <label :for="Stage.name">{{ Stage.name }}</label>
      </div>
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
      <div v-for="(Role, index) in selectRoles" :key="index">
        <input
          type="radio"
          :id="Role.name"
          :value="index"
          v-model.number="selectrole"
        />
        <label :for="Role.name">{{ Role.name }}</label>
      </div>
    </div>
    <label>名前</label>
    <input type="text" />
    <input type="file" @change="e => setUploadFile(e.target.files[0])" />
    <img :src="imagefile" />
    <button>追加</button>
  </div>
</template>

<script>
import firebase from "../../firebase.js";
export default {
  name: "IconManagement",
  data() {
    return {
      groups: [
        { name: "Material", isSubDocument: true },
        { name: "Weapon", isSubDocument: false },
        { name: "Tools", isSubDocument: false },
        { name: "Armor", isSubDocument: false },
        { name: "House", isSubDocument: false }
      ],
      types: [
        [
          { name: "Ingredient", isRole: false },
          { name: "Seafood", isRole: false },
          { name: "Stone", isRole: false },
          { name: "Metal", isRole: false },
          { name: "Lumber", isRole: false },
          { name: "Cloth", isRole: false },
          { name: "Leather", isRole: false },
          { name: "Bone", isRole: false },
          { name: "Reagent", isRole: false },
          { name: "Part", isRole: false },
          { name: "GuildCraft", isRole: false }
        ],
        [
          { name: "Gladiator", isRole: false },
          { name: "Marauder", isRole: false },
          { name: "DarkKnight", isRole: false },
          { name: "Gunbreaker", isRole: false },
          { name: "Lancer", isRole: false },
          { name: "Pugilist", isRole: false },
          { name: "Samurai", isRole: false },
          { name: "Rogue", isRole: false },
          { name: "Archer", isRole: false },
          { name: "Machinist", isRole: false },
          { name: "Dancer", isRole: false },
          { name: "Thaumaturge", isRole: false },
          { name: "Arcanist", isRole: false },
          { name: "RedMage", isRole: false },
          { name: "BlueMage", isRole: false },
          { name: "Conjurer", isRole: false },
          { name: "Scholar", isRole: false },
          { name: "Astrologian", isRole: false }
        ],
        [
          { name: "Carpenter", isRole: false },
          { name: "Blacksmith", isRole: false },
          { name: "Armorer", isRole: false },
          { name: "Goldsmith", isRole: false },
          { name: "Leatherworker", isRole: false },
          { name: "Weaver", isRole: false },
          { name: "Alchemist", isRole: false },
          { name: "Culinarian", isRole: false },
          { name: "Miner", isRole: false },
          { name: "Botanist", isRole: false },
          { name: "Fisher", isRole: false }
        ],
        [
          { name: "Shield", isRole: false },
          { name: "Head", isRole: true },
          { name: "Body", isRole: true },
          { name: "Hands", isRole: true },
          { name: "Waist", isRole: false },
          { name: "Legs", isRole: true },
          { name: "Feet", isRole: true },
          { name: "Earrings", isRole: false },
          { name: "Necklace", isRole: false },
          { name: "Bracelets", isRole: false },
          { name: "Ring", isRole: false }
        ]
      ],
      stages: [{ name: "Raw" }, { name: "End" }, { name: "Middle" }],
      roles: [
        { name: "Tank" },
        { name: "Mele" },
        { name: "Range" },
        { name: "Caster" },
        { name: "Heler" },
        { name: "Other" }
      ],
      selectgroup: 0,
      selectsubducument: 0,
      selectname: 0,
      selecttype: 0,
      selectrole: 0,
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
    selectStages() {
      return this.selectGroups.isSubDocument === true ? this.stages : [];
    },
    selectRoles() {
      return this.selectTypes[this.selecttype].isRole === true
        ? this.roles
        : [];
    },
    createStoragePath() {
      const group = this.selectGroups.name;
      const type = this.selectTypes[this.selecttype].name;
      //Groupの中で、サブドキュメントが存在している場合Pathに加える
      const stage =
        this.selectGroups.isSubDocument === true
          ? `${this.selectStages[this.selectsubducument].name}/`
          : "";
      //防具を選択し、尚且アクセサリ以外の部位を選択している場合のみ
      const role =
        this.selectTypes[this.selecttype].isRole === true
          ? `${this.roles[this.selectrole].name}/`
          : "";
      return `${group}/${stage}${type}/${role}`;
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
