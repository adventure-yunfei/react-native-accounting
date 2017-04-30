import React from 'react';
import { View, StyleSheet } from 'react-native';

import AmountInput from './editorParts/AmountInput';
import CategorySelector from './editorParts/CategorySelector';
import AccountSelector from './editorParts/AccountSelector';
import DateSelector from './editorParts/DateSelector';
import RemarkInput from './editorParts/RemarkInput';
import EditorButtonBar from './editorParts/EditorButtonBar';
import { editorStyles } from './editorParts/editorCommon';
import { Colors } from '../../variables';

const styles = StyleSheet.create({
  amountInput: {
    color: Colors.Expenditure
  }
});

export default class PublishExpenditureRecord extends React.PureComponent {
  render() {
    return (
      <View style={editorStyles.container}>
        <AmountInput onChange={() => 0} textStyle={styles.amountInput} />
        <CategorySelector />
        <AccountSelector />
        <DateSelector />
        <RemarkInput />
        <EditorButtonBar containerStyle={editorStyles.buttonBar} />
      </View>
    );
  }
}
