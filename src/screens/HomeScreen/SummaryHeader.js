import React, { PropTypes } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { FontSizes, Colors } from '../../variables';

export const SummaryHeaderHeight = 264;

const HeaderBaseColor = 'rgb(115,88,10)';
const styles = StyleSheet.create({
  headerContainer: {
    height: SummaryHeaderHeight,
    backgroundColor: Colors.Orange,
    paddingTop: 46,
    paddingLeft: 22
  },

  timeLabel: {
    color: HeaderBaseColor,
    fontSize: 13
  },
  timeLabelSep: {
    color: 'rgb(190,165,76)'
  },
  timeLabelHighlight: {
    color: 'rgb(240,62,21)',
    fontSize: 26
  },

  descRowsContainer: {
    flex: 1,
    paddingTop: 9,
    paddingBottom: 11,
    justifyContent: 'space-around'
  },
  descRowItem: {
    flexDirection: 'row',
    width: '60%',
    flexWrap: 'nowrap'
  },
  descRowLeft: {
    textAlign: 'left',
    color: HeaderBaseColor,
    fontSize: FontSizes.Base
  },
  descRowRight: {
    flex: 1,
    textAlign: 'right',
    color: HeaderBaseColor,
    fontSize: FontSizes.Base
  }
});

function renderSummaryRow(label, amount) {
  return (
    <View style={styles.descRowItem}>
      <Text style={styles.descRowLeft}>{label}</Text>
      <Text style={styles.descRowRight}><Text>¥ </Text><Text>{amount.toFixed(2)}</Text></Text>
    </View>
  );
}

export default class SummaryHeader extends React.PureComponent {
  static propTypes = {
    income: PropTypes.number.isRequired,
    expenditure: PropTypes.number.isRequired,
    asset: PropTypes.number.isRequired
  }

  render() {
    const { income, expenditure, asset } = this.props;
    return (
      <View style={styles.headerContainer}>
        <Text style={styles.timeLabel}>
          <Text style={styles.timeLabelHighlight}>4</Text>
          <Text style={styles.timeLabelSep}> / </Text>
          <Text>2017</Text>
        </Text>

        <View style={styles.descRowsContainer}>
          {renderSummaryRow('本月收入', income)}
          {renderSummaryRow('本月支出', expenditure)}
          {renderSummaryRow('总资产', asset)}
        </View>
      </View>
    );
  }
}
