import React, { PropTypes } from 'react';
import { View } from 'react-native';

import EnumRecordType from '../../enums/EnumRecordType';
import PublishIncomeRecord from './PublishIncomeRecord';
import PublishExpenditureRecord from './PublishExpenditureRecord';
import PublishTransferRecord from './PublishTransferRecord';
import CustomPropTypes from '../../lib/CustomPropTypes';

export default class EditRecordScreen extends React.PureComponent {
  static propTypes = {
    navigation: CustomPropTypes.navigationWithParams(PropTypes.shape({
      record: PropTypes.object.isRequired
    }))
  }

  static navigationOptions = ({ navigation }) => {
    const editingRecord = (navigation.state.params || {}).record;
    let title = '无效记录';
    if (editingRecord && editingRecord.type != null && editingRecord._id) {
      const type = editingRecord.type;
      if (type === EnumRecordType.Expenditure) {
        title = '编辑支出';
      } else if (type === EnumRecordType.Income) {
        title = '编辑收入';
      } else if (type === EnumRecordType.Transfer) {
        title = '编辑转账';
      }
    }
    return {
      title
    };
  }

  render() {
    const { navigation } = this.props;
    const editingRecord = (navigation.state.params || {}).record;
    const type = editingRecord && editingRecord.type;
    const EditorComponent = (() => {
      switch (type) {
        case EnumRecordType.Income: return PublishIncomeRecord;
        case EnumRecordType.Expenditure: return PublishExpenditureRecord;
        case EnumRecordType.Transfer: return PublishTransferRecord;
        default: return null;
      }
    })();

    if (EditorComponent) {
      return <EditorComponent editingRecord={editingRecord} />;
    }
    return <View />;
  }
}
