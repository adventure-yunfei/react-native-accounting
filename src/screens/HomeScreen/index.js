import React, { PropTypes } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';

import SummaryHeader from './SummaryHeader';
import WriteOneButton from './WriteOneButton';
import SummaryDetails from './SummaryDetails';
import HomeTabbar from './HomeTabbar';
import { Geometries } from '../../variables';
import CustomPropTypes from '../../lib/CustomPropTypes';
import connectDB from '../../lib/connectDB';
import EnumRecordType from '../../enums/EnumRecordType';
import { getDayPeriod, getMonthPeriod, getWeekPeriod, getYearPeriod } from '../../utils/period';

const styles = StyleSheet.create({
  homeContainer: {
    backgroundColor: '#fff'
  },

  contentBottomPlaceholder: {
    height: Geometries.Tabbar
  }
});

const PeriodSummaryType = PropTypes.shape({
  income: PropTypes.number.isRequired,
  expenditure: PropTypes.number.isRequired
});

@connectDB((dbs) => {
  const now = Date.now();
  const { startTime: dayStartTime } = getDayPeriod(now);
  const { startTime: weekStartTime } = getWeekPeriod(now);
  const { startTime: monthStartTime } = getMonthPeriod(now);
  const { startTime: yearStartTime, endTime: yearEndTime } = getYearPeriod(now);
  return dbs.records.find({
    selector: {
      _id: {
        $gte: yearStartTime.toString(),
        $lte: yearEndTime.toString()
      }
    }
  }).then(({ docs }) => {
    let dayIn = 0;
    let dayExp = 0;
    let weekIn = 0;
    let weekExp = 0;
    let monthIn = 0;
    let monthExp = 0;
    let yearIn = 0;
    let yearExp = 0;
    docs.forEach(({ type, amount, timestamp }) => {
      if (type === EnumRecordType.Expenditure) {
        if (timestamp >= dayStartTime) {
          dayExp += amount;
        }
        if (timestamp >= weekStartTime) {
          weekExp += amount;
        }
        if (timestamp >= monthStartTime) {
          monthExp += amount;
        }
        yearExp += amount;
      } else if (type === EnumRecordType.Income) {
        if (timestamp >= dayStartTime) {
          dayIn += amount;
        }
        if (timestamp >= weekStartTime) {
          weekIn += amount;
        }
        if (timestamp >= monthStartTime) {
          monthIn += amount;
        }
        yearIn += amount;
      }
    });
    const getSummary = (income, expenditure) => ({ income, expenditure });
    return {
      daySummary: getSummary(dayIn, dayExp),
      weekSummary: getSummary(weekIn, weekExp),
      monthSummary: getSummary(monthIn, monthExp),
      yearSummary: getSummary(yearIn, yearExp)
    };
  });
})
export default class HomeScreen extends React.PureComponent {
  static propTypes = {
    navigation: CustomPropTypes.navigation.isRequired,
    daySummary: PeriodSummaryType,
    weekSummary: PeriodSummaryType,
    monthSummary: PeriodSummaryType,
    yearSummary: PeriodSummaryType
  }

  static navigationOptions = {
    header: null,
  }

  render() {
    const defaultSummary = { income: 0, expenditure: 0 };
    const {
      navigation,
      daySummary = defaultSummary,
      weekSummary = defaultSummary,
      monthSummary = defaultSummary,
      yearSummary = defaultSummary
    } = this.props;

    return (
      <View style={styles.homeContainer}>
        <ScrollView>
          <SummaryHeader />
          <WriteOneButton navigation={navigation} />
          <SummaryDetails
            navigation={navigation}
            daySummary={daySummary}
            weekSummary={weekSummary}
            monthSummary={monthSummary}
            yearSummary={yearSummary}
          />
          <View style={styles.contentBottomPlaceholder} />
        </ScrollView>
        <HomeTabbar navigation={navigation} />
      </View>
    );
  }
}
