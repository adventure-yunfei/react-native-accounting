import React, { PropTypes } from 'react';
import { View, StyleSheet } from 'react-native';

import BaseText from '../../components/BaseText';
import FakeIcon from '../../components/FakeIcon';
import { Colors } from '../../variables';

const styles = StyleSheet.create({
  container: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderBottomColor: '#F1F1F1'
  },

  date: {
    width: 24
  },
  date__title: {
    fontSize: 16,
    color: Colors.Text_Hint
  },
  date__subtitle: {
    fontSize: 9,
    color: Colors.Text_Hint
  },

  desc: {
    flex: 1,
    paddingLeft: 11
  },
  desc__cat: {
    paddingBottom: 7
  },
  desc__note: {
    fontSize: 11,
    color: Colors.Text_Hint
  },

  amount: {
    fontSize: 17
  },
  amount_income: {
    color: Colors.Income
  },
  amount_expenditure: {
    color: Colors.Expenditure
  },
  amount_transfer: {
    color: Colors.Transfer
  }
});

export default class RecordItem extends React.PureComponent {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.date}>
          <BaseText style={styles.date__title}>26</BaseText>
          <BaseText style={styles.date__subtitle}>周三</BaseText>
        </View>
        <FakeIcon size={47} />
        <View style={styles.desc}>
          <BaseText style={styles.desc__cat}>工资收入</BaseText>
          <BaseText style={styles.desc__note}>公积金</BaseText>
        </View>
        <BaseText style={[styles.amount, styles.amount_income]}>12312.00</BaseText>
      </View>
    );
  }
}
