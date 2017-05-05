import React, { PropTypes } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Tabbar from 'react-native-tabbar';
import Icon from 'react-native-elements/src/icons/Icon';

import BaseText from '../../components/BaseText';
import exposeRootNavigation from '../../lib/exposeRootNavigation';
import { Geometries } from '../../variables';
import CustomPropTypes from '../../lib/CustomPropTypes';

const styles = StyleSheet.create({
  tabbarContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(102,102,102,.9)',
    alignItems: 'center'
  },

  tabbarItem: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  tabbarItem__text: {
    paddingTop: 3,
    fontSize: 10,
    color: '#fff'
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
          <Icon name={iconName} color="#fff" size={24} />
          <BaseText style={styles.tabbarItem__text}>{label}</BaseText>
        </View>
      </TouchableOpacity>
    );
  }
}

@exposeRootNavigation
export default class HomeTabbar extends React.PureComponent {
  static propTypes = {
    rootNavigation: CustomPropTypes.rootNavigation.isRequired
  }

  toAccountsScreen = () => {
    this.props.rootNavigation.$navigateByPath('Accounts');
  }

  toChartScreen = () => {
    this.props.rootNavigation.$navigateByPath('Chart');
  }

  render() {
    return (
      <Tabbar height={Geometries.Tabbar}>
        <View style={styles.tabbarContainer}>
          <TabbarItem iconName="credit-card" label="账户" onPress={this.toAccountsScreen} />
          <TabbarItem iconName="pie-chart" label="图表" onPress={this.toChartScreen} />
        </View>
      </Tabbar>
    );
  }
}
