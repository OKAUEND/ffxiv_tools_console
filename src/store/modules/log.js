const state = () => ({
  logs: []
});

const mutations = {
  /**
   * @param {Vuex}  state - Vuex state
   * @param {Array} payload - 更新をするデータ
   */
  cachelistAcquiredfromDB(state, payload) {
    state.logs.push(payload);
  }
};

const actions = {
  /**
   * @param {Vuex}  state - Vuex state
   * @param {Array} payload - Firestoreより取得したデータ
   */
  /* eslint-disable */
  cachelistAcquiredfromDB({ commit, state }, payload) {
    /* eslint-disable */

    const MAX_LOGS_LIST = 100;

    //元をいじりたくないので新しいインスタンスを作りそちらを編集するようにしたい
    const temp = state != undefined ? state.logs.concat() : [];

    const selectcachelog = filtersStoreLogs(state, payload);

    /**
     * 取得したデータ/一時キャッシュデータの順でSetオブジェクトを使い重複削除処理を行う
     * 先に取得したデータを指定するのは、次のサイズ制限処理で取得したてのデータを消さないため
     */
    const templist = Array.from(
      new Set([...payload.logs, ...selectcachelog.logs])
    );

    /**
     * 先に追加したのだ新しく取得したデータになるので、後ろの古いデータから削除する
     * 具体的には101番目から
     * 削除するデータから
     */
    if (templist.length > MAX_LOGS_LIST) {
      //今回追加する個数分だけ古いのを削除する
      templist.splice(101, templist.length - MAX_LOGS_LIST);
    }

    //キャッシュする
    commit("cachelistAcquiredfromDB", {
      crafter: payload.crafter,
      logs: templist
    });
    // commit("cachelistAcquiredfromDB", [payload]);
  },
  /**
   * 一時キャッシュを検索する
   * @param {Array} payload - Firestoreより取得したデータ
   */
  /* eslint-disable */
  searchStateTempData({ dispatch, state }, payload) {
    /* eslint-disable */

    //選択されたのと同じ内容のを探す
    return filtersStoreLogs(state, payload);
  }
};

const getters = {};

/**
 * 一時キャッシュから同じ内容をデータを取得する
 * @param {Array} state - Vuex.state.logs
 * @param {Array} payload - keys object
 * @returns {Object} - キャッシュされたアイコン画像の情報群
 */
const filtersStoreLogs = (state, payload) => {
  const logs = state.logs.filter(temp => {
    return temp.crafter === payload.crafter;
  });

  //取得した配列の長さを見ることで、中身があるかどうかを確認しundefinedを発生しないようにする
  return logs.length === 0 ? { logs: [] } : logs[0];
};

/**
 * キャッシュしている製作レシピのレベル帯を取得する
 * @param {Array} cachelogs - キャッシュしているレベル帯を調べる対象
 * @return {Object} - レベル帯
 */
const loadCachelevelband = state => {
  const minlevel = state.logs.reduce((accumulator, currentvalue) =>
    accumulator < currentvalue ? accumulator : currentvalue
  );

  const maxlevel = state.logs.reduce((accumulator, currentvalue) =>
    accumulator > currentvalue ? accumulator : currentvalue
  );

  
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
