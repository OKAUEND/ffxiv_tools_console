<template>
  <ul>
    <slot />:
    <li v-for="(data, key) in Categories" :key="key">
      <input
        type="radio"
        :id="data.type"
        :value="data.type"
        v-model="selected"
      />
      <label :for="data.type">{{ data.name }}</label>
    </li>
  </ul>
</template>

<script>
export default {
  name: "CategoryList",
  props: {
    Category: {
      type: Array,
      required: true
    },
    value: {
      type: String,
      required: true
    }
  },
  computed: {
    Categories() {
      return this.Category;
    },
    selected: {
      get() {
        return this.value;
      },
      set(value) {
        return this.$emit("input", value);
      }
    }
  }
};
</script>

<style></style>
