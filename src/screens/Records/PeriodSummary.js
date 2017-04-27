import React, { PropTypes } from 'react';
import { View, Text } from 'react-native';

export default class PeriodSummary extends React.PureComponent {
  static propTypes = {
    balance: PropTypes.number.isRequired,
    income: PropTypes.number.isRequired,
    expenditure: PropTypes.number.isRequired
  }

  render() {
    const { balance, income, expenditure } = this.props;
    return (
      <View>
        <View><Text>{balance.toFixed(2)}</Text></View>
        <Text>结余</Text>
        <View>
          <View>
            <Text>{income.toFixed(2)}</Text>
            <View>收入</View>
          </View>
          <View>
            <Text>{expenditure.toFixed(2)}</Text>
            <View>支出</View>
          </View>
        </View>
      </View>
    );
  }
}
