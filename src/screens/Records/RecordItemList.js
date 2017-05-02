import React, { PropTypes } from 'react';
import { View } from 'react-native';

import RecordItem from './RecordItem';
import utils from '../../utils';

export default class RecordItemList extends React.PureComponent {
  static propTypes = {
    records: PropTypes.array.isRequired,
    categories: PropTypes.array.isRequired
  }

  render() {
    const { records, categories } = this.props;
    const getCatName = catId => utils.findBy(categories, '_id', catId).name;
    return (
      <View>
        {records.map(record => (
          <RecordItem key={record._id} record={record} catName={getCatName(record.categoryId)} />
        ))}
      </View>
    );
  }
}
