import React, { PropTypes } from 'react';
import { View, TouchableWithoutFeedback, Image, Text, StyleSheet } from 'react-native';
import Tabbar from 'react-native-tabbar';

const styles = StyleSheet.create({
  tabbarContainer: {
    flexDirection: 'row'
  },

  tabbarItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

class TabbarItem extends React.PureComponent {
  static propTypes = {
    icon: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    onPress: PropTypes.func.isRequired
  }
  render() {
    const { icon, label, onPress } = this.props;
    return (
      <TouchableWithoutFeedback onPress={onPress} style={styles.tabbarItem}>
        <View>
          <Image source={icon} />
          <Text>{label}</Text>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

export default class HomeTabbar extends React.PureComponent {
  render() {
    return (
      <Tabbar>
        <View style={styles.tabbarContainer}>
          <TabbarItem label="账户 as" />
        </View>
      </Tabbar>
    );
  }
}
