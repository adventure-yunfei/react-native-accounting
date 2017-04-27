import React, { PropTypes } from 'react';
import { View, TouchableHighlight, Image, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  detailRow: {
    flexDirection: 'row'
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
      <TouchableHighlight style={styles.detailRow} onPress={onPress}>
        <Image source={icon} />
        <View>
          <View><Text>{title}</Text></View>
          <Text>{subtitle}</Text>
        </View>
        <View>
          <View><Text>{income.toFixed(2)}</Text></View>
          <Text>{expenditure.toFixed(2)}</Text>
        </View>
      </TouchableHighlight>
    );
  }
}

export default class SummaryDetails extends React.PureComponent {
  render() {
    return (
      <View>
        <DetailRow title="今天" subtitle="还没有记账" income={0} expenditure={0} />
        <DetailRow title="本周" subtitle="4月1日 - 4月7日" income={0} expenditure={0} />
        <DetailRow title="4月" subtitle="4月1日 - 4月30日" income={0} expenditure={0} />
        <DetailRow title="本年" subtitle="2017年" income={0} expenditure={0} />
      </View>
    );
  }
}
