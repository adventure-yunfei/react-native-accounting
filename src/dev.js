import map from 'lodash/map';
import databases from './databases';
import EnumRecordType from './enums/EnumRecordType';

const dev = global._dev = {
  perf(func) {
    const startTime = Date.now();
    const result = func();
    if (result && typeof result.then === 'function') {
      return result.then(() => Date.now() - startTime);
    }
    return Date.now() - startTime;
  },

  perfAndRecord(result, prefix, func, timeout = 500) {
    return dev.timeout(timeout)()
      .then(() => dev.perf(func))
      .then(time => result.push(`${prefix || ''}: ${time}`));
  },

  timeout(duration) {
    return () => new Promise((resolve) => {
      setTimeout(resolve, duration);
    });
  },

  examplePerf() {
    const res = [];
    Promise.resolve()
      .then(() => dev.perfAndRecord(res, 'allDocs_reduce', () => databases.records.allDocsData().then((docs) => {
        const accountAmounts = {};
        docs.forEach(({ type, amount, accountId, toAccountId }) => {
          if (type === EnumRecordType.Expenditure) {
            accountAmounts[accountId] = (accountAmounts[accountId] || 0) - amount;
          } else if (type === EnumRecordType.Transfer) {
            accountAmounts[accountId] = (accountAmounts[accountId] || 0) - amount;
            accountAmounts[toAccountId] = (accountAmounts[toAccountId] || 0) + amount;
          } else if (type === EnumRecordType.Income
            || type === EnumRecordType.InitAmount
            || type === EnumRecordType.InitLending) {
            accountAmounts[accountId] = (accountAmounts[accountId] || 0) + amount;
          } else if (type === EnumRecordType.InitBorrowing) {
            accountAmounts[accountId] = (accountAmounts[accountId] || 0) - amount;
          }
        });
        return map(accountAmounts, (amount, accountId) => ({
          accountId,
          amount
        }));
      })))
      .then(() => dev.perfAndRecord(res, 'find', () => databases.records.find({ selector: {} })))
      .then(() => dev.perfAndRecord(res, 'allDocs', () => databases.records.allDocs()))
      .then(() => global.alert(JSON.stringify(res.sort())));
  }
};

// dev.timeout(2000)().then(dev.examplePerf);

export default dev;
