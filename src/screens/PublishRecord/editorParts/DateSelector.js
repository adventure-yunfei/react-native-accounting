import React from 'react';

import LabeledItem from './LabeledItem';

export default class DateSelector extends React.PureComponent {
  render() {
    return <LabeledItem tip="时间" text="今天 4月30日" />;
  }
}
