import React, { PropTypes } from 'react';
import DatePicker from 'antd-mobile/lib/date-picker';
import moment from 'moment';

import LabeledItem from './LabeledItem';

export const PropKeyTimestamp = 'timestamp';

export default class DateSelector extends React.PureComponent {
  static propTypes = {
    onPropChange: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired
  }

  onChange = (date) => {
    this.props.onPropChange(PropKeyTimestamp, date.toDate().getTime());
  }

  render() {
    const { data } = this.props;
    const timestamp = data[PropKeyTimestamp];
    const mDate = moment(timestamp);
    const text = mDate.format('M月D日');

    return (
      <DatePicker triggerType="onPress" mode="date" value={mDate} onChange={this.onChange}>
        <LabeledItem tip="时间" text={text} />
      </DatePicker>
    );
  }
}
