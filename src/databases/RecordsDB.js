import shortid from 'shortid';

import FakeSchema from '../lib/FakeSchema';
import dbManager from './dbManager';
import EnumRecordType from '../enums/EnumRecordType';

dbManager.createDatabase({
  name: 'records',

  generateID: ['timestamp', shortid],

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
      /* global emit,__RECORD_TYPE_EXPENDITURE__,__RECORD_TYPE_INCOME__,__RECORD_TYPE_TRANSFER__ */
      map: function (doc) {
        if (doc.type === __RECORD_TYPE_EXPENDITURE__) {
          emit(doc.accountId, -doc.amount);
        } else if (doc.type === __RECORD_TYPE_INCOME__) {
          emit(doc.accountId, doc.amount);
        } else if (doc.type === __RECORD_TYPE_TRANSFER__) {
          emit(doc.accountId, -doc.amount);
          emit(doc.toAccountId, doc.amount);
        }
      }.toString()
        .replace('__RECORD_TYPE_EXPENDITURE__', EnumRecordType.Expenditure)
        .replace('__RECORD_TYPE_INCOME__', EnumRecordType.Income)
        .replace('__RECORD_TYPE_TRANSFER__', EnumRecordType.Transfer),
      reduce: '_sum'
    }
  }
});
