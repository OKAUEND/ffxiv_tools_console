const state = () => ({
  logs: []
});

const mutations = {
  /**
   * @param {Vuex}  state - Vuex state
   * @param {Array} payload - 更新をするデータ
   */
  cachelistAcquiredfromDB(state, payload) {
    state.logs = payload;
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
    return findStoreLogs(state.logs, payload);
  },
  /**
   * Firestoreへ追加したデータをキャッシュする
   * @param {Array} payload - Firestoreより取得したデータ
   */
  /* eslint-disable */
  cacheAdditionalData({ commit, state }, payload) {
    /* eslint-disable */

    //元をいじりたくないので新しいインスタンスを作りそちらを編集するようにしたい
    const temp = state != undefined ? state.logs.concat() : [];

    //選択されたのと同じ内容のを探す
    const selectedlogs = findStoreLogs(state, payload);

    //選択されたデータの添字を探す
    const index = temp.findIndex(log => log.crafter === payload.crafter);

    /**
     * 取得したデータ/一時キャッシュデータの順でSetオブジェクトを使い重複削除処理を行う
     * 新規追加であれ更新であれ、Firestoreへアップロードしようとしたデータが最新となるので
     * もし同じデータがあったとしても、追加しようとした側を優先する
     */
    const templist = Array.from(
      new Set([...payload.logs, ...selectedlogs.logs])
    );

    //キャッシュするデータ構造を作る
    const data = {
      crafter: payload.crafter,
      logs: templist
    };

    /**
     * インデックスが-1以上の場合は重複させたくないので置換してキャッシュする
     * -1の場合はデータがないので単純に追加する
     */
    if (index > -1) {
      temp.splice(index, 1, data);
    } else {
      temp.push(data);
    }

    //キャッシュする
    commit("cachelistAcquiredfromDB", temp);
  }
};

const getters = {};

/**
 * 一時キャッシュから同じ内容をデータを取得する
 * @param {Array} state - Vuex.state.logs
 * @param {Array} payload - keys object
 * @returns {Object} - キャッシュされた製作レシピ
 */
const findStoreLogs = async (state, payload) => {
  const finditem = state.find(temp => {
    return temp.crafter === payload.crafter;
  });

  return finditem === undefined ? {} : finditem;
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
