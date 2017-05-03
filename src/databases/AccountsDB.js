import FakeSchema from '../lib/FakeSchema';
import dbManager from './dbManager';

dbManager.createDatabase({
  name: 'accounts',
  schema: new FakeSchema({
    name: 'string',
    parentId: 'string',
    amount: 'number' // 仅子账户有
  })
});
