import React from 'react';
import { View } from 'react-native';

import RecordItem from './RecordItem';

export default class RecordItemList extends React.PureComponent {
  render() {
    return (
      <View>
        <RecordItem />
        <RecordItem />
        <RecordItem />
      </View>
    );
  }
}
