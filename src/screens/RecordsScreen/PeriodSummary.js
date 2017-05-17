import React, { PropTypes } from 'react';
import { View, StyleSheet } from 'react-native';

import BaseText from '../../components/BaseText';

export const SummaryHeight = 152;

const SummaryColor = '#725715';
const PaddingLeft = 17;

const styles = StyleSheet.create({
  rootContainer: {
    paddingBottom: 16,
    paddingTop: 33
  },

  primaryContainer: {
    paddingLeft: PaddingLeft,
    paddingBottom: 16
  },
  primaryAmount: {
    color: SummaryColor,
    fontSize: 34
  },

  secondaryAmount: {
    color: SummaryColor,
    fontSize: 18
  },

  descLabel: {
    color: SummaryColor,
    fontSize: 12
  },

  secondaryContainer: {
    flexDirection: 'row',
    paddingLeft: PaddingLeft
  },
  secondaryContainerItem: {
    flex: 1
  }
});

export default class PeriodSummary extends React.PureComponent {
  static propTypes = {
    income: PropTypes.number,
    expenditure: PropTypes.number
  }

  static defaultProps = {
    income: 0,
    expenditure: 0
  }

  render() {
    const { income, expenditure } = this.props;
    return (
      <View style={styles.rootContainer}>
        <View style={styles.primaryContainer}>
          <BaseText style={styles.primaryAmount}>{(income - expenditure).toFixed(2)}</BaseText>
          <BaseText style={styles.descLabel}>结余</BaseText>
        </View>
        <View style={styles.secondaryContainer}>
          <View style={styles.secondaryContainerItem}>
            <BaseText style={styles.secondaryAmount}>{income.toFixed(2)}</BaseText>
            <BaseText style={styles.descLabel}>收入</BaseText>
          </View>
          <View style={styles.secondaryContainerItem}>
            <BaseText style={styles.secondaryAmount}>{expenditure.toFixed(2)}</BaseText>
            <BaseText style={styles.descLabel}>支出</BaseText>
          </View>
        </View>
      </View>
    );
  }
}
