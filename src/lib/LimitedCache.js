export default class LimitedCache {
  constructor(limit = 500) {
    this._limit = limit;
    this._cache = {};
  }

  set(key, val) {
    this._cache[key] = val;
  }

  get(key) {
    delete this._cache[key];
  }
}
