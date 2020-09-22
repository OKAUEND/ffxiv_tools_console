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
  },
  /**
   * 一時キャッシュを検索する
   * @param {Array} targetkeys - Firestoreより取得したデータ
   */
  /* eslint-disable */
  searchStateTempData({ dispatch, state }, targetkeys) {
    /* eslint-disable */

    //選択されたのと同じ内容のを探す
    return state.icons.filter(temp => {
      return (
        temp.document === targetkeys.document &&
        temp.collection === targetkeys.collection &&
        temp.crafter === targetkeys.crafter &&
        temp.detail === targetkeys.detail
      );
    });
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
