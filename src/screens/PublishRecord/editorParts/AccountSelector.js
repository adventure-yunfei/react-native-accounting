import React from 'react';
import Picker from 'antd-mobile/lib/picker';

import LabeledItem from './LabeledItem';

const accountsData = [
  {
    value: 1,
    label: '现金',
    children: [{
      value: 1,
      label: '现金-哥'
    }, {
      value: 2,
      label: '支付宝-哥'
    }]
  },
  {
    value: 2,
    label: '信用卡',
    children: [{
      value: 1,
      label: '花呗'
    }, {
      value: 2,
      label: '信用卡'
    }]
  }
];

export default class AccountSelector extends React.PureComponent {
  render() {
    return (
      <Picker triggerType="onPress" data={accountsData}>
        <LabeledItem tip="账户" text="现金-哥(CNY)" />
      </Picker>
    );
  }
}
