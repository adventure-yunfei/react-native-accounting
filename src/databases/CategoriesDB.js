import FakeSchema from '../lib/FakeSchema';
import dbManager from './dbManager';

dbManager.createDatabase({
  name: 'categories',
  schema: new FakeSchema({
    name: 'string',
    parentId: 'string'
  })
});
