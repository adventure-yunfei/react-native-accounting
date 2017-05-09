import databases from '../databases';
import EnumRecordType from '../enums/EnumRecordType';

export default {
  getAmountByAccounts() {
    return databases.records.allDocsData().then((docs) => {
      const accountAmounts = {};
      docs.forEach(({ type, amount, accountId, toAccountId }) => {
        if (type === EnumRecordType.Expenditure) {
          accountAmounts[accountId] = (accountAmounts[accountId] || 0) - amount;
        } else if (type === EnumRecordType.Transfer) {
          accountAmounts[accountId] = (accountAmounts[accountId] || 0) - amount;
          accountAmounts[toAccountId] = (accountAmounts[toAccountId] || 0) + amount;
        } else if (type === EnumRecordType.Income
          || type === EnumRecordType.InitAmount
          || type === EnumRecordType.InitLending) {
          accountAmounts[accountId] = (accountAmounts[accountId] || 0) + amount;
        } else if (type === EnumRecordType.InitBorrowing) {
          accountAmounts[accountId] = (accountAmounts[accountId] || 0) - amount;
        }
      });
      return accountAmounts;
    });
  }
};
