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
  /* eslint-disable */
  cachelistAcquiredfromDB({ commit, state }, payload) {
    /* eslint-disable */
    //元をいじりたくないので新しいインスタンスを作りそちらを編集するようにしたい
    const temp = state.icons.concat();

    //配列数が10以上の場合一番古くに取得したのを削除することで、
    //一時キャッシュデータが膨れ上がるのを防ぐ
    if (temp.length > 11) {
      temp.splice(0, 1);
    }

    temp.push(payload);

    commit("cachelistAcquiredfromDB", temp);
  },
  /**
   * 一時キャッシュを検索する
   * @param {Array} targetkeys - Firestoreより取得したデータ
   */
  /* eslint-disable */
  searchStateTempData({ dispatch, state }, targetkeys) {
    /* eslint-disable */

    //選択されたのと同じ内容のを探す
    return filtersStoreIcons(state, targetkeys);
  }
};

const getters = {};

/**
 * 一時キャッシュから同じ内容をデータを取得する
 * @param {Array} state - Vuex.state.icon
 * @param {Array} target - keys object
 * @returns {Object} - キャッシュされたアイコン画像の情報群
 */
const filtersStoreIcons = (state, payload) => {
  const icon = state.icons.filter(temp => {
    return (
      temp.document === payload.document &&
      temp.collection === payload.collection &&
      temp.crafter === payload.crafter &&
      temp.detail === payload.detail
    );
  });

  //取得した配列の長さを見ることで、中身があるかどうかを確認しundefinedを発生しないようにする
  return icon.length === 0 ? {} : icon[0];
};
export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
