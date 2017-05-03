import React, { PropTypes } from 'react';
import { TouchableHighlight, Text, StyleSheet } from 'react-native';

import { baseTextStyle } from './BaseText';
import CustomPropTypes from '../lib/CustomPropTypes';

const styles = StyleSheet.create({
  container: {
    height: 41,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center'
  },
  container_primary: {
    backgroundColor: '#F58A24'
  },
  container_gray: {
    backgroundColor: '#AAAAAA'
  },

  label: {
    fontSize: 15,
    fontWeight: 'bold'
  },
  label_primary: {
    color: '#fff'
  },
  label_gray: {
    color: '#fff'
  }
});

export default class Button extends React.PureComponent {
  static propTypes = {
    onPress: PropTypes.func,
    containerStyle: CustomPropTypes.style,
    type: PropTypes.string,
    children: PropTypes.node
  }

  render() {
    const { onPress, containerStyle, type, children } = this.props;
    return (
      <TouchableHighlight onPress={onPress} style={[styles.container, styles[`container_${type}`], containerStyle]}>
        {typeof children === 'string' ? <Text style={[baseTextStyle, styles.label, styles[`label_${type}`]]}>{children}</Text> : children}
      </TouchableHighlight>
    );
  }
}
