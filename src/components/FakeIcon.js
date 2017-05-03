import React, { PropTypes } from 'react';
import { View } from 'react-native';

import CustomPropTypes from '../lib/CustomPropTypes';

export default class FakeIcon extends React.PureComponent {
  static propTypes = {
    size: PropTypes.number,
    color: PropTypes.string,
    containerStyle: CustomPropTypes.style
  }

  static defaultProps = {
    size: 24,
    color: '#333'
  }

  render() {
    const { size, color, containerStyle } = this.props;
    const style = {
      width: size,
      height: size,
      backgroundColor: color,
      borderRadius: 5
    };
    return <View style={[style, containerStyle]} />;
  }
}
