import React, { PropTypes } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';

import SummaryHeader from './SummaryHeader';
import WriteOneButton from './WriteOneButton';
import SummaryDetails from './SummaryDetails';
import HomeTabbar from './HomeTabbar';
import { Geometries } from '../../variables';

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
    navigation: PropTypes.object.isRequired
  }

  static navigationOptions = {
    header: null,
  }

  render() {
    return (
      <View style={styles.homeContainer}>
        <ScrollView>
          <SummaryHeader />
          <WriteOneButton />
          <SummaryDetails />
          <View style={styles.contentBottomPlaceholder} />
        </ScrollView>
        <HomeTabbar navigation={this.props.navigation} />
      </View>
    );
  }
}
