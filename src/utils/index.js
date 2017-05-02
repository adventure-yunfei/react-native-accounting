export default {
  findBy(arr, field, val) {
    return arr.find(item => item && item[field] === val);
  },

  arrayToMap(arr, keyField) {
    return arr.reduce((result, item) => {
      result[item[keyField]] = item;
      return result;
    }, {});
  }
};
