import React, { PropTypes } from 'react';
import { View } from 'react-native';

export default class FakeLinearGradient extends React.PureComponent {
  static propTypes = {
    style: PropTypes.any,
    colors: PropTypes.array.isRequired,
    start: PropTypes.object,
    end: PropTypes.object
  }

  setNativeProps(props) {
    this._view.setNativeProps(props);
  }

  render() {
    const { style, colors } = this.props;
    return <View ref={comp => this._view = comp} {...this.props} style={[{ backgroundColor: colors[0] }, style]} />;
  }
}
