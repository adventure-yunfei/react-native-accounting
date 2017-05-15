import moment from 'moment';
import 'moment/locale/zh-cn';

moment.locale('zh-cn');

/* eslint-disable no-extend-native */
Promise.prototype.$finally = function onFinally(fnFinally) {
  function doFinally() {
    try {
      fnFinally();
    } catch (e) { /* pass */ }
  }
  this.then(doFinally, doFinally);
  return this.then(
    (value) => {
      doFinally();
      return value;
    },
    (reason) => {
      doFinally();
      return Promise.reject(reason);
    }
  );
};
