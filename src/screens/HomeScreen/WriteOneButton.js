import React from 'react';
import { TouchableHighlight, Text, StyleSheet } from 'react-native';
/* eslint import/no-unresolved: off, import/extensions: off */
import LinearGradient from 'react-native-linear-gradient';

import exposeRootNavigation from '../../lib/exposeRootNavigation';
import CustomPropTypes from '../../lib/CustomPropTypes';

const styles = StyleSheet.create({
  container: {
    marginLeft: 16,
    marginRight: 16,
    marginTop: 14,
    marginBottom: 14,
    borderRadius: 5
  },

  gradient: {
    width: '100%',
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5
  },

  label: {
    fontSize: 21,
    color: '#fff',
    fontWeight: 'bold'
  }
});

@exposeRootNavigation
export default class WriteOneButton extends React.PureComponent {
  static propTypes = {
    rootNavigation: CustomPropTypes.navigation.isRequired
  }

  onPress = () => {
    this.props.rootNavigation.navigate('PublishRecord');
  }

  render() {
    return (
      <TouchableHighlight onPress={this.onPress} style={styles.container} underlayColor="transparent">
        <LinearGradient style={styles.gradient} colors={['#fca62c', '#fd8b1d']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
          <Text style={styles.label}>记一笔</Text>
        </LinearGradient>
      </TouchableHighlight>
    );
  }
}
