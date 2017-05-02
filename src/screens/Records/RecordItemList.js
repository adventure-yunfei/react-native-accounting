import React, { PropTypes } from 'react';
import { View } from 'react-native';

import RecordItem from './RecordItem';

export default class RecordItemList extends React.PureComponent {
  static propTypes = {
    detailRecords: PropTypes.array.isRequired,
  }

  render() {
    const { detailRecords } = this.props;
    return (
      <View>
        {detailRecords.map(detailRecord => (
          <RecordItem key={detailRecord._id} detailRecord={detailRecord} />
        ))}
      </View>
    );
  }
}
