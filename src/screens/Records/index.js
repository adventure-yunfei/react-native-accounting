import React, { PropTypes } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import PeriodSummary from './PeriodSummary';
import RecordItemList from './RecordItemList';
// import getDate from '../../utils/getDate';
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.BG_Default
  }
});

export default class Records extends React.PureComponent {
  static propTypes = {
    navigation: PropTypes.object.isRequired
  }

  static navigationOptions = {
    title: '详情'
  }

  render() {
    const { navigation: { state: { params: { startTime, endTime } } } } = this.props;
    const displayType = getType(startTime, endTime);

    return (
      <ScrollView style={styles.container}>
        <PeriodSummary balance={0} income={1} expenditure={2} />
        <RecordItemList />
      </ScrollView>
    );
  }
}
