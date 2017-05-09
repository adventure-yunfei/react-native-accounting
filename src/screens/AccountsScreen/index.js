import React, { PropTypes } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import Icon from 'react-native-elements/src/icons/Icon';

import BaseText from '../../components/BaseText';
import AccountsSummary from './AccountsSummary';
import flatToTree from '../../utils/flatToTree';
import utils from '../../utils';
import connectDB from '../../lib/connectDB';
import dbGetters from '../../lib/dbGetters';
import { Colors } from '../../variables';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF'
  },

  accountGroupHeader: {
    borderTopWidth: 10,
    borderTopColor: '#F1F1F1',
    borderStyle: 'solid',
    flexDirection: 'row',
    paddingTop: 15,
    paddingLeft: 16,
    paddingRight: 16
  },
  accountGroupHeader__title: {
    color: Colors.Text_Hint,
    fontSize: 12
  },
  accountGroupHeader__amount: {
    flex: 1,
    color: Colors.Text_Hint,
    fontSize: 14,
    textAlign: 'right'
  },

  accountRow: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16
  },
  accountRow__leftIcon: {
    marginRight: 10
  },
  accountRow__contentContainer: {
    flex: 1,
    height: '100%',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F1F1',
    borderStyle: 'solid',
    alignItems: 'center'
  },
  accountRow__contentContainer_last: {
    borderBottomWidth: 0
  },
  accountRow__mainText: {
    flex: 1,
    fontSize: 16
  },
  accountRow__amount: {
    fontSize: 16,
    color: Colors.Text_Hint
  },
  accountRow__rightIcon: {
    marginLeft: 4,
    marginRight: 8
  }
});

@connectDB(dbs => Promise.all([
  dbs.accounts.allDocsData(),
  dbGetters.getAmountByAccounts()
]).then(([accounts, accountAmounts]) => {
  let netAssets = 0;
  const accountDetailGroups = flatToTree(accounts, account => ({
    ...account,
    amount: accountAmounts[account._id] || 0
  }));
  accountDetailGroups.forEach((group) => {
    /* eslint no-param-reassign: off */
    group.amount = group.children.reduce((acc, { amount }) => acc + amount, 0);
    netAssets += group.amount;
  });
  return { accountDetailGroups, netAssets };
}))
export default class Accounts extends React.PureComponent {
  static navigationOptions = {
    title: '账户'
  }

  static propTypes = {
    netAssets: PropTypes.number,
    accountDetailGroups: PropTypes.array
  }

  renderAccountGroup(accountGrp) {
    const lastIdx = accountGrp.children.length - 1;
    return (
      <View key={accountGrp._id}>
        <View style={styles.accountGroupHeader}>
          <BaseText style={styles.accountGroupHeader__title}>{accountGrp.name}</BaseText>
          <BaseText style={styles.accountGroupHeader__amount}>{accountGrp.amount}</BaseText>
        </View>
        {accountGrp.children.map((account, idx) => (
          <View key={account._id} style={styles.accountRow}>
            <Icon size={37} containerStyle={styles.accountRow__leftIcon} name="credit-card" color="#AAA" />
            <View
              style={[
                styles.accountRow__contentContainer,
                idx === lastIdx && styles.accountRow__contentContainer_last
              ]}
            >
              <BaseText style={styles.accountRow__mainText}>{account.name}</BaseText>
              <BaseText style={styles.accountRow__amount}>{account.amount}</BaseText>
              <Icon name="keyboard-arrow-right" size={22} color="#D2D2D2" containerStyle={styles.accountRow__rightIcon} />
            </View>
          </View>
        ))}
      </View>
    );
  }

  render() {
    const { netAssets = 0, accountDetailGroups = [] } = this.props;
    return (
      <ScrollView style={styles.container}>
        <AccountsSummary netAssets={netAssets} />
        {accountDetailGroups.map(this.renderAccountGroup, this)}
      </ScrollView>
    );
  }
}
