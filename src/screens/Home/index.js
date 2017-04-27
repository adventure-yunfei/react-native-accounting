import React from 'react';
import { View, ScrollView } from 'react-native';

import SummaryHeader from './SummaryHeader';
import WriteOneButton from './WriteOneButton';
import HomeTabbar from './HomeTabbar';

export default class Home extends React.PureComponent {
  static navigationOptions = {
    title: '',
  };

  render() {
    return (
      <View>
        <ScrollView>
          <SummaryHeader />
          <WriteOneButton />
        </ScrollView>
        <HomeTabbar />
      </View>
    );
  }
}
