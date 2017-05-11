import React, { PropTypes } from 'react';
import { View } from 'react-native';
import moment from 'moment';

import RecordsByDay from './RecordsByDay';
import RecordsByWeek from './RecordsByWeek';
import { RecordsByMonth, RecordsByYear } from './RecordsByMonthOrYear';
import CustomPropTypes from '../../lib/CustomPropTypes';

const TYPE_DAY = 'day';
const TYPE_WEEK = 'week';
const TYPE_MONTH = 'month';
const TYPE_YEAR = 'year';

const INTERAL_DAY = 24 * 60 * 60 * 1000;
const MAX_INTERAL_WEEK = (8 * INTERAL_DAY) - 1;
const MAX_INTERVAL_MONTH = 31 * INTERAL_DAY;
const MAX_INTERVAL_YEAR = 366 * INTERAL_DAY;

function getDisplayType(startTime, endTime) {
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
  }
  return null;
}

export default class Records extends React.PureComponent {
  static propTypes = {
    navigation: CustomPropTypes.navigationWithParams(PropTypes.shape({
      startTime: PropTypes.number.isRequired,
      endTime: PropTypes.number.isRequired
    }))
  }

  static navigationOptions = ({ navigation }) => {
    const { startTime = 0, endTime = startTime } = navigation.state.params || {};
    const displayType = getDisplayType(startTime, endTime);
    let title = null;
    switch (displayType) {
      case TYPE_DAY: title = '今天'; break;
      case TYPE_WEEK: title = `${moment(startTime).format('YYYY年M月D日')} - ${moment(endTime).format('M月D日')}`; break;
      case TYPE_MONTH: title = `${moment(startTime).format('YYYY年M月')}流水`; break;
      case TYPE_YEAR: title = `${new Date(startTime).getFullYear()}年流水`; break;
      default: title = '详情';
    }
    return { title };
  }

  render() {
    const { navigation } = this.props;
    const { startTime = Date.now(), endTime = startTime } = navigation.state.params || {};
    const displayType = getDisplayType(startTime, endTime);
    const key = `${startTime}-${endTime}`;
    const subProps = { key, startTime, endTime, navigation };
    if (displayType === TYPE_DAY) {
      return <RecordsByDay key={key} startTime={startTime} endTime={endTime} />;
    }
    switch (displayType) {
      case TYPE_DAY: return <RecordsByDay {...subProps} />;
      case TYPE_WEEK: return <RecordsByWeek {...subProps} />;
      case TYPE_MONTH: return <RecordsByMonth {...subProps} />;
      case TYPE_YEAR: return <RecordsByYear {...subProps} />;
      default: return <View />;
    }
  }
}
