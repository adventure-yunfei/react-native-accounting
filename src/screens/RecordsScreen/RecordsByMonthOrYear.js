import React, { PropTypes } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableHighlight } from 'react-native';
import takeWhile from 'lodash/takeWhile';
import moment from 'moment';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import BaseText from '../../components/BaseText';
import PeriodSummary from './PeriodSummary';
import RecordsRefreshWrapper from './RecordsRefreshWrapper';
import RecordItem from './RecordItem';
import connectDB from '../../lib/connectDB';
import CustomPropTypes from '../../lib/CustomPropTypes';
import recordsScreenUtils, { RecordsPropTypes } from './recordsScreenUtils';
import { getMonthPeriod, getWeekPeriod, getYearPeriod } from '../../utils/period';
import { Colors } from '../../variables';

const periodRecordsInfoType = PropTypes.shape({
  startTime: PropTypes.number.isRequired,
  endTime: PropTypes.number.isRequired,
  records: PropTypes.array.isRequired,
  periodSummary: RecordsPropTypes.periodSummary.isRequired,
  timeTitle: PropTypes.string.isRequired,
  timeSubtitle: PropTypes.string
});

const secHeaderStyles = StyleSheet.create({
  container: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16
  },

  timeTitle: {
    fontSize: 19,
    width: 66,
    color: Colors.Default
  },

  timeSubtitle: {
    fontSize: 9,
    paddingTop: 4,
    color: Colors.Text_Hint
  },

  amount: {
    fontSize: 10,
  },
  amount_income: {
    color: Colors.Income
  },
  amount_expenditure: {
    color: Colors.Expenditure
  },

  balance: {
    flex: 1,
    textAlign: 'right',
    fontSize: 18,
    color: Colors.Text_Hint
  },
  balance__title: {
    fontSize: 10,
    lineHeight: 18
  },

  arrowIcon: {
    marginLeft: 4,
    marginRight: 8
  }
});

class SectionHeader extends React.PureComponent {
  static propTypes = {
    onHeaderPress: PropTypes.func.isRequired,
    periodRecordsInfo: periodRecordsInfoType.isRequired,
    selected: PropTypes.bool.isRequired,
    index: PropTypes.number.isRequired
  }
  onPress = () => {
    const { onHeaderPress, index } = this.props;
    onHeaderPress(index);
  }
  render() {
    const { selected } = this.props;
    const { periodSummary, timeTitle, timeSubtitle } = this.props.periodRecordsInfo;
    return (
      <TouchableHighlight onPress={this.onPress}>
        <View style={secHeaderStyles.container}>
          <View>
            <BaseText style={secHeaderStyles.timeTitle}>{timeTitle}</BaseText>
            {timeSubtitle
              && <BaseText style={secHeaderStyles.timeSubtitle}>{timeSubtitle}</BaseText>}
          </View>
          <BaseText style={secHeaderStyles.amount}>
            <Text style={secHeaderStyles.amount_income}>
              收 <Text>{periodSummary.income.toFixed(2)}</Text>
            </Text>
            {'\n\n'}
            <Text style={secHeaderStyles.amount_expenditure}>
              支 <Text>{periodSummary.expenditure.toFixed(2)}</Text>
            </Text>
          </BaseText>
          <BaseText style={secHeaderStyles.balance}>
            <Text style={secHeaderStyles.balance__title}>结余</Text>
            {`\n${(periodSummary.income - periodSummary.expenditure).toFixed(2)}`}
          </BaseText>
          <MaterialIcons style={secHeaderStyles.arrowIcon} size={24} name={selected ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} color="#DADADA" />
        </View>
      </TouchableHighlight>
    );
  }
}

class SectionalRecords extends React.PureComponent {
  static propTypes = {
    startTime: PropTypes.number.isRequired,
    endTime: PropTypes.number.isRequired,
    periodRecordsInfos: PropTypes.arrayOf(periodRecordsInfoType),
    getPeriod: PropTypes.func.isRequired,
    periodSummary: RecordsPropTypes.periodSummary,
    navigation: CustomPropTypes.navigation.isRequired
  }

  state = { activeIndex: 0 }

  onBottomRefresh = () => {
    const { navigation, startTime, getPeriod } = this.props;
    navigation.setParams(getPeriod(startTime - 1));
  }

  onHeaderPress = (idx) => {
    const { activeIndex } = this.state;
    this.setState({
      activeIndex: activeIndex === idx ? null : idx
    });
  }

  _renderItem = ({ item }) => <RecordItem detailRecord={item} />
  _keyExtractor = item => item._id

  render() {
    const { periodRecordsInfos = [], periodSummary } = this.props;
    const { activeIndex } = this.state;
    const sectionHeaders = periodRecordsInfos.map((recordsInfo, idx) => (
      <SectionHeader
        key={recordsInfo.startTime}
        periodRecordsInfo={recordsInfo}
        selected={activeIndex === idx}
        index={idx}
        onHeaderPress={this.onHeaderPress}
      />
    ));
    const ListHeaderComponent = () => (
      <View>
        <PeriodSummary {...periodSummary} />
        {activeIndex == null ? sectionHeaders : sectionHeaders.slice(0, activeIndex + 1)}
      </View>
    );
    const ListFooterComponent = () => (
      <View>
        {activeIndex != null && sectionHeaders.slice(activeIndex + 1)}
      </View>
    );

    return (
      <RecordsRefreshWrapper onBottomRefresh={this.onBottomRefresh}>
        <FlatList
          ListHeaderComponent={ListHeaderComponent}
          ListFooterComponent={ListFooterComponent}
          data={periodRecordsInfos[activeIndex] && periodRecordsInfos[activeIndex].records}
          renderItem={this._renderItem}
          keyExtractor={this._keyExtractor}
        />
      </RecordsRefreshWrapper>
    );
  }
}

function getMapToSectionalRecords({ getPeriod, getTimeTitle, getTimeSubtitle = null }) {
  return (dbs, props) => recordsScreenUtils.mapToPeriodRecordsProps(dbs, props)
    .then(({ detailRecords, periodSummary }) => {
      const { startTime } = props;
      const endTime = Math.min(props.endTime, Date.now());
      const weekedRecords = [];
      let currWeek = getPeriod(endTime);
      while (currWeek.endTime >= startTime) {
        const weekStartTime = currWeek.startTime;
        const recordsSlice = takeWhile(detailRecords, record => record.timestamp >= weekStartTime);
        detailRecords.splice(0, recordsSlice.length);
        currWeek.records = recordsSlice;
        currWeek.periodSummary = recordsScreenUtils.calculateSummary(recordsSlice);
        weekedRecords.push(currWeek);
        currWeek = getPeriod(currWeek.startTime - 1);
      }
      const len = weekedRecords.length;
      weekedRecords.forEach((result, idx) => {
        /* eslint-disable no-param-reassign */
        result.timeTitle = getTimeTitle(currWeek, len - idx);
        result.timeSubtitle = getTimeSubtitle && getTimeSubtitle(currWeek);
        /* eslint-enable no-param-reassign */
      });
      return { periodSummary, periodRecordsInfos: weekedRecords };
    });
}

export const RecordsByMonth = connectDB(
  getMapToSectionalRecords({
    getPeriod: getWeekPeriod,
    getTimeTitle: (recordsInfo, cnt) => `${cnt}周`,
    getTimeSubtitle: ({ startTime, endTime }) => `${moment(startTime).format('M.D')}-${moment(endTime).format('M.D')}`
  })
)(props => <SectionalRecords {...props} getPeriod={getMonthPeriod} />);

export const RecordsByYear = connectDB(
  getMapToSectionalRecords({
    getPeriod: getMonthPeriod,
    getTimeTitle: (recordsInfo, cnt) => `${cnt}月`
  })
)(props => <SectionalRecords {...props} getPeriod={getYearPeriod} />);

