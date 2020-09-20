<template>
  <div>
    <category-list :Category="category.rank" v-model="rank">段階</category-list>
    <category-list :Category="iconcategory.groups" v-model="group"
      >種類</category-list
    >
    <category-list :Category="crafterdetail" v-model="crafter">
      クラフター</category-list
    >
    <category-list :Category="icondetails" v-model="detail">詳細</category-list>
    <button @click="onClick()">アイコン検索</button>
  </div>
</template>

<script>
import CategoryList from "@/components/Console/BaseRadioButtonList.vue";
import divisions from "../../assets/category.json";
import iconobject from "../../assets/categoryicons.json";
export default {
  name: "IconListQuery",
  components: {
    CategoryList
  },
  data() {
    return {
      job: "",
      crafter: "",
      rank: "",
      group: "",
      detail: ""
    };
  },
  computed: {
    category() {
      return divisions;
    },
    iconcategory() {
      return iconobject;
    },
    icondetails() {
      switch (this.group) {
        case "Material":
          return this.iconcategory.material;
        case "Weapon":
          return this.iconcategory.battlejob;
        default:
          return [];
      }
    },
    crafterdetail() {
      switch (this.group) {
        case "Weapon":
        case "Tools":
        case "Armor":
        case "House":
          return this.iconcategory.crafter;
        default:
          return [];
      }
    }
  },
  methods: {
    onClick() {
      return this.$emit("change", {
        document: this.group,
        collection: this.rank,
        rank: this.rank,
        detail: this.detail,
        crafter: this.crafter
      });
    }
  }
};
</script>

<style></style>
