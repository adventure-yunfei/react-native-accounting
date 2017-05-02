import FakeSchema from '../lib/FakeSchema';
import dbManager from './dbManager';

dbManager.createDatabase({
  name: 'accounts',
  schema: new FakeSchema({
    name: 'string',
    parentId: 'string'
  })
});
