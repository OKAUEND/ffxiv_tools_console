const state = () => ({
  icons: []
});

const mutations = () => ({
  /**
   * @param {Vuex}  state - Vuex state
   * @param {Array} value - 更新をするデータ
   */
  cacheiconlistAcquiredfromdb(state, value) {
    state.icons = value;
  }
});

const actions = () => ({
  /**
   * @param {Vuex}  state - Vuex state
   * @param {Array} cache - Firestoreより取得したデータ
   */
  cacheiconlistAcquiredfromdb(cache) {
    this.commit("cacheiconlistAcquiredfromdb", cache);
  }
});
const getters = () => ({
  getCacheicons: state => {
    return state.icons;
  }
});

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
