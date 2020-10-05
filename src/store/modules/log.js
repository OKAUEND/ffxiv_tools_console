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

    const templist = mergeArrayDeletedDuplicate(temp, payload);

    /**
     * 先に追加したのだ新しく取得したデータになるので、後ろの古いデータから削除する
     * 具体的には101番目から
     * 削除するデータから
     */
    if (templist.length > MAX_LOGS_LIST) {
      //今回追加する個数分だけ古いのを削除する
      templist.splice(101, templist.length - MAX_LOGS_LIST);
    }

    //キャッシュするデータ構造を作る
    const data = {
      crafter: payload.crafter,
      logs: templist
    };

    applyUpdatedContentToCache(temp, data);

    //キャッシュする
    commit("cachelistAcquiredfromDB", temp);
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

    const templist = mergeArrayDeletedDuplicate(temp, payload);

    //キャッシュするデータ構造を作る
    const data = {
      crafter: payload.crafter,
      logs: templist
    };

    applyUpdatedContentToCache(temp, data);

    //キャッシュする
    commit("cachelistAcquiredfromDB", temp);
  }
};

const getters = {};

/**
 * 一時キャッシュから同じクラフターのデータを取得する
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
 * 選択されたキャッシュ中の製作レシピのレベル帯を取得する
 * @param {Array} logs - キャッシュしているレベル帯を調べる対象
 * @return {Object} - レベル帯
 */
const searchCachelevelband = (logs, query) => {
  //最初にソートを行い、昇順でレベル数値を参照できるようにする
  logs.sort((accumulator, currentvalue) => {
    if (accumulator.level.itemlevel < currentvalue.level.itemlevel) return -1;
    else if (accumulator.level.itemlevel > currentvalue.level.itemlevel)
      return 1;
    else return 0;
  });

  //アイテムレベル順にすることで、厳密な順序とする
  const temps = logs.map(log => {
    return log.level.itemlevel;
  });

  const min = temps.reduce((accumulator, currentvalue) =>
    accumulator < currentvalue ? accumulator : currentvalue
  );

  const max = temps.reduce((accumulator, currentvalue) =>
    accumulator > currentvalue ? accumulator : currentvalue
  );

  /**
   * キャッシュされている最小数値が、入力数値の許容範囲内に存在するアイテムなのか
   *  入力数値 + 1 までを許容範囲とする(+2だと次のLvのアイテムがひっかかるため)
   * 存在したら最低レベルを入力数値のまま使う、そうでないならキャッシュ中で最小のを使う
   */
  const existsMinlevelInRange =
    query.lowerItemlevel <= min && query.lowerItemlevel + 1 >= min;

  const maxlevelAdjustedRange =
    query.upperItemlevel % 10 === 0
      ? query.upperItemlevel - 2
      : query.upperItemlevel - 1;

  const existsMaxlevelInRange =
    query.upperItemlevel <= max && maxlevelAdjustedRange - 2 >= tmax;

  return {
    existsMinlevelInRange: existsMinlevelInRange,
    existsMaxlevelInRange: existsMaxlevelInRange,
    min: min,
    max: max
  };
};
/**
 * 取得したデータとキャッシュしているデータを重複を排除しマージする
 * @param {Array} cache - キャッシュしている製作レシピ
 * @param {Object} payload - 取得した製作レシピの情報
 * @return {Array} - マージした製作レシピの配列
 */
const mergeArrayDeletedDuplicate = (cache, payload) => {
  const selectcachelog = findStoreLogs(cache, payload);

  const oldcache =
    Object.keys(selectcachelog).length != 0 ? selectcachelog.logs : [];

  /**
   * 一時キャッシュデータ/取得したデータの順で配列を作成し、次の処理で使う
   */
  const arr = [...oldcache, ...payload.logs];

  return Array.from(
    arr
      .reduce(
        /**
         * Mapオブジェクトを作り、その中にkeyと連想配列をSetしていく
         * もし同じKeyがあれば、上書きをすることになるので、重複を排除できる
         * ただし、古い情報が配列の最初の方にないと、新しい情報を古い情報で上書きする事になるので
         * 古い情報を先にしなければいけない
         */
        (map, currentitem) => map.set(currentitem.text.engname, currentitem),
        new Map()
      )
      .values()
  );
};

/**
 * 同じログのインデックスを検索する
 * @param {Array} logs - キャッシュ中の検索する対象の製作レシピ
 *  @param {String} job - 探したいクラフタージョブキー
 * @return {Number} - インデックス値
 */
const searchIndexofLogs = (logs, job) => {
  //選択されたデータの添字を探す
  return logs.findIndex(log => log.crafter === job);
};

/**
 * 更新する内容を反映させる
 * @param {Array} cache - キャッシュをしているオブジェクトの配列
 * @param {Object} updatedContent - 追加するオブジェクト
 * @return {Array} - 更新を反映したキャッシュ
 */
const applyUpdatedContentToCache = (cache, updatedContent) => {
  const index = searchIndexofLogs(cache, updatedContent.crafter);
  /**
   * インデックスが-1以上の場合は重複させたくないので置換してキャッシュする
   * -1の場合はデータがないので単純に追加する
   */
  return index > -1
    ? cache.splice(index, 1, updatedContent)
    : cache.push(updatedContent);
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
