import React from 'react';
import DatePicker from 'antd-mobile/lib/date-picker';

import LabeledItem from './LabeledItem';

export default class DateSelector extends React.PureComponent {
  render() {
    return (
      <DatePicker triggerType="onPress" mode="date">
        <LabeledItem tip="时间" text="今天 4月30日" />
      </DatePicker>
    );
  }
}
