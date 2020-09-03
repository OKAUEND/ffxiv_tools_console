<template>
  <ul>
    <slot />:
    <li v-for="(data, key) in Categories" :key="key">
      <input
        type="radio"
        :id="createradiotype(data.type)"
        :value="data.type"
        v-model="selected"
      />
      <label :for="createradiotype(data.type)">{{ data.name }}</label>
    </li>
  </ul>
</template>

<script>
export default {
  name: "BaseRadioButtonList",
  props: {
    Category: {
      type: Array,
      required: true
    },
    value: {
      type: String,
      required: true
    },
    radiotype: {
      type: String,
      default: ""
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
  },
  methods: {
    createradiotype(type) {
      return `${this.radiotype}${type}`;
    }
  }
};
</script>

<style></style>
