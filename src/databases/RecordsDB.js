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
  ])
});
