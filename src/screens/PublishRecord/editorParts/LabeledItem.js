import React, { PropTypes } from 'react';
import { View, StyleSheet } from 'react-native';

import BaseText from '../../../components/BaseText';
import { editorStyles } from './editorCommon';
import { Colors } from '../../../variables';

const styles = StyleSheet.create({
  container: {
    height: 60,
    justifyContent: 'center'
  },

  labelTip: {
    fontSize: 12,
    paddingBottom: 4,
    color: Colors.Text_Hint
  },

  text: {
    fontSize: 16
  }
});

export default class LabeledItem extends React.PureComponent {
  static propTypes = {
    tip: PropTypes.string.isRequired,
    text: PropTypes.node
  }

  render() {
    const { tip, text } = this.props;

    return (
      <View style={[editorStyles.row, styles.container]} onPress={this.onPress} >
        <BaseText style={styles.labelTip}>{tip}</BaseText>
        <BaseText style={styles.text}>{text}</BaseText>
      </View>
    );
  }
}
