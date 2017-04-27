import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  timeLabel: {
  },
  timeLabelHighlight: {
  },

  descRowLeft: {
    flex: 1,
    justifyContent: 'flex-start'
  },

  descRowRight: {
    flex: 1,
    justifyContent: 'flex-end'
  }
});

function renderSummaryRow(label, amount) {
  return (
    <View>
      <View style={styles.descRowLeft}><Text>{label}</Text></View>
      <View style={styles.descRowRight}><Text>¥ </Text><Text>{amount.toFixed(2)}</Text></View>
    </View>
  );
}

export default class SummaryHeader extends React.PureComponent {
  render() {
    return (
      <View>
        <View style={styles.timeLabel}>
          <Text style={styles.timeLabelHighlight}>4</Text><Text>/2017</Text>
        </View>

        <View>
          {renderSummaryRow('本月收入', 12312)}
          {renderSummaryRow('本月支出', 231)}
          {renderSummaryRow('总资产', 131412)}
        </View>
      </View>
    );
  }
}
