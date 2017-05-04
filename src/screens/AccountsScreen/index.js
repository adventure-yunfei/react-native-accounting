import React, { PropTypes } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';

import BaseText from '../../components/BaseText';
import FakeIcon from '../../components/FakeIcon';
import AccountsSummary from './AccountsSummary';
import flatToTree from '../../utils/flatToTree';
import connectDB from '../../lib/connectDB';
import { componentWillApplyProps } from '../../lib/lifecycle';
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
    marginLeft: 10,
    marginRight: 15
  }
});

@connectDB(dbs => dbs.accounts.allDocsData()
  .then(accounts => ({ accounts })))
@componentWillApplyProps
export default class Accounts extends React.PureComponent {
  static navigationOptions = {
    title: '账户'
  }

  static propTypes = {
    accounts: PropTypes.array
  }

  state = {
    netAssets: 0,
    accountGroups: []
  }

  componentWillApplyProps(prevProps = {}, nextProps) {
    if (nextProps.accounts && prevProps.accounts !== nextProps.accounts) {
      const accountGroups = flatToTree(nextProps.accounts);
      let netAssets = 0;
      accountGroups.forEach((accountGrp) => {
        accountGrp.amount =
          accountGrp.children.reduce((acc, account) => acc + account.amount, 0);
        netAssets += accountGrp.amount;
      });

      this.setState({
        accountGroups,
        netAssets
      });
    }
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
            <FakeIcon size={37} containerStyle={styles.accountRow__leftIcon} />
            <View
              style={[
                styles.accountRow__contentContainer,
                idx === lastIdx && styles.accountRow__contentContainer_last
              ]}
            >
              <BaseText style={styles.accountRow__mainText}>{account.name}</BaseText>
              <BaseText style={styles.accountRow__amount}>{account.amount}</BaseText>
              <FakeIcon size={7} containerStyle={styles.accountRow__rightIcon} />
            </View>
          </View>
        ))}
      </View>
    );
  }

  render() {
    const { netAssets, accountGroups } = this.state;
    return (
      <ScrollView style={styles.container}>
        <AccountsSummary netAssets={netAssets} />
        {accountGroups.map(this.renderAccountGroup, this)}
      </ScrollView>
    );
  }
}
