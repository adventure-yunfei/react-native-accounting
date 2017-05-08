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
  __options: {
    notRequired: ['remark']
  }
};

dbManager.createDatabase({
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
    })
  ]),

  views: {
    amountGroupByAccounts: {
      /* global emit,__RECORD_TYPE_EXPENDITURE__,__RECORD_TYPE_INCOME__,__RECORD_TYPE_TRANSFER__ */
      /* eslint func-names: off */
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
