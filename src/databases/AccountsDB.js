import { compile } from 'immutable-json-schema';

import dbManager from './dbManager';

dbManager.createDatabase({
  name: 'accounts',
  schema: compile({
    _id: 'string',
    name: 'string',
    parentId: 'string',
    __options: {
      notRequired: ['parentId']
    }
  })
});
