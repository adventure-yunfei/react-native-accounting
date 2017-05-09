import moment from 'moment';

import databases from '../databases';
import clearDBs from './clearDBs';
import EnumCategoryType from '../enums/EnumCategoryType';
import EnumCategoryTargetType from '../enums/EnumCategoryTargetType';
import EnumCategoryGroupType from '../enums/EnumCategoryGroupType';
import EnumAccountType from '../enums/EnumAccountType';
import EnumRecordType from '../enums/EnumRecordType';

import feideeJson from './feidee';

class Docs {
  constructor({ db, defaultFields }) {
    this.db = db;
    this.defaultFields = defaultFields || {};
  }
  docs = []
  docMap = []
  keyField = 'name'
  setMoreDefaultFields(defaultFields) {
    Object.assign(this.defaultFields, defaultFields);
  }
  push(doc) {
    const finalDoc = {
      ...this.defaultFields,
      ...doc
    };
    finalDoc._id = this.db.generateID(finalDoc);
    this.docs.push(finalDoc);
    this.docMap[doc[this.keyField]] = finalDoc;
  }
  get(key) {
    return this.docMap[key];
  }
  save() {
    return this.db.validatingBulkDocs(this.docs)
      .then(res => res.some(item => (!item.ok ? Promise.reject(new Error('错误')) : true)));
  }
}

export default {
  feideeJson,

  initializeWithJsonData() {
    const parseDateTime = datestr => moment(datestr, 'YYYY-MM-DD HH:mm:ss').toDate().getTime();
    const catDocs = new Docs({ db: databases.categories });
    const accountDocs = new Docs({ db: databases.accounts });
    const recordDocs = new Docs({ db: databases.records });
    accountDocs.push({
      name: '所有账户',
      type: EnumAccountType.Category,
    });
    accountDocs.setMoreDefaultFields({
      type: EnumAccountType.Real,
      parentId: accountDocs.get('所有账户')._id
    });

    const defaultKeyConfg = {
      type: '交易类型',
      date: '日期',
      cat: '分类',
      subcat: '子分类',
      account: '账户1',
      toaccount: '账户2',
      amount: '金额',
      remark: '备注'
    };
    const process = ({ catTgtType, moreProcess } = {}, keyConfig = {}) => {
      Object.assign(keyConfig, defaultKeyConfg);
      return (data) => {
        // 分类
        const cat = data[keyConfig.cat];
        if (cat && !catDocs.get(cat)) {
          catDocs.push({
            name: cat,
            type: EnumCategoryType.Group,
            groupType: EnumCategoryGroupType.Normal,
            targetType: catTgtType
          });
        }
        // 子分类
        const subcat = data[keyConfig.subcat];
        if (subcat && !catDocs.get(subcat)) {
          catDocs.push({
            name: subcat,
            type: EnumCategoryType.Real,
            groupType: EnumCategoryGroupType.Normal,
            targetType: catTgtType,
            parentId: catDocs.get(cat)._id
          });
        }
        // 账户
        const account = data[keyConfig.account];
        const toaccount = data[keyConfig.toaccount];
        const processAccount = (accountName) => {
          if (accountName && !accountDocs.get(accountName)) {
            accountDocs.push({
              name: accountName,
              type: EnumAccountType.Real,
              parentId: accountDocs.get('所有账户')._id
            });
          }
        };
        processAccount(account);
        processAccount(toaccount);
        // 收入、支出、转账
        const type = data[keyConfig.type];
        let recordType = null;
        switch (type) {
          case '收入': recordType = EnumRecordType.Income; break;
          case '支出': recordType = EnumRecordType.Expenditure; break;
          case '转账': recordType = EnumRecordType.Transfer; break;
          case '余额变更': recordType = EnumRecordType.InitAmount; break;
          case '负债变更': recordType = EnumRecordType.InitBorrowing; break;
          case '债权变更': recordType = EnumRecordType.InitLending; break;
          default: global.all('TODO...');
        }
        recordDocs.push({
          type: recordType,
          amount: parseFloat(data[keyConfig.amount]),
          remark: data[keyConfig.remark],
          timestamp: parseDateTime(data[keyConfig.date]),
          ...(subcat && { categoryId: catDocs.get(subcat)._id }),
          ...(account && { accountId: accountDocs.get(account)._id }),
          ...(toaccount && { toAccountId: accountDocs.get(toaccount)._id })
        });
        // 自定义操作
        if (moreProcess) {
          moreProcess(data, keyConfig);
        }
      };
    };

    feideeJson.incomeJson.forEach(process({ catTgtType: EnumCategoryTargetType.Income }));
    feideeJson.expenditureJson.forEach(process({ catTgtType: EnumCategoryTargetType.Expenditure }));
    feideeJson.transferJson.forEach(process());
    feideeJson.amountJson.forEach(process());
    feideeJson.borrowJson.forEach(process());
    feideeJson.lendingJson.forEach(process());

    return clearDBs.clearData().then(() => Promise.all([
      catDocs.save(),
      accountDocs.save(),
      recordDocs.save()
    ]));
  }
};
