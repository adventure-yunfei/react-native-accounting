import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';

import SummaryHeader from './SummaryHeader';
import WriteOneButton from './WriteOneButton';
import SummaryDetails from './SummaryDetails';
import HomeTabbar from './HomeTabbar';
import { Geometries } from '../../variables';
import CustomPropTypes from '../../lib/CustomPropTypes';

const styles = StyleSheet.create({
  homeContainer: {
    backgroundColor: '#fff'
  },

  contentBottomPlaceholder: {
    height: Geometries.Tabbar
  }
});

export default class Home extends React.PureComponent {
  static propTypes = {
    navigation: CustomPropTypes.navigation.isRequired
  }

  static navigationOptions = {
    header: null,
  }

  render() {
    const { navigation } = this.props;

    return (
      <View style={styles.homeContainer}>
        <ScrollView>
          <SummaryHeader />
          <WriteOneButton navigation={navigation} />
          <SummaryDetails navigation={navigation} />
          <View style={styles.contentBottomPlaceholder} />
        </ScrollView>
        <HomeTabbar navigation={navigation} />
      </View>
    );
  }
}
