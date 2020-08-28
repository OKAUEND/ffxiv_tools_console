<template>
  <ul>
    <slot />:
    <li v-for="(value, key) in Categories" :key="key">
      <input type="radio" :id="value.type" :value="value.type" v-model="type" />
      <label :for="value">{{ value.name }}</label>
    </li>
  </ul>
</template>

<script>
export default {
  name: "CategoryList",
  props: {
    Category: {
      type: Object,
      required: true
    }
  },
  computed: {
    Categories() {
      return this.Category;
    }
  }
};
</script>

<style></style>
