import React from 'react';
import { Text, StyleSheet } from 'react-native';

import { FontSizes, Colors } from '../variables';

const styles = StyleSheet.create({
  baseText: {
    fontSize: FontSizes.Base,
    color: Colors.Default
  }
});

export default class BaseText extends React.PureComponent {
  static propTypes = Text.propTypes

  render() {
    const { style } = this.props;
    return <Text {...this.props} style={style ? [styles.baseText, style] : styles.baseText} />;
  }
}
