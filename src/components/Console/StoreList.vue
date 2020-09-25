<template>
  <div>
    <div>
      <category-list
        :Category="CrafterCategory"
        v-model="job"
        :radiotype="'modal'"
        >クラフターを選択してください</category-list
      >
    </div>
    <div>
      取得したいIL帯を入力してください
      <label>上限IL</label
      ><input
        type="text"
        placeholder="上限IL"
        v-model.number="upperItemlevel"
      />
      <label>下限IL</label>
      <input type="text" placeholder="下限IL" v-model.number="lowerItemlevel" />
    </div>
    <button @click="emitEvent">検索</button>
    <ul>
      <li v-for="(Log, ID) in loglist" :key="ID">
        <button @click="selectedCraftLog(Log)">{{ Log.text.name }}</button>
      </li>
    </ul>
  </div>
</template>

<script>
import divisions from "../../assets/category.json";
import CategoryList from "@/components/Console/BaseRadioButtonList.vue";
export default {
  name: "StoreList",
  components: {
    CategoryList
  },
  props: {
    logs: {
      requier: true,
      type: Array
    }
  },
  data() {
    return {
      job: "",
      lowerItemlevel: 0,
      upperItemlevel: 0,
      StoreLogs: []
    };
  },
  computed: {
    CrafterCategory() {
      return divisions.job;
    },
    loglist() {
      return this.logs;
    }
  },
  methods: {
    emitEvent() {
      //親へ選択したキーを伝える
      this.$emit("select", {
        job: this.job,
        upperItemlevel: this.upperItemlevel,
        lowerItemlevel: this.lowerItemlevel
      });
    },

    selectedCraftLog(Data) {
      this.$emit("click", Data);
    }
  }
};
</script>

<style></style>
