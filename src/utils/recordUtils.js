import EnumRecordType from '../enums/EnumRecordType';

/**
 * 获取记录对于最终资产的影响数值
 * @param {Object} record
 */
export function getAmountForAsset(record) {
  const { type, amount } = record;
  if (type === EnumRecordType.Expenditure) {
    return -amount;
  } else if (type === EnumRecordType.Transfer) {
    return 0;
  } else if (type === EnumRecordType.Income) {
    return amount;
  }
  return 0;
}
