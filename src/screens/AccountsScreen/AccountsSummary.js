import React, { PropTypes } from 'react';
import { View, StyleSheet } from 'react-native';

import BaseText from '../../components/BaseText';

const SummaryColor = '#725715';
const PaddingLeft = 17;

const styles = StyleSheet.create({
  rootContainer: {
    backgroundColor: '#FDD352',
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
    netAssets: PropTypes.number.isRequired
  }

  render() {
    const { netAssets } = this.props;
    return (
      <View style={styles.rootContainer}>
        <View style={styles.primaryContainer}>
          <BaseText style={styles.primaryAmount}>{netAssets.toFixed(2)}</BaseText>
          <BaseText style={styles.descLabel}>净资产</BaseText>
        </View>
        <View style={styles.secondaryContainer}>
          <View style={styles.secondaryContainerItem}>
            <BaseText style={styles.secondaryAmount}>{netAssets.toFixed(2)}</BaseText>
            <BaseText style={styles.descLabel}>资产</BaseText>
          </View>
          <View style={styles.secondaryContainerItem}>
            <BaseText style={styles.secondaryAmount}>0.00</BaseText>
            <BaseText style={styles.descLabel}>负债</BaseText>
          </View>
        </View>
      </View>
    );
  }
}
