import React, { PropTypes } from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import last from 'lodash/last';

import BaseText from '../../components/BaseText';
import PeriodSummary from './PeriodSummary';
import RecordItem from './RecordItem';
import { connectDB } from '../../lib/pouchdb-connector';
import recordsScreenUtils, { recordsStyles } from './recordsScreenUtils';
import onError from '../../lib/onError';
import { Colors } from '../../variables';

const FetchLimit = 20;

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

@connectDB((dbs, { endTime }) => Promise.all([
  recordsScreenUtils.mapAccountsAndCategoriesDBs(dbs),
  dbs.records.allDocsData({
    descending: true,
    limit: FetchLimit,
    startkey: (endTime + 1).toString()
  })
]).then(([data, records]) => Object.assign(data, {
  initialDetailRecords: recordsScreenUtils.buildDetailRecords({ ...data, records })
})), { listenChanges: false })
export default class RecordsByDay extends React.PureComponent {
  static propTypes = {
    startTime: PropTypes.number.isRequired,
    /* eslint-disable react/no-unused-prop-types */
    endTime: PropTypes.number.isRequired,
    /* eslint-enable react/no-unused-prop-types */
    accountMap: PropTypes.object,
    categoryMap: PropTypes.object,
    initialDetailRecords: PropTypes.array,
    databases: PropTypes.object.isRequired
  }

  static defaultProps = {
    todaySummary: { expenditure: 0, income: 0 }
  }

  state = {
    todaySummary: { expenditure: 0, income: 0 },
    todayDetailRecords: null,
    otherDetailRecords: null
  }

  componentWillReceiveProps({ initialDetailRecords, startTime }) {
    if (!this.props.initialDetailRecords && initialDetailRecords) {
      const todayDetailRecords = [];
      const otherDetailRecords = [];
      initialDetailRecords.forEach((record) => {
        if (record.timestamp >= startTime) {
          todayDetailRecords.push(record);
        } else {
          otherDetailRecords.push(record);
        }
      });
      this.setState({
        todayDetailRecords,
        otherDetailRecords,
        todaySummary: recordsScreenUtils.calculateSummary(todayDetailRecords),
      });
    }
  }

  fetchMoreRecords = () => {
    const { otherDetailRecords } = this.state;
    const { accountMap, categoryMap, databases } = this.props;
    if (otherDetailRecords && otherDetailRecords.length && !this.__fetchingMore) {
      this.__fetchingMore = true;
      databases.records.allDocsData({
        descending: true,
        startkey: last(otherDetailRecords)._id,
        skip: 1
      })
        .then((recordsRes) => {
          this.setState({
            otherDetailRecords: otherDetailRecords.concat(recordsScreenUtils.buildDetailRecords({
              accountMap,
              categoryMap,
              records: recordsRes
            }))
          }, () => this.__fetchingMore = false);
        })
        .catch(onError());
    }
  }

  _renderItem = ({ item }) => <RecordItem detailRecord={item} />
  _keyExtractor = item => item._id
  _getHeaderComponent = () => {
    const { todaySummary, todayDetailRecords, otherDetailRecords } = this.state;
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
    const { otherDetailRecords } = this.state;
    return (
      <FlatList
        style={recordsStyles.container}
        ListHeaderComponent={this._getHeaderComponent()}
        data={otherDetailRecords || []}
        renderItem={this._renderItem}
        keyExtractor={this._keyExtractor}
        onEndReached={this.fetchMoreRecords}
      />
    );
  }
}
