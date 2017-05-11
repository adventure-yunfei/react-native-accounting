import { PropTypes } from 'react';
import { StyleSheet } from 'react-native';
import utils from '../../utils';
import EnumRecordType from '../../enums/EnumRecordType';
import { Colors } from '../../variables';

export const recordsStyles = StyleSheet.create({
  container: {
    backgroundColor: Colors.BG_Default
  }
});

export const RecordsPropTypes = {
  periodSummary: PropTypes.shape({
    expenditure: PropTypes.number.isRequired,
    income: PropTypes.number.isRequired
  })
};

const recordsScreenUtils = {
  mapAccountsAndCategoriesDBs(dbs) {
    return Promise.all([
      dbs.accounts.allDocsData(),
      dbs.categories.allDocsData()
    ]).then(([accounts, categories]) => ({
      accountMap: utils.arrayToMap(accounts, '_id'),
      categoryMap: utils.arrayToMap(categories, '_id')
    }));
  },

  mapToPeriodRecordsProps(dbs, { startTime, endTime }) {
    return Promise.all([
      recordsScreenUtils.mapAccountsAndCategoriesDBs(dbs),
      dbs.records.allDocsData({
        descending: true,
        startkey: (endTime + 1).toString(),
        endkey: startTime.toString()
      })
    ]).then(([props, records]) => ({
      ...props,
      detailRecords: recordsScreenUtils.buildDetailRecords({ ...props, records }),
      periodSummary: recordsScreenUtils.calculateSummary(records)
    }));
  },

  buildDetailRecords({ categoryMap, accountMap, records }) {
    return records.map((record) => {
      const detailRecord = Object.assign({}, record);
      if (detailRecord.categoryId) {
        detailRecord.categoryName = categoryMap[record.categoryId].name;
      }
      if (detailRecord.accountId) {
        detailRecord.accountName = accountMap[detailRecord.accountId].name;
      }
      if (detailRecord.toAccountId) {
        detailRecord.toAccountName = accountMap[detailRecord.toAccountId].name;
      }
      return detailRecord;
    });
  },

  calculateSummary(records) {
    let expenditure = 0;
    let income = 0;
    records.forEach((record) => {
      switch (record.type) {
        case EnumRecordType.Expenditure:
          expenditure += record.amount;
          break;
        case EnumRecordType.Income:
          income += record.amount;
          break;
        default:
          break;
      }
    });
    return {
      expenditure,
      income
    };
  }
};

export default recordsScreenUtils;
