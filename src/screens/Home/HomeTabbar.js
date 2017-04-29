import React, { PropTypes } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Tabbar from 'react-native-tabbar';

import BaseText from '../../components/BaseText';
import FakeIcon from '../../components/FakeIcon';
import { Geometries } from '../../variables';

const styles = StyleSheet.create({
  tabbarContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(128,128,128,.9)'
  },

  tabbarItem: {
    alignItems: 'center',
    justifyContent: 'center'
  }
});

class TabbarItem extends React.PureComponent {
  static propTypes = {
    iconName: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    onPress: PropTypes.func
  }
  render() {
    const { iconName, label, onPress } = this.props;
    return (
      <TouchableOpacity onPress={onPress}>
        <View style={styles.tabbarItem}>
          <FakeIcon name={iconName} color="#fff" />
          <BaseText color="#fff">{label}</BaseText>
        </View>
      </TouchableOpacity>
    );
  }
}

export default class HomeTabbar extends React.PureComponent {
  static propTypes = {
    navigation: PropTypes.object.isRequired
  }

  toAccountsScreen = () => {
    this.props.navigation.navigate('Accounts');
  }

  render() {
    return (
      <Tabbar height={Geometries.Tabbar}>
        <View style={styles.tabbarContainer}>
          <TabbarItem iconName="credit-card" label="账户" onPress={this.toAccountsScreen} />
        </View>
      </Tabbar>
    );
  }
}
