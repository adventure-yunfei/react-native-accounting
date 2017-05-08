import React, { PropTypes } from 'react';
import Picker from 'antd-mobile/lib/picker';

import LabeledItem from './LabeledItem';
import flatToTree from '../../../utils/flatToTree';
import utils from '../../../utils';
import { componentWillApplyProps } from '../../../lib/lifecycle';

export const PropKeyCatId = 'categoryId';

@componentWillApplyProps
export default class CategorySelector extends React.PureComponent {
  static propTypes = {
    onPropChange: PropTypes.func.isRequired,
    categories: PropTypes.array.isRequired,
    data: PropTypes.object.isRequired
  }

  componentWillApplyProps(prevProps = {}, nextProps) {
    const { data, categories, onPropChange } = nextProps;
    if (categories !== prevProps.categories) {
      this.prepareCategoriesData(categories);
      const currCatId = data[PropKeyCatId];
      if (!currCatId) {
        const firstValidAccount = categories.find(cat => cat.parentId);
        if (firstValidAccount) {
          onPropChange(PropKeyCatId, firstValidAccount._id);
        }
      }
    }
  }

  onPickerChange = ([, subCatId]) => {
    this.props.onPropChange(PropKeyCatId, subCatId);
  }

  prepareCategoriesData(categories) {
    const genItem = item => ({
      value: item._id,
      label: item.name
    });
    this.setState({
      categoriesTree: flatToTree(categories, genItem)
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
