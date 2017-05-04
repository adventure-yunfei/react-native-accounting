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
  const queryPeriodSummary = period => dbs.records.find({
    selector: {
      _id: {
        $gte: period.startTime.toString(),
        $lte: period.endTime.toString()
      }
    }
  }).then((recordsRes) => {
    let expenditure = 0;
    let income = 0;
    recordsRes.docs.forEach(({ type, amount }) => {
      if (type === EnumRecordType.Expenditure) {
        expenditure += amount;
      } else if (type === EnumRecordType.Income) {
        income += amount;
      }
    });
    return { expenditure, income };
  });
  return Promise.all([
    queryPeriodSummary(getDayPeriod(now)),
    queryPeriodSummary(getWeekPeriod(now)),
    queryPeriodSummary(getMonthPeriod(now)),
    queryPeriodSummary(getYearPeriod(now))
  ]).then(([daySummary, weekSummary, monthSummary, yearSummary]) => ({
    daySummary, weekSummary, monthSummary, yearSummary
  }));
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
