import React, { PropTypes } from 'react';
import { TouchableHighlight, Text, StyleSheet } from 'react-native';

import FakeLinearGradient from '../../components/FakeLinearGradient';
import exposeRootNavigation from '../../lib/exposeRootNavigation';

const styles = StyleSheet.create({
  container: {
    marginLeft: 16,
    marginRight: 16,
    marginTop: 14,
    marginBottom: 14,
    borderRadius: 5
  },

  gradient: {
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
    rootNavigation: PropTypes.object.isRequired
  }

  onPress = () => {
    this.props.rootNavigation.$navigateByPath('PublishRecord/Income');
  }

  render() {
    return (
      <TouchableHighlight onPress={this.onPress} style={styles.container}>
        <FakeLinearGradient style={styles.gradient} colors={['#fca62c', '#fd8b1d']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <Text style={styles.label}>记一笔</Text>
        </FakeLinearGradient>
      </TouchableHighlight>
    );
  }
}
