import shortid from 'shortid';
import { compile, compileAnyOf, compileEnum } from 'immutable-json-schema';

import dbManager from './dbManager';
import EnumRecordType from '../enums/EnumRecordType';

const commonRecordSrc = {
  _id: 'string',
  amount: 'number',
  accountId: 'string',
  timestamp: 'number',
  remark: 'string',
  debtorId: 'string',
  __options: {
    notRequired: ['remark', 'debtorId']
  }
};

export default dbManager.createDatabase({
  name: 'records',

  generateID: ['timestamp', shortid],

  schema: compileAnyOf([
    compile({
      ...commonRecordSrc,
      type: compileEnum([EnumRecordType.Expenditure, EnumRecordType.Income]),
      categoryId: 'string'
    }),
    compile({
      ...commonRecordSrc,
      type: compileEnum([EnumRecordType.Transfer]),
      toAccountId: 'string' // 转账目标账户
    }),
    compile({
      ...commonRecordSrc,
      type: compileEnum([
        EnumRecordType.InitAmount,
        EnumRecordType.InitBorrowing,
        EnumRecordType.InitLending
      ])
    })
  ]),

  views: {
    amountGroupByAccounts: {
      /* global emit,__RECORD_TYPE_EXPENDITURE__,__RECORD_TYPE_INCOME__,__RECORD_TYPE_TRANSFER__,
      __RECORD_TYPE_INIT_AMOUNT__,__RECORD_TYPE_INIT_BORROWING__,__RECORD_TYPE_INIT_LENDING__ */
      /* eslint func-names: off */
      map: function (doc) {
        if (doc.type === __RECORD_TYPE_EXPENDITURE__) {
          emit(doc.accountId, -doc.amount);
        } else if (doc.type === __RECORD_TYPE_INCOME__) {
          emit(doc.accountId, doc.amount);
        } else if (doc.type === __RECORD_TYPE_TRANSFER__) {
          emit(doc.accountId, -doc.amount);
          emit(doc.toAccountId, doc.amount);
        } else if (doc.type === __RECORD_TYPE_INIT_AMOUNT__) {
          emit(doc.accountId, doc.amount);
        } else if (doc.type === __RECORD_TYPE_INIT_BORROWING__) {
          emit(doc.accountId, -doc.amount);
        } else if (doc.type === __RECORD_TYPE_INIT_LENDING__) {
          emit(doc.accountId, doc.amount);
        }
      }.toString()
        .replace('__RECORD_TYPE_EXPENDITURE__', EnumRecordType.Expenditure)
        .replace('__RECORD_TYPE_INCOME__', EnumRecordType.Income)
        .replace('__RECORD_TYPE_TRANSFER__', EnumRecordType.Transfer)
        .replace('__RECORD_TYPE_INIT_AMOUNT__', EnumRecordType.InitAmount)
        .replace('__RECORD_TYPE_INIT_BORROWING__', EnumRecordType.InitBorrowing)
        .replace('__RECORD_TYPE_INIT_LENDING__', EnumRecordType.InitLending),
      reduce: '_sum'
    }
  }
});
