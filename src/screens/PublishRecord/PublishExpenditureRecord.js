import React, { PropTypes } from 'react';
import { View, StyleSheet } from 'react-native';

import AmountInput, { PropKeyAmount } from './editorParts/AmountInput';
import CategorySelector, { PropKeyCatId } from './editorParts/CategorySelector';
import AccountSelector, { PropKeyAccountId } from './editorParts/AccountSelector';
import DateSelector, { PropKeyTimestamp } from './editorParts/DateSelector';
import RemarkInput, { PropKeyRemark } from './editorParts/RemarkInput';
import EditorButtonBar from './editorParts/EditorButtonBar';
import { editorStyles } from './editorParts/editorCommon';
import connectDB from '../../lib/connectDB';
import { getDayPeriod } from '../../utils/period';
import { Colors } from '../../variables';

const styles = StyleSheet.create({
  amountInput: {
    color: Colors.Expenditure
  }
});

@connectDB((dbs) => {
  return Promise.all([
    dbs.accounts.allDocsData(),
    dbs.categories.allDocsData()
  ])
    .then(([accounts, categories]) => {
      return {
        accounts: accounts,
        categories: categories
      };
    });
})
export default class PublishExpenditureRecord extends React.PureComponent {
  static propTypes = {
    screenProps: PropTypes.shape({
      rootNavigation: PropTypes.object.isRequired
    }).isRequired,
    databases: PropTypes.object,
    accounts: PropTypes.array,
    categories: PropTypes.array
  }

  state = {
    data: {
      [PropKeyAmount]: 0,
      [PropKeyAccountId]: null,
      [PropKeyCatId]: null,
      [PropKeyTimestamp]: Date.now(),
      [PropKeyRemark]: ''
    }
  }

  componentWillReceiveProps(nextProps) {
    let newData = null;
    if (nextProps.accounts !== this.props.accounts) {
      const defaultAccount = nextProps.accounts.find(account => account.parentId);
      if (defaultAccount) {
        newData = Object.assign(newData || {}, {
          [PropKeyAccountId]: defaultAccount._id
        });
      }
    }

    if (nextProps.categories !== this.props.categories) {
      const defaultCat = nextProps.categories.find(cat => cat.parentId);
      if (defaultCat) {
        newData = Object.assign(newData || {}, {
          [PropKeyCatId]: defaultCat._id
        });
      }
    }

    if (newData) {
      this.setState(state => ({
        data: {
          ...state.data,
          ...newData
        }
      }));
    }
  }

  onPropChange = (key, val) => {
    this.setState(state => ({
      data: {
        ...state.data,
        [key]: val
      }
    }));
  }

  onSave = () => {
    const { databases, screenProps: { rootNavigation } } = this.props;
    databases.records.post(this.state.data)
      .then(() => rootNavigation.navigate('Records', getDayPeriod()));
  }

  onPublishAgain = () => {

  }

  render() {
    const { accounts = [], categories = [] } = this.props;
    const cmProps = {
      onPropChange: this.onPropChange,
      data: this.state.data
    };
    return (
      <View style={editorStyles.container}>
        <AmountInput {...cmProps} onChange={() => 0} textStyle={styles.amountInput} />
        <CategorySelector {...cmProps} categories={categories} />
        <AccountSelector {...cmProps} accounts={accounts} />
        <DateSelector {...cmProps} />
        <RemarkInput {...cmProps} />
        <EditorButtonBar containerStyle={editorStyles.buttonBar}
          onSavePress={this.onSave} onPublishAgainPress={this.onPublishAgain} />
      </View>
    );
  }
}
