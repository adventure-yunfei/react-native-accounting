import databases from '../databases';
import clearDBs from './clearDBs';
import EnumAccountType from '../enums/EnumAccountType';
import EnumCategoryType from '../enums/EnumCategoryType';
import EnumCategoryTargetType from '../enums/EnumCategoryTargetType';
import EnumCategoryGroupType from '../enums/EnumCategoryGroupType';

function getId(name, prefix = '') {
  return prefix + name.split('').map(ch => ch.codePointAt(0).toString(36)).join('');
}

function generateDocs(data, genItem = item => item) {
  const docs = [];
  data.forEach(([mainGroup, children]) => {
    const groupDoc = genItem({
      _id: getId(mainGroup, 'g-'),
      name: mainGroup,
      parentId: null
    }, { isGroup: true });
    docs.push(groupDoc);
    children.forEach((child) => {
      docs.push(genItem({
        _id: getId(child),
        name: child,
        parentId: groupDoc._id
      }, { isGroup: false }));
    });
  });
  return docs;
}

const accountDocs = generateDocs([
  ['现金', ['钱包', '支付宝']],
  ['金融账户', ['工行', '招行', '建行', '中行']],
  ['虚拟账户', ['押金', '暂存', '待报销']]
], (item, { isGroup }) => ({
  ...item,
  type: isGroup ? EnumAccountType.Category : EnumAccountType.Real
}));

const expenditureCategoryDocs = generateDocs([
  ['食品酒水', ['吃饭', '零食']],
  ['日常支出', ['日用品', '水电煤']],
  ['衣服饰品', ['衣服裤子', '鞋帽包包', '化妆饰品']],
  ['行车交通', ['公交车', '打车']],
  ['其他支出', ['其他支出']]
], (item, { isGroup }) => Object.assign(item, {
  type: isGroup ? EnumCategoryType.Group : EnumCategoryType.Real,
  groupType: EnumCategoryGroupType.Normal,
  targetType: EnumCategoryTargetType.Expenditure
}));

const incomeCategoryDocs = generateDocs([
  ['职业收入', ['工资', '年终奖', '公积金']],
  ['其他收入', ['利息', '红包', '其他收入']]
], (item, { isGroup }) => Object.assign(item, {
  type: isGroup ? EnumCategoryType.Group : EnumCategoryType.Real,
  groupType: EnumCategoryGroupType.Normal,
  targetType: EnumCategoryTargetType.Income
}));

export default {
  initializeAll() {
    return clearDBs.clearData().then(() => Promise.all([
      databases.accounts.validatingBulkDocs(accountDocs),
      databases.categories.validatingBulkDocs(
        expenditureCategoryDocs
          .concat(incomeCategoryDocs)
      )
    ]));
  }
};
