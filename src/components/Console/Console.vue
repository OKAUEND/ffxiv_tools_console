<template>
  <div class="Console">
    <transition mode="out-in">
      <router-view />
    </transition>
  </div>
</template>

<script>
export default {
  name: "Console"
};
</script>

<style lang="scss">
.Console {
  width: 60%;
  margin: 0 auto;
}
</style>
