import { compile, compileAnyOf, compileEnum } from 'immutable-json-schema';

import dbManager from './dbManager';
import EnumCategoryType from '../enums/EnumCategoryType';
import EnumCategoryTargetType from '../enums/EnumCategoryTargetType';

const catCommonSrc = {
  _id: 'string',
  name: 'string',
  targetType: compileEnum(EnumCategoryTargetType)
};

dbManager.createDatabase({
  name: 'categories',
  schema: compileAnyOf([
    compile({
      ...catCommonSrc,
      type: compileEnum([EnumCategoryType.Group])
    }),
    compile({
      ...catCommonSrc,
      type: compileEnum([EnumCategoryType.Real]),
      parentId: 'string'
    })
  ])
});
