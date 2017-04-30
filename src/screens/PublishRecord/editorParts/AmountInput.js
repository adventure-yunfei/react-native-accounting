import React, { PropTypes } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

import { editorStyles } from './editorCommon';

const styles = StyleSheet.create({
  component: {
    height: 70,
    fontSize: 32
  }
});

export default class AmountInput extends React.PureComponent {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    value: PropTypes.number,
    textStyle: PropTypes.any
  }

  static defaultProps = {
    value: 0
  }

  onChangeText = (text) => {
    this.props.onChange(text);
  }

  render() {
    const { textStyle, value } = this.props;
    return (
      <View style={editorStyles.row}>
        <TextInput
          onChangeText={this.onChangeText} style={[styles.component, textStyle]}
          defaultValue={value.toFixed(2)} />
      </View>
    );
  }
}
