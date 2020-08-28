<template>
  <div>
    <button @click="onActivate()"><slot name="ButtonText"></slot></button>
    <div class="modal" v-if="active">
      <div class="modal__overlay" :class="isdark" @click="offActivate()" />
      <div class="modal__container">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Modal",
  props: {
    dark: {}
  },
  data() {
    return {
      active: false
    };
  },
  computed: {
    isdark() {
      return {
        "--dark": this.dark
      };
    }
  },
  methods: {
    onclose() {
      console.log(this.$scopedSlots.activtor);
      this.$emit("click");
    },
    onActivate() {
      this.active = true;
    },
    offActivate() {
      this.active = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.modal {
  position: fixed;
  height: 100%;
  width: 100%;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.modal__overlay {
  height: 100%;
  width: 100%;
  background-color: #00000020;
}

.modal__container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;
  pointer-events: none;
}
</style>
