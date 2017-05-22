import React, { PropTypes } from 'react';
import { FlatList, View, StyleSheet } from 'react-native';

import BaseText from '../../components/BaseText';
import PeriodSummary from './PeriodSummary';
import RecordItem from './RecordItem';
import { connectDB } from '../../lib/pouchdb-connector';
import recordsScreenUtils, { recordsStyles, RecordsPropTypes } from './recordsScreenUtils';
import { Colors } from '../../variables';

const styles = StyleSheet.create({
  todayEmptyTip: {
    height: 65,
    lineHeight: 65,
    paddingLeft: 16,
    fontSize: 14,
    color: '#767E88',
    backgroundColor: '#FFF'
  },

  todaySepLabel: {
    height: 49,
    lineHeight: 49,
    textAlign: 'center',
    fontSize: 13,
    color: Colors.Text_Hint,
    backgroundColor: '#F1F1F1',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E4E4E4',
    borderStyle: 'solid'
  }
});

@connectDB((dbs, { startTime, endTime }) => Promise.all([
  recordsScreenUtils.mapAccountsAndCategoriesDBs(dbs),
  dbs.records.allDocsData({
    descending: true,
    startkey: (endTime + 1).toString()
  })
]).then(([data, records]) => {
  const detailRecords = recordsScreenUtils.buildDetailRecords({ ...data, records });
  const todayDetailRecords = [];
  const otherDetailRecords = [];
  detailRecords.forEach((record) => {
    if (record.timestamp >= startTime) {
      todayDetailRecords.push(record);
    } else {
      otherDetailRecords.push(record);
    }
  });
  return {
    todayDetailRecords,
    otherDetailRecords,
    todaySummary: recordsScreenUtils.calculateSummary(todayDetailRecords)
  };
}))
export default class RecordsByDay extends React.PureComponent {
  static propTypes = {
    /* eslint-disable react/no-unused-prop-types */
    startTime: PropTypes.number.isRequired,
    endTime: PropTypes.number.isRequired,
    /* eslint-enable react/no-unused-prop-types */
    todayDetailRecords: PropTypes.array,
    otherDetailRecords: PropTypes.array,
    todaySummary: RecordsPropTypes.periodSummary
  }

  static defaultProps = {
    todaySummary: { expenditure: 0, income: 0 }
  }

  state = {
    todaySummary: { expenditure: 0, income: 0 },
    todayDetailRecords: null,
    otherDetailRecords: null
  }

  _renderItem = ({ item }) => <RecordItem detailRecord={item} />
  _keyExtractor = item => item._id
  _getHeaderComponent = () => {
    const { todaySummary, todayDetailRecords, otherDetailRecords } = this.props;
    return () => (
      <View>
        <PeriodSummary {...todaySummary} />
        {todayDetailRecords
          ? todayDetailRecords.map(record => <RecordItem key={record._id} detailRecord={record} />)
          : <BaseText style={styles.todayEmptyTip}>今天还没有记账哦~</BaseText>}
        {otherDetailRecords && !!otherDetailRecords.length
          && <BaseText style={styles.todaySepLabel}>今天以前</BaseText>}
      </View>
    );
  }

  render() {
    const { otherDetailRecords } = this.props;
    return (
      <FlatList
        style={recordsStyles.container}
        ListHeaderComponent={this._getHeaderComponent()}
        data={otherDetailRecords || []}
        renderItem={this._renderItem}
        keyExtractor={this._keyExtractor}
      />
    );
  }
}
