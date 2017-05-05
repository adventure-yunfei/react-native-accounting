import moment from 'moment';
import 'moment/locale/zh-cn';

moment.locale('zh-cn');

// DEV
// 移除 db.type 废弃警告
/* eslint-disable */
const PouchDB = require('pouchdb-core');
/* eslint-enable */
Object.defineProperty(PouchDB.prototype, '_remote', {
  get() {
    return typeof this.__remote === 'boolean' ? this.__remote : this.type() === 'http';
  },
  set(val) {
    this.__remote = val;
  }
});
