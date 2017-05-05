import React, { PropTypes } from 'react';
import { View, StyleSheet } from 'react-native';
import moment from 'moment';
import Icon from 'react-native-elements/src/icons/Icon';

import BaseText from '../../components/BaseText';
import { Colors } from '../../variables';
import EnumRecordType from '../../enums/EnumRecordType';

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
  static propTypes = {
    detailRecord: PropTypes.object.isRequired
  }

  render() {
    const { detailRecord } = this.props;
    const mDate = moment(detailRecord.timestamp);
    const amountStyle = [styles.amount];
    switch (detailRecord.type) {
      case EnumRecordType.Expenditure: amountStyle.push(styles.amount_expenditure); break;
      case EnumRecordType.Income: amountStyle.push(styles.amount_income); break;
      case EnumRecordType.Transfer: amountStyle.push(styles.amount_transfer); break;
      default: break;
    }

    return (
      <View style={styles.container}>
        <View style={styles.date}>
          <BaseText style={styles.date__title}>{mDate.format('DD')}</BaseText>
          <BaseText style={styles.date__subtitle}>{mDate.format('ddd')}</BaseText>
        </View>
        <Icon size={47} name="camera-alt" color="#D2D2D2" />
        <View style={styles.desc}>
          <BaseText style={styles.desc__cat}>{detailRecord.categoryName}</BaseText>
          <BaseText style={styles.desc__note}>{detailRecord.remark}</BaseText>
        </View>
        <BaseText style={amountStyle}>
          {detailRecord.amount.toFixed(2)}
        </BaseText>
      </View>
    );
  }
}
