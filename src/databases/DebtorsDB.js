import { compile } from 'immutable-json-schema';
import shortid from 'shortid';

import dbManager from './dbManager';

export default dbManager.createDatabase({
  name: 'debtors',

  schema: compile({
    _id: 'string',
    name: 'string'
  }),

  generateID: ['name', shortid]
});
