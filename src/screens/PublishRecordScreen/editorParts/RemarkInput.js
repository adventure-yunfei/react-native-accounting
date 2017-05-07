import React, { PropTypes } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

import { editorStyles } from './editorCommon';

export const PropKeyRemark = 'remark';

const styles = StyleSheet.create({
  text: {
    height: 58
  }
});

export default class RemarkInput extends React.PureComponent {
  static propTypes = {
    onPropChange: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired
  }

  onChangeText = (text) => {
    this.props.onPropChange(PropKeyRemark, text);
  }

  render() {
    const { data } = this.props;
    return (
      <View style={[editorStyles.row, editorStyles.row_lastChild]}>
        <TextInput style={styles.text} placeholder="备注" value={data[PropKeyRemark]} onChangeText={this.onChangeText} />
      </View>
    );
  }
}
