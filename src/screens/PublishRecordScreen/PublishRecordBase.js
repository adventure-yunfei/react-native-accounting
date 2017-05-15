import React, { PropTypes } from 'react';
import { View, StyleSheet } from 'react-native';

import AmountInput, { PropKeyAmount } from './editorParts/AmountInput';
import CategorySelector, { PropKeyCatId } from './editorParts/CategorySelector';
import AccountSelector, { PropKeyAccountId } from './editorParts/AccountSelector';
import DateSelector, { PropKeyTimestamp } from './editorParts/DateSelector';
import RemarkInput, { PropKeyRemark } from './editorParts/RemarkInput';
import EditorButtonBar from './editorParts/EditorButtonBar';
import { editorStyles } from './editorParts/editorCommon';
import { getDayPeriod } from '../../utils/period';
import { Colors } from '../../variables';
import EnumRecordType from '../../enums/EnumRecordType';
import CustomPropTypes from '../../lib/CustomPropTypes';
import { navigationExt } from '../../lib/navigationExt';
import onError from '../../lib/onError';

const styles = StyleSheet.create({
  amountInput: {
    color: Colors.Expenditure
  }
});

export function mapDBsToProps(dbs) {
  return Promise.all([
    dbs.accounts.allDocsData(),
    dbs.categories.allDocsData()
  ])
    .then(([accounts, categories]) => ({ accounts, categories }));
}

export default class PublishRecordBase extends React.PureComponent {
  static propTypes = {
    editingRecord: PropTypes.object,
    rootNavigation: CustomPropTypes.navigation.isRequired,
    databases: PropTypes.object,
    accounts: PropTypes.array,
    categories: PropTypes.array
  }

  componentWillMount() {
    this.setState(this.getInitState());
  }

  onPropChange = (key, val) => {
    const newData = {};
    if (typeof key === 'object') {
      const changedProps = key;
      Object.assign(newData, changedProps);
    } else {
      newData[key] = val;
    }
    this.setState(state => ({
      data: {
        ...state.data,
        ...newData
      }
    }));
  }

  onSave = () => {
    const { databases, rootNavigation } = this.props;
    const { data } = this.state;
    databases.records.validatingPut({
      _id: databases.records.generateID(data),
      ...data
    })
      .then(() => {
        navigationExt(rootNavigation).replace('Records', getDayPeriod());
      })
      .catch(onError);
  }

  onPublishAgain = () => {
    global.alert('TODO...');
  }

  getInitState() {
    return {
      data: this.props.editingRecord || {
        type: EnumRecordType.Expenditure,
        [PropKeyAmount]: 0,
        [PropKeyAccountId]: null,
        [PropKeyCatId]: null,
        [PropKeyTimestamp]: Date.now(),
        [PropKeyRemark]: ''
      }
    };
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
