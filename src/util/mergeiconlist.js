export default mergeiconlist;
/**
 * 配列をマージし一つの配列にする
 * @param {Array} parent - マージ先の配列
 * @param {Array} target - マージしたい配列
 */
function mergeiconlist(parent, target) {
  const selected = parent.filter(icon => {
    return (
      target.document === icon.document &&
      target.collection === icon.collection &&
      target.crafter === icon.crafter
    );
  });
}

/**
 * 同じ状態のデータを除外した配列を生成する
 * @param {Array} parent - 重複データを検索する配列
 * @param {Array} target - 重複データを除外する配列
 */
function filtersamedata(parent, target) {
  return target.list.filter(item => {
    return !parent.includes(item.ID) && !parent.includes(item.MaterialType);
  });
}

/**
 * 更新を行うために必要な配列をもったObjectを探す
 * @param {Array} parent - 重複データを検索する配列
 * @param {Array} target - 重複データを除外する配列
 */
function updateIconArray(targets, commit) {
  //更新するアイテムのインデックスを探す
  const targetindex = targets.findIndex(target => {
    {
      return (
        target.document === commit.document &&
        target.collection === commit.collection &&
        target.crafter === commit.crafter &&
        target.detail === commit.detail
      );
    }
  });

  return targets.splice(targetindex, 1, commit);
}
