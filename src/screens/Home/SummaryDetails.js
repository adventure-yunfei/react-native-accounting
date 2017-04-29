import React, { PropTypes } from 'react';
import { View, TouchableHighlight, StyleSheet } from 'react-native';

import BaseText from '../../components/BaseText';
import FakeIcon from '../../components/FakeIcon';

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
    color: 'rgb(20,186,137)'
  },
  expenditureAmount: {
    color: 'rgb(243,107,100)'
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
          <FakeIcon color="rgb(182,186,191)" name={icon} size={37} style={styles.detailRowMainIcon} />

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

export default class SummaryDetails extends React.PureComponent {
  render() {
    return (
      <View>
        <DetailRow icon="date-range" title="今天" subtitle="还没有记账" income={0} expenditure={0} />
        <DetailRow icon="date-range" title="本周" subtitle="4月1日 - 4月7日" income={0} expenditure={0} />
        <DetailRow icon="date-range" title="4月" subtitle="4月1日 - 4月30日" income={0} expenditure={0} />
        <DetailRow icon="date-range" title="本年" subtitle="2017年" income={0} expenditure={0} />
      </View>
    );
  }
}
