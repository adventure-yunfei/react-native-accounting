export default {
  findBy(arr, field, val) {
    return arr.find(item => item && item[field] === val);
  },

  arrayToMap(arr, keyField, valField = null) {
    return arr.reduce((acc, item) => {
      acc[item[keyField]] = valField ? item[valField] : item;
      return acc;
    }, {});
  }
};
