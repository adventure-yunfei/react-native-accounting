import React from 'react';
import { View, StyleSheet } from 'react-native';

import PublishRecordBase, { mapDBsToProps } from './PublishRecordBase';
import AmountInput from './editorParts/AmountInput';
import TransferAccountSelector, { PropKeyToAccountId } from './editorParts/TransferAccountSelector';
import DateSelector from './editorParts/DateSelector';
import RemarkInput from './editorParts/RemarkInput';
import EditorButtonBar from './editorParts/EditorButtonBar';
import { editorStyles } from './editorParts/editorCommon';
import { connectDB } from '../../lib/pouchdb-connector';
import { Colors } from '../../variables';
import EnumRecordType from '../../enums/EnumRecordType';
import exposeRootNavigation from '../../lib/exposeRootNavigation';

const styles = StyleSheet.create({
  amountInput: {
    color: Colors.Transfer
  }
});

@connectDB(mapDBsToProps)
@exposeRootNavigation
export default class PublishTransferRecord extends PublishRecordBase {
  getInitState() {
    const initState = super.getInitState();
    if (!this.props.editingRecord) {
      Object.assign(initState.data, {
        type: EnumRecordType.Transfer,
        [PropKeyToAccountId]: null
      });
    }
    return initState;
  }

  render() {
    const { accounts = [] } = this.props;
    const cmProps = {
      onPropChange: this.onPropChange,
      data: this.state.data
    };
    return (
      <View style={editorStyles.container}>
        <AmountInput {...cmProps} textStyle={styles.amountInput} />
        <TransferAccountSelector {...cmProps} accounts={accounts} />
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
