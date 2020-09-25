<template>
  <div>
    <modal>
      <template v-slot:ButtonText>{{ createButtonText }}</template>
      <template v-slot:content>
        <icon-list-query @change="selectedQueries" />
        <button @click="emitEvent()">アイコン検索</button>
        <div>
          <img
            :src="selection.URL"
            alt="Select Item Icon"
            decoding="async"
            width="100"
            height="100"
          />
          <ul>
            <li v-for="(icon, key) in icons" :key="key">
              <button @click="onClickIcon(icon)">
                <img
                  :src="icon.URL"
                  alt="Item Icon"
                  decoding="async"
                  width="60"
                  height="60"
                />
              </button>
            </li>
          </ul>
        </div>
      </template>
    </modal>
  </div>
</template>

<script>
import IconListQuery from "@/components/Console/IconListQuery.vue";
import modal from "@/components/Console/modal/BaseModal.vue";

export default {
  name: "IconList",
  components: {
    IconListQuery,
    modal
  },
  data() {
    return {
      queries: {},
      selection: {}
    };
  },
  props: {
    icons: {
      require: true,
      type: Array
    }
  },
  computed: {
    createButtonText() {
      return "アイコン検索";
    }
  },
  methods: {
    onClickIcon(value) {
      //選択中のアイコンを表示させたいので、dataへ代入する
      this.selection = value;

      //画像のパスだけが必要なので、パスの情報だけを親へ渡す
      this.$emit("select", value.URL);
    },
    selectedQueries(queries) {
      this.queries = queries;
    },
    /**
     * Firestoreから条件にあったアイコンの一覧を取得する
     */
    emitEvent() {
      //親でAPI通信を担いたいので、親で条件キーを伝える
      this.$emit("change", this.queries);
    }
  }
};
</script>
