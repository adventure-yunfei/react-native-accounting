import React from 'react';

import LabeledItem from './LabeledItem';

export default class AccountSelector extends React.PureComponent {
  render() {
    return <LabeledItem tip="账户" text="现金-哥(CNY)" />;
  }
}
