import React, { PropTypes } from 'react';
import { View, StyleSheet, TouchableHighlight } from 'react-native';
import moment from 'moment';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import Swipeout from 'react-native-swipeout';
import shader from 'shader';

import BaseText from '../../components/BaseText';
import { Colors } from '../../variables';
import EnumRecordType from '../../enums/EnumRecordType';
import exposeRootNavigation from '../../lib/exposeRootNavigation';
import CustomPropTypes from '../../lib/CustomPropTypes';
import onError from '../../lib/onError';
import databases from '../../databases';

const styles = StyleSheet.create({
  swipeWrapper: {
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderBottomColor: '#F1F1F1',
    backgroundColor: '#fff'
  },

  container: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 16,
    backgroundColor: '#fff'
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
  },
  amount_init: {
    color: Colors.Text_Hint
  }
});

@exposeRootNavigation
export default class RecordItem extends React.PureComponent {
  static propTypes = {
    detailRecord: PropTypes.object.isRequired,
    rootNavigation: CustomPropTypes.navigation.isRequired
  }

  onDeletePress = () => {
    databases.records.validatingPut({
      ...this.props.detailRecord,
      _deleted: true
    }).catch(onError());
  }

  onEditPress = () => {
    const { detailRecord, rootNavigation } = this.props;
    rootNavigation.navigate('EditRecord', {
      record: detailRecord
    });
  }

  render() {
    const { detailRecord } = this.props;
    const mDate = moment(detailRecord.timestamp);
    const amountStyle = [styles.amount];
    let descTitle = null;
    switch (detailRecord.type) {
      case EnumRecordType.Expenditure:
        amountStyle.push(styles.amount_expenditure);
        descTitle = detailRecord.categoryName;
        break;
      case EnumRecordType.Income:
        amountStyle.push(styles.amount_income);
        descTitle = detailRecord.categoryName;
        break;
      case EnumRecordType.Transfer:
        amountStyle.push(styles.amount_transfer);
        descTitle = `${detailRecord.accountName} -> ${detailRecord.toAccountName}`;
        break;
      case EnumRecordType.InitAmount:
        amountStyle.push(styles.amount_init);
        descTitle = '余额变更';
        break;
      case EnumRecordType.InitBorrowing:
        amountStyle.push(styles.amount_init);
        descTitle = '负债变更';
        break;
      case EnumRecordType.InitLending:
        amountStyle.push(styles.amount_init);
        descTitle = '债券变更';
        break;
      default: break;
    }
    const swipeRightButtons = [
      {
        text: '删除',
        backgroundColor: '#DF4147',
        underlayColor: shader('#DF4147', 0.1),
        onPress: this.onDeletePress
      },
      {
        text: '编辑',
        backgroundColor: '#F58749',
        underlayColor: shader('#F58749', 0.1),
        onPress: this.onEditPress
      }
    ];

    return (
      <Swipeout right={swipeRightButtons} style={styles.swipeWrapper}>
        <TouchableHighlight underlayColor="#eee" onPress={this.onEditPress}>
          <View style={styles.container}>
            <View style={styles.date}>
              <BaseText style={styles.date__title}>{mDate.format('DD')}</BaseText>
              <BaseText style={styles.date__subtitle}>{mDate.format('ddd')}</BaseText>
            </View>
            <MaterialIcons size={47} name="camera-alt" color="#D2D2D2" />
            <View style={styles.desc}>
              <BaseText style={styles.desc__cat}>{descTitle}</BaseText>
              <BaseText style={styles.desc__note}>{detailRecord.remark}</BaseText>
            </View>
            <BaseText style={amountStyle}>
              {detailRecord.amount.toFixed(2)}
            </BaseText>
          </View>
        </TouchableHighlight>
      </Swipeout>
    );
  }
}
