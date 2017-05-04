import { compile } from 'immutable-json-schema';

import dbManager from './dbManager';

dbManager.createDatabase({
  name: 'categories',
  schema: compile({
    name: 'string',
    parentId: 'string',
    type: 'number',
    __options: {
      notRequired: ['parentId']
    }
  })
});
