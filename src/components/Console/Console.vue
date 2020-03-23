<template>
  <div class="Console">
    <div id="nav">
      <router-link to="/Console">製作レシピ追加/更新</router-link> |
      <router-link to="/IconManagement">アイコン追加/更新</router-link>
    </div>
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
  width: 90%;
  margin: 0 auto;

  @media screen and (min-width: 780px) {
    width: 80%;
    margin: 0 auto;
  }
}
</style>
