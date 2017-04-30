import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

import { editorStyles } from './editorCommon';

const styles = StyleSheet.create({
  text: {
    height: 58
  }
});

export default class RemarkInput extends React.PureComponent {
  render() {
    return (
      <View style={[editorStyles.row, editorStyles.row_lastChild]}>
        <TextInput style={styles.text} placeholder="备注" />
      </View>
    );
  }
}
