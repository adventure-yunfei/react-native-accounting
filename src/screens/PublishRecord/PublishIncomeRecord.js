import React from 'react';
import { View, StyleSheet } from 'react-native';

import PublishRecordBase, { mapDBsToProps } from './PublishRecordBase';
import AmountInput from './editorParts/AmountInput';
import CategorySelector from './editorParts/CategorySelector';
import AccountSelector from './editorParts/AccountSelector';
import DateSelector from './editorParts/DateSelector';
import RemarkInput from './editorParts/RemarkInput';
import EditorButtonBar from './editorParts/EditorButtonBar';
import { editorStyles } from './editorParts/editorCommon';
import connectDB from '../../lib/connectDB';
import { Colors } from '../../variables';
import EnumRecordType from '../../enums/EnumRecordType';
import exposeRootNavigation from '../../lib/exposeRootNavigation';

const styles = StyleSheet.create({
  amountInput: {
    color: Colors.Income
  }
});

@connectDB(mapDBsToProps)
@exposeRootNavigation
export default class PublishIncomeRecord extends PublishRecordBase {
  getInitState() {
    const initState = super.getInitState();
    Object.assign(initState.data, {
      type: EnumRecordType.Income
    });
    return initState;
  }

  render() {
    const { accounts = [], categories = [] } = this.props;
    const cmProps = {
      onPropChange: this.onPropChange,
      data: this.state.data
    };
    return (
      <View style={editorStyles.container}>
        <AmountInput {...cmProps} textStyle={styles.amountInput} />
        <CategorySelector {...cmProps} categories={categories} />
        <AccountSelector {...cmProps} accounts={accounts} />
        <DateSelector {...cmProps} />
        <RemarkInput {...cmProps} />
        <EditorButtonBar
          containerStyle={editorStyles.buttonBar}
          onSavePress={this.onSave} onPublishAgainPress={this.onPublishAgain}
        />
      </View>
    );
  }
}
