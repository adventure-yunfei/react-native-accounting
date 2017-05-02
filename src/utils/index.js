export default {
  findBy(arr, field, val) {
    return arr.find(item => item && item[field] === val);
  }
};
