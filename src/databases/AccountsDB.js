import { compile, compileAnyOf, compileEnum } from 'immutable-json-schema';

import dbManager from './dbManager';
import EnumAccountType from '../enums/EnumAccountType';

const accountCommonSrc = {
  _id: 'string',
  name: 'string'
};

dbManager.createDatabase({
  name: 'accounts',
  schema: compileAnyOf([
    compile({
      ...accountCommonSrc,
      type: compileEnum([EnumAccountType.Category])
    }),

    compile({
      ...accountCommonSrc,
      type: compileEnum([EnumAccountType.Group, EnumAccountType.Real]),
      parentId: 'string'
    })
  ])
});
