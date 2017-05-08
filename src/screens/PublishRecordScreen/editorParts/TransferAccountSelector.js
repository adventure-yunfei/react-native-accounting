import React, { PropTypes } from 'react';
import { View, TouchableHighlight, StyleSheet } from 'react-native';
import Picker from 'antd-mobile/lib/picker';

import LabeledItem from './LabeledItem';
import utils from '../../../utils';
import { editorStyles } from './editorCommon';
import { componentWillApplyProps } from '../../../lib/lifecycle';
import EnumAccountType from '../../../enums/EnumAccountType';

export const PropKeyAccountId = 'accountId';
export const PropKeyToAccountId = 'toAccountId';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row'
  },

  labelItem: {
    flex: 1,
    marginLeft: 0,
    marginRight: 0,
    borderBottomWidth: 0
  }
});

@componentWillApplyProps
export default class TransferAccountSelector extends React.PureComponent {
  static propTypes = {
    onPropChange: PropTypes.func.isRequired,
    accounts: PropTypes.array.isRequired,
    data: PropTypes.object.isRequired
  }

  componentWillMount() {
    this.prepareAccountsData(this.props.accounts);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.accounts !== this.props.accounts) {
      this.prepareAccountsData(nextProps.accounts);
    }
  }

  componentWillApplyProps(prevProps = {}, nextProps) {
    const { accounts, data, onPropChange } = nextProps;
    if (accounts !== prevProps.accounts) {
      let currAccountId = data[PropKeyAccountId];
      const currToAccountId = data[PropKeyToAccountId];
      const changes = {};
      if (!currToAccountId) {
        const newAccount = utils.findBy(accounts, 'type', EnumAccountType.Real);
        if (newAccount) {
          currAccountId = changes[PropKeyAccountId] = newAccount._id;
        }
      }
      if (!currToAccountId) {
        const newToAccount = accounts.find(account =>
          account.type === EnumAccountType.Real && account._id !== currAccountId);
        const newToAccountId = newToAccount ? newToAccount._id : currAccountId;
        if (newToAccountId) {
          changes[PropKeyToAccountId] = newToAccountId;
        }
      }
      if (Object.keys(changes).length) {
        onPropChange(changes);
      }
    }
  }

  onPickerChange = ([fromAccountId, toAccountId]) => {
    this.props.onPropChange({
      [PropKeyAccountId]: fromAccountId,
      [PropKeyToAccountId]: toAccountId
    });
  }

  onChange = ([fromAccountId, toAccountId]) => {
    this.props.onPropChange({
      [PropKeyAccountId]: fromAccountId,
      [PropKeyToAccountId]: toAccountId
    });
  }

  prepareAccountsData(accounts) {
    this.setState({
      availableAccounts: accounts.reduce((acc, account) => {
        if (account.type === EnumAccountType.Real) {
          acc.push({
            value: account._id,
            label: account.name
          });
        }
        return acc;
      }, [])
    });
  }

  render() {
    const { data: {
      [PropKeyAccountId]: fromAccountId,
      [PropKeyToAccountId]: toAccountId
    } } = this.props;
    const { availableAccounts } = this.state;
    const fromAccount = fromAccountId && utils.findBy(availableAccounts, 'value', fromAccountId);
    const toAccount = toAccountId && utils.findBy(availableAccounts, 'value', toAccountId);

    return (
      <Picker
        triggerType="onPress" onPickerChange={this.onPickerChange} onChange={this.onChange} cascade={false}
        data={[availableAccounts, availableAccounts]}
        value={fromAccountId && toAccountId && [fromAccountId, toAccountId]}
      >
        <TouchableHighlight>
          <View style={[editorStyles.row, styles.container]}>
            <LabeledItem containerStyle={styles.labelItem} tip="转出" text={fromAccount && fromAccount.label} />
            <LabeledItem containerStyle={styles.labelItem} tip="转入" text={toAccount && toAccount.label} />
          </View>
        </TouchableHighlight>
      </Picker>
    );
  }
}
