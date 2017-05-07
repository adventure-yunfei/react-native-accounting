import React, { PropTypes } from 'react';
import Picker from 'antd-mobile/lib/picker';

import LabeledItem from './LabeledItem';
import flatToTree from '../../../utils/flatToTree';
import utils from '../../../utils';

export const PropKeyAccountId = 'accountId';

export default class AccountSelector extends React.PureComponent {
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
      const parentAccount = account && utils.findBy(accounts, '_id', account.parentId);
      if (parentAccount) {
        text = account.name;
        pickerValue = [parentAccount._id, account._id];
      }
    }

    return (
      <Picker triggerType="onPress" data={this.state.accountsTree} value={pickerValue} onPickerChange={this.onPickerChange}>
        <LabeledItem tip="账户" text={text} />
      </Picker>
    );
  }
}
