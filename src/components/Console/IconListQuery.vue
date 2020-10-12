<template>
  <div>
    <category-list :Category="category.rank" v-model="rank" @input="onClick"
      >段階</category-list
    >
    <category-list
      :Category="iconcategory.groups"
      v-model="group"
      @input="onClick"
      >種類</category-list
    >
    <category-list :Category="crafterdetail" v-model="crafter" @input="onClick">
      クラフター</category-list
    >
    <category-list :Category="icondetails" v-model="detail" @input="onClick"
      >詳細</category-list
    >
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
        case "House":
          return this.iconcategory.material;
        default:
          return this.iconcategory.role;
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
