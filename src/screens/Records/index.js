import React, { PropTypes } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import PeriodSummary from './PeriodSummary';
import RecordItemList from './RecordItemList';
import connectDB from '../../lib/connectDB';
// import getDate from '../../utils/getDate';
import EnumRecordType from '../../enums/EnumRecordType';
import { Colors } from '../../variables';

const TYPE_DAY = 'day';
const TYPE_WEEK = 'week';
const TYPE_MONTH = 'month';
const TYPE_YEAR = 'year';

const INTERAL_DAY = 24 * 60 * 60 * 1000;
const MAX_INTERAL_WEEK = (8 * INTERAL_DAY) - 1;
const MAX_INTERVAL_MONTH = 31 * INTERAL_DAY;
const MAX_INTERVAL_YEAR = 366 * INTERAL_DAY;

function getType(startTime, endTime) {
  const interval = endTime - startTime;
  if (interval < 0) {
    return null;
  } else if (interval < INTERAL_DAY) {
    return TYPE_DAY;
  } else if (interval < MAX_INTERAL_WEEK) {
    return TYPE_WEEK;
  } else if (interval < MAX_INTERVAL_MONTH) {
    return TYPE_MONTH;
  } else if (interval < MAX_INTERVAL_YEAR) {
    return TYPE_YEAR;
  } else {
    return null;
  }
}

function calculateSummary(records) {
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
    }
  });
  return {
    expenditure,
    income,
    balance: income - expenditure
  };
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.BG_Default
  }
});

@connectDB((dbs, { navigation }) => {
  return Promise.all([
    dbs.categories.allDocsData(),
    dbs.records.allDocsData()
  ]).then(([categories, records]) => {
    const { state: { params: { startTime, endTime } } } = navigation;
    return {
      categories,
      records: records.filter(({ timestamp }) => startTime <= timestamp && timestamp <= endTime)
    };
  });
})
export default class Records extends React.PureComponent {
  static propTypes = {
    categories: PropTypes.array,
    records: PropTypes.array
  }

  static defaultProps = {
    records: []
  }

  static navigationOptions = {
    title: '详情'
  }

  state = {
    totalBalance: 0,
    totalIncome: 0,
    totalExpenditure: 0
  }

  render() {
    // const { navigation: { state: { params: { startTime, endTime } } } } = this.props;
    // const displayType = getType(startTime, endTime);
    const { records, categories } = this.props;

    return (
      <ScrollView style={styles.container}>
        <PeriodSummary {...calculateSummary(records)} />
        <RecordItemList records={records || []} categories={categories || []} />
      </ScrollView>
    );
  }
}
