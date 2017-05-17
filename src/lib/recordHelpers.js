import EnumRecordType from '../enums/EnumRecordType';

export function calculateAsset(records) {
  return records.reduce((acc, record) => {
    const { type, amount } = record;
    if (type === EnumRecordType.Expenditure
      || type === EnumRecordType.InitBorrowing) {
      return acc - amount;
    } else if (type === EnumRecordType.Transfer) {
      return acc;
    } else if (type === EnumRecordType.Income
      || type === EnumRecordType.InitAmount
      || type === EnumRecordType.InitLending) {
      return acc + amount;
    }
    return acc;
  }, 0);
}
