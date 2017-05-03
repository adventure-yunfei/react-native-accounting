import React, { PropTypes } from 'react';
import Picker from 'antd-mobile/lib/picker';

import LabeledItem from './LabeledItem';
import flatToTree from '../../../utils/flatToTree';
import utils from '../../../utils';

export const PropKeyCatId = 'categoryId';

export default class CategorySelector extends React.PureComponent {
  static propTypes = {
    onPropChange: PropTypes.func.isRequired,
    categories: PropTypes.array.isRequired,
    data: PropTypes.object.isRequired
  }

  componentWillMount() {
    this.prepareCategoriesData(this.props.categories);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.categories !== this.props.categories) {
      this.prepareCategoriesData(nextProps.categories);
    }
  }

  onPickerChange = ([, subCatId]) => {
    this.props.onPropChange(PropKeyCatId, subCatId);
  }

  prepareCategoriesData(accounts) {
    const genItem = item => ({
      value: item._id,
      label: item.name
    });
    this.setState({
      categoriesTree: flatToTree(accounts, genItem)
    });
  }

  render() {
    const { categories, data } = this.props;
    let text = null;
    let pickerValue = null;
    if (data[PropKeyCatId]) {
      const cat = utils.findBy(categories, '_id', data[PropKeyCatId]);
      const parentCat = cat && utils.findBy(categories, '_id', cat.parentId);
      if (parentCat) {
        text = `${parentCat.name} > ${cat.name}`;
        pickerValue = [parentCat._id, cat._id];
      }
    }

    return (
      <Picker triggerType="onPress" data={this.state.categoriesTree} value={pickerValue} onPickerChange={this.onPickerChange}>
        <LabeledItem tip="分类" text={text} />
      </Picker>
    );
  }
}
