import React, { PropTypes } from 'react';
import Picker from 'antd-mobile/lib/picker';

import LabeledItem from './LabeledItem';
import flatToTree from '../../../utils/flatToTree';
import utils from '../../../utils';
import { componentWillApplyProps } from '../../../lib/lifecycle';
import EnumAccountType from '../../../enums/EnumAccountType';

export const PropKeyAccountId = 'accountId';

function findAccountCat(accounts, realAccount) {
  let accountCat = realAccount && utils.findBy(accounts, '_id', realAccount.parentId);
  if (accountCat && accountCat.type === EnumAccountType.Group) {
    accountCat = utils.findBy(accounts, '_id', accountCat.parentId);
  }
  return accountCat;
}

@componentWillApplyProps
export default class AccountSelector extends React.PureComponent {
  static propTypes = {
    onPropChange: PropTypes.func.isRequired,
    accounts: PropTypes.array.isRequired,
    data: PropTypes.object.isRequired
  }

  componentWillApplyProps(prevProps = {}, nextProps) {
    const { data, accounts, onPropChange } = nextProps;
    if (accounts !== prevProps.accounts) {
      this.prepareAccountsData(accounts);
      const currAccountId = data[PropKeyAccountId];
      if (!currAccountId) {
        const firstValidAccount = utils.findBy(accounts, 'type', EnumAccountType.Real);
        if (firstValidAccount) {
          onPropChange(PropKeyAccountId, firstValidAccount._id);
        }
      }
    }
  }

  onPickerChange = ([, subAccountId]) => {
    this.props.onPropChange(PropKeyAccountId, subAccountId);
  }

  prepareAccountsData(accounts) {
    const genItem = item => ({
      value: item._id,
      label: item.name
    });
    this.setState({
      accountsTree: flatToTree(accounts, genItem)
    });
  }

  render() {
    const { accounts, data } = this.props;
    let text = null;
    let pickerValue = null;
    if (data[PropKeyAccountId]) {
      const account = utils.findBy(accounts, '_id', data[PropKeyAccountId]);
      const accountCat = findAccountCat(accounts, account);
      if (accountCat) {
        text = account.name;
        pickerValue = [accountCat._id, account._id];
      }
    }

    return (
      <Picker triggerType="onPress" data={this.state.accountsTree} value={pickerValue} onPickerChange={this.onPickerChange}>
        <LabeledItem tip="账户" text={text} />
      </Picker>
    );
  }
}
