const state = () => ({
  icons: []
});

const mutations = {
  /**
   * @param {Vuex}  state - Vuex state
   * @param {Array} payload - 更新をするデータ
   */
  cachelistAcquiredfromDB(state, payload) {
    state.icons = payload;
  }
};

const actions = {
  /**
   * @param {Vuex}  state - Vuex state
   * @param {Array} cache - Firestoreより取得したデータ
   */
  cachelistAcquiredfromDB({ commit }, cache) {
    commit("cachelistAcquiredfromDB", cache);
  }
};
const getters = {
  getCacheicons: state => {
    return state.icons.length === 0 ? [] : state.icons;
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
