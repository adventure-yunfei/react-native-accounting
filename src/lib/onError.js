/** 默认的错误处理 */
export default function onError(prefix = '') {
  return (err) => {
    const msgs = [];
    if (err == null) {
      msgs.push(String(err));
    } else if (typeof err === 'object' && (err.message || err.stack)) {
      if (err.message) {
        msgs.push(`message: ${err.message}`);
      }
      if (err.stack) {
        msgs.push(`stack: ${err.stack}`);
      }
    } else {
      msgs.push(err);
    }
    global.__error = err;
    console.warn(`${prefix} Error Occured: ${msgs.join('\n')}`);
  };
}
