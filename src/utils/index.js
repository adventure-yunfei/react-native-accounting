export default {
  findBy(arr, field, val) {
    return arr.find(item => item && item[field] === val);
  },

  arrayToMap(arr, keyField) {
    return arr.reduce((acc, item) => {
      acc[item[keyField]] = item;
      return acc;
    }, {});
  }
};
