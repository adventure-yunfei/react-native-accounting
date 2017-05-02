import FakeSchema from '../lib/FakeSchema';
import dbManager from './dbManager';

dbManager.createDatabase({
  name: 'records',
  schema: new FakeSchema({
    type: 'number',
    amount: 'number',
    categoryId: 'string',
    accountId: 'string',
    timestamp: 'number',
    remark: 'string'
  })
});
