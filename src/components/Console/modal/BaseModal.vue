<template>
  <div>
    <button @click="onActivate()"><slot name="ButtonText"></slot></button>
    <div class="modal" v-show="active">
      <div class="modal__container">
        <div class="modal__content">
          <slot name="content"></slot>
        </div>
      </div>
      <div class="modal__overlay" :class="isdark" @click="offActivate()" />
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
  display: flex;
  justify-content: center;
  align-items: center;
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

  .modal__content {
    background-color: #ffffff;
    padding: 10px;
  }
}
</style>
