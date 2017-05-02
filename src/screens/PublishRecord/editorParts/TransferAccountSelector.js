import React, { PropTypes } from 'react';
import { View, TouchableHighlight, StyleSheet } from 'react-native';
import Picker from 'antd-mobile/lib/picker';

import LabeledItem from './LabeledItem';
import utils from '../../../utils';
import { editorStyles } from './editorCommon';

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
      availableAccounts: accounts.reduce((result, account) => {
        if (account.parentId) {
          result.push({
            value: account._id,
            label: account.name
          });
        }
        return result;
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
