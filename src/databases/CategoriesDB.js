import { compile, compileAnyOf, compileEnum } from 'immutable-json-schema';

import dbManager from './dbManager';
import EnumCategoryType from '../enums/EnumCategoryType';
import EnumCategoryTargetType from '../enums/EnumCategoryTargetType';
import EnumCategoryGroupType from '../enums/EnumCategoryGroupType';

const catCommonSrc = {
  _id: 'string',
  name: 'string',
  groupType: compileEnum(EnumCategoryGroupType),
  targetType: compileEnum(EnumCategoryTargetType)
};

export default dbManager.createDatabase({
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
