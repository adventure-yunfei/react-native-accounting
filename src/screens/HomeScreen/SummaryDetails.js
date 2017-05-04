import React, { PropTypes } from 'react';
import { View, TouchableHighlight, StyleSheet } from 'react-native';
import moment from 'moment';

import BaseText from '../../components/BaseText';
import FakeIcon from '../../components/FakeIcon';
import { getDayPeriod, getWeekPeriod, getMonthPeriod, getYearPeriod } from '../../utils/period';
import CustomPropTypes from '../../lib/CustomPropTypes';
import { Colors } from '../../variables';

const styles = StyleSheet.create({
  detailRow: {
    flex: 1,
    height: 65,
    flexDirection: 'row',
    alignItems: 'center'
  },

  detailRowMainIcon: {
    marginLeft: 16,
    marginRight: 11,
  },

  rightContentBox: {
    flex: 1,
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgb(241,241,241)',
    borderStyle: 'solid'
  },
  subtitle: {
    color: '#999'
  },
  amountContainer: {
    flex: 1,
    alignItems: 'flex-end'
  },
  incomeAmount: {
    color: Colors.Income
  },
  expenditureAmount: {
    color: Colors.Expenditure
  },
  rightArrowIconContainer: {
    marginLeft: 3
  }
});

class DetailRow extends React.PureComponent {
  static propTypes = {
    onPress: PropTypes.func,
    icon: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired,
    income: PropTypes.number.isRequired,
    expenditure: PropTypes.number.isRequired
  }

  render() {
    const { onPress, icon, title, subtitle, income, expenditure } = this.props;
    return (
      <TouchableHighlight onPress={onPress}>
        <View style={styles.detailRow} >
          <FakeIcon name={icon} size={37} containerStyle={styles.detailRowMainIcon} />

          <View style={styles.rightContentBox}>
            <View>
              <BaseText>{title}</BaseText>
              <BaseText style={styles.subtitle}>{subtitle}</BaseText>
            </View>
            <View style={styles.amountContainer}>
              <BaseText style={styles.expenditureAmount}>{expenditure.toFixed(2)}</BaseText>
              <BaseText style={styles.incomeAmount}>{income.toFixed(2)}</BaseText>
            </View>
            <FakeIcon name="keyboard-arrow-right" size={22} color="rgb(210,210,210)" containerStyle={styles.rightArrowIconContainer} />
          </View>

        </View>
      </TouchableHighlight>
    );
  }
}

const PeriodSummaryType = PropTypes.shape({
  income: PropTypes.number.isRequired,
  expenditure: PropTypes.number.isRequired,
});

export default class SummaryDetails extends React.PureComponent {
  static propTypes = {
    navigation: CustomPropTypes.navigation.isRequired,
    daySummary: PeriodSummaryType.isRequired,
    weekSummary: PeriodSummaryType.isRequired,
    monthSummary: PeriodSummaryType.isRequired,
    yearSummary: PeriodSummaryType.isRequired
  }
  static propTypes = {
    navigation: CustomPropTypes.navigation.isRequired,
  }

  jumpToTodayRecords = () => {
    this.props.navigation.navigate('Records', getDayPeriod());
  }
  jumpToWeekRecords = () => {
    this.props.navigation.navigate('Records', getWeekPeriod());
  }
  jumpToMonthRecords = () => {
    this.props.navigation.navigate('Records', getMonthPeriod());
  }
  jumpToYearRecords = () => {
    this.props.navigation.navigate('Records', getYearPeriod());
  }

  render() {
    const {
      daySummary,
      weekSummary,
      monthSummary,
      yearSummary
    } = this.props;
    const formatPeriod = period => `${moment(period.startTime).format('M月D日')} - ${moment(period.endTime).format('M月D日')}`;
    const weekSubtitle = formatPeriod(getWeekPeriod());
    const monthSubtitle = formatPeriod(getMonthPeriod());
    const yearSubtitle = `${(new Date(Date.now())).getFullYear()}年`;

    return (
      <View>
        <DetailRow onPress={this.jumpToTodayRecords} icon="date-range" title="今天" subtitle="" {...daySummary} />
        <DetailRow onPress={this.jumpToWeekRecords} icon="date-range" title="本周" subtitle={weekSubtitle} {...weekSummary} />
        <DetailRow onPress={this.jumpToMonthRecords} icon="date-range" title="4月" subtitle={monthSubtitle} {...monthSummary} />
        <DetailRow onPress={this.jumpToYearRecords} icon="date-range" title="本年" subtitle={yearSubtitle} {...yearSummary} />
      </View>
    );
  }
}
