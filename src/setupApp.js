import moment from 'moment';
import 'moment/locale/zh-cn';
import Promise from 'beauty-promise';

moment.locale('zh-cn');

global.Promise = Promise;

Promise.onUnhandledRejection = function (reason) {
  const msgs = [];
  if (reason == null) {
    msgs.push(String(reason));
  } else if (typeof reason === 'object' && (reason.message || reason.stack)) {
    if (reason.message) {
      msgs.push(`message: ${reason.message}`);
    }
    if (reason.stack) {
      msgs.push(`stack: ${reason.stack}`);
    }
  } else {
    msgs.push(reason);
  }
  console.warn(`Possible Unhandled Promise Rejection: ${msgs.join('\n')}`);
};
