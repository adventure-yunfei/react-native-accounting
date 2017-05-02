import React, { PropTypes } from 'react';
import { TouchableHighlight, View, StyleSheet } from 'react-native';

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
    onPress: PropTypes.func,
    containerStyle: PropTypes.any,
    tip: PropTypes.string.isRequired,
    text: PropTypes.node,
    modal: PropTypes.node
  }

  render() {
    const { tip, text, onPress, modal, containerStyle } = this.props;
    const content = (
      <View style={[editorStyles.row, styles.container, containerStyle]}>
        <BaseText style={styles.labelTip}>{tip}</BaseText>
        <BaseText style={styles.text}>{text}</BaseText>
        {modal}
      </View>
    );

    return onPress ? <TouchableHighlight onPress={onPress}>{content}</TouchableHighlight> : content;
  }
}