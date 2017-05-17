import React, { PropTypes } from 'react';
import { View, StyleSheet } from 'react-native';
import ParallaxView from 'react-native-parallax-view';

import SummaryHeader, { SummaryHeaderHeight } from './SummaryHeader';
import WriteOneButton from './WriteOneButton';
import SummaryDetails from './SummaryDetails';
import HomeTabbar from './HomeTabbar';
import { Geometries } from '../../variables';
import CustomPropTypes from '../../lib/CustomPropTypes';
import connectDB from '../../lib/connectDB';
import { calculateAsset } from '../../lib/recordHelpers';
import EnumRecordType from '../../enums/EnumRecordType';
import { getDayPeriod, getMonthPeriod, getWeekPeriod, getYearPeriod } from '../../utils/period';

import imgHeaderBG from '../../images/header-bg.png';

const styles = StyleSheet.create({
  homeContainer: {
    backgroundColor: '#fff',
    flex: 1
  },

  contentBottomPlaceholder: {
    height: Geometries.Tabbar
  },

  scrollableView: {
    shadowOpacity: 0
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
  const { startTime: yearStartTime } = getYearPeriod(now);
  return dbs.records.allDocsData().then((records) => {
    let dayIn = 0;
    let dayExp = 0;
    let weekIn = 0;
    let weekExp = 0;
    let monthIn = 0;
    let monthExp = 0;
    let yearIn = 0;
    let yearExp = 0;
    records.forEach(({ type, amount, timestamp }) => {
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
        if (timestamp >= yearStartTime) {
          yearExp += amount;
        }
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
        if (timestamp >= yearStartTime) {
          yearIn += amount;
        }
      }
    });
    const getSummary = (income, expenditure) => ({ income, expenditure });
    return {
      daySummary: getSummary(dayIn, dayExp),
      weekSummary: getSummary(weekIn, weekExp),
      monthSummary: getSummary(monthIn, monthExp),
      yearSummary: getSummary(yearIn, yearExp),
      totalAsset: calculateAsset(records)
    };
  });
})
export default class HomeScreen extends React.PureComponent {
  static propTypes = {
    navigation: CustomPropTypes.navigation.isRequired,
    daySummary: PeriodSummaryType,
    weekSummary: PeriodSummaryType,
    monthSummary: PeriodSummaryType,
    yearSummary: PeriodSummaryType,
    totalAsset: PropTypes.number
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
      yearSummary = defaultSummary,
      totalAsset = 0
    } = this.props;

    return (
      <View style={styles.homeContainer}>
        <ParallaxView
          backgroundSource={imgHeaderBG}
          windowHeight={SummaryHeaderHeight}
          header={(
            <SummaryHeader
              income={monthSummary.income} expenditure={monthSummary.expenditure} asset={totalAsset}
            />
          )}
          scrollableViewStyle={styles.scrollableView}
        >
          <WriteOneButton navigation={navigation} />
          <SummaryDetails
            navigation={navigation}
            daySummary={daySummary}
            weekSummary={weekSummary}
            monthSummary={monthSummary}
            yearSummary={yearSummary}
          />
          <View style={styles.contentBottomPlaceholder} />
        </ParallaxView>
        <HomeTabbar navigation={navigation} />
      </View>
    );
  }
}
