<template>
  <div>
    <button @click="writeInterface()">追加/更新</button>
    調整したいIL帯を選択してください
    <input type="text" placeholder="上限IL" />
    <input type="text" placeholder="下限IL" />
    <button @click="onFetchStoreLogs()">取得</button>
    <ul>
      <li v-for="(Log, ID) in Logs" :key="ID">
        <button @click="bindLog(Log)">{{ Log.Name }}</button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "StoreList",
  data() {
    return {};
  }
};
</script>

<style></style>
