import FakeSchema from '../lib/FakeSchema';
import dbManager from './dbManager';

dbManager.createDatabase({
  name: 'records',

  schema: new FakeSchema({
    type: 'number',
    amount: 'number',
    categoryId: 'string',
    accountId: 'string',
    toAccountId: 'string', // 转账目标账户
    timestamp: 'number',
    remark: 'string'
  }),

  views: {
    amountGroupByAccounts: {
      /* global emit */
      map: function (doc) { emit(doc.accountId, doc.amount); }.toString(),
      reduce: '_sum'
    }
  }
});
