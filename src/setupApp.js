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

// Promise.onUnhandledRejection = function (reason) {
//   const msgs = [];
//   if (reason == null) {
//     msgs.push(String(reason));
//   } else if (typeof reason === 'object' && (reason.message || reason.stack)) {
//     if (reason.message) {
//       msgs.push(`message: ${reason.message}`);
//     }
//     if (reason.stack) {
//       msgs.push(`stack: ${reason.stack}`);
//     }
//   } else {
//     msgs.push(reason);
//   }
//   console.warn(`Possible Unhandled Promise Rejection: ${msgs.join('\n')}`);
// };
