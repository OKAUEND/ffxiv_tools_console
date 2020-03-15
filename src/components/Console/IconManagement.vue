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
      <div v-for="(Group, ID) in SelectGroups" :key="ID">
        <input
          type="radio"
          :id="Group.name"
          :value="ID"
          v-model.number="selectname"
        />
        <label :for="Group.name">{{ Group.name }}</label>
      </div>
    </div>
    <div class="RadioList">
      <div v-for="(Type, index) in SelectTypes" :key="index">
        <input
          type="radio"
          :id="Type"
          :value="index"
          v-model.number="selecttype"
        />
        <label :for="Type">{{ Type }}</label>
      </div>
    </div>
    <label>名前</label>
    <input type="text" />

    <button>追加</button>
  </div>
</template>

<script>
export default {
  name: "IconManagement",
  data() {
    return {
      groups: [
        [{ name: "Raw" }, { name: "End" }, { name: "Middle" }],
        [{ name: "Weapon" }],
        [{ name: "Tools" }],
        [{ name: "Armor" }]
      ],
      types: [
        [
          "Ingredient",
          "Seafood",
          "Stone",
          "Metal",
          "Lumber",
          "Cloth",
          "Leather",
          "Bone",
          "Reagent",
          "Part",
          "FCCraft"
        ],
        [
          "Gladiator",
          "Marauder",
          "DarkKnight",
          "Gunbreaker",
          "Lancer",
          "Pugilist",
          "Samurai",
          "Rogue",
          "Archer",
          "Machinist",
          "Dancer",
          "Thaumaturge",
          "Arcanist",
          "RedMage",
          "BlueMage",
          "Conjurer",
          "Scholar",
          "Astrologian"
        ],
        [
          "Carpenter",
          "Blacksmith",
          "Armorer",
          "Goldsmith",
          "Leatherworker",
          "Weaver",
          "Alchemist",
          "Culinarian",
          "Miner",
          "Botanist",
          "Fisher"
        ],
        [
          "Shield",
          "Head",
          "Body",
          "Hands",
          "Waist",
          "Legs",
          "Feet",
          "Earrings",
          "Necklace",
          "Bracelets",
          "Ring"
        ]
      ],
      selectgroup: 0,
      selectname: 0,
      selecttype: 0
    };
  },
  computed: {
    SelectGroups() {
      return this.groups[this.selectgroup];
    },
    SelectTypes() {
      return this.types[this.selectgroup];
    },
    createStoragePath() {
      return `${this.SelectGroups[this.selectname].name}/${
        this.SelectTypes[this.selecttype]
      }/`;
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
