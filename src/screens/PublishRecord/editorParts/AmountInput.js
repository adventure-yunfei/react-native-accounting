import React, { PropTypes } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import isDecimal from 'validator/lib/isDecimal';

import { editorStyles } from './editorCommon';
import CustomPropTypes from '../../../lib/CustomPropTypes';

export const PropKeyAmount = 'amount';

const styles = StyleSheet.create({
  component: {
    height: 70,
    fontSize: 32
  }
});

export default class AmountInput extends React.PureComponent {
  static propTypes = {
    onPropChange: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
    textStyle: CustomPropTypes.style
  }

  static defaultProps = {
    value: 0
  }

  componentWillMount() {
    this.setState({
      inputValue: this.props.data[PropKeyAmount].toFixed(2)
    });
  }

  onChangeText = text => this.setState({ inputValue: text });

  onBlur = () => {
    const { inputValue } = this.state;
    if (isDecimal(inputValue)) {
      this.props.onPropChange(PropKeyAmount, parseFloat(inputValue));
    } else {
      this.setState({ inputValue: this.props.data[PropKeyAmount].toFixed(2) });
    }
  }

  render() {
    const { textStyle } = this.props;
    const { inputValue } = this.state;
    return (
      <View style={editorStyles.row}>
        <TextInput
          onChangeText={this.onChangeText} style={[styles.component, textStyle]}
          value={inputValue} onBlur={this.onBlur}
        />
      </View>
    );
  }
}
