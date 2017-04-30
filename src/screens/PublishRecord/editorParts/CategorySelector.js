import React from 'react';
import Picker from 'antd-mobile/lib/picker';

import LabeledItem from './LabeledItem';

const categoriesData = [
  {
    value: 1,
    label: '食品酒水',
    children: [{
      value: 1,
      label: '吃饭买菜'
    }, {
      value: 2,
      label: '零食'
    }]
  },
  {
    value: 2,
    label: '休闲娱乐',
    children: [{
      value: 1,
      label: '充值'
    }, {
      value: 2,
      label: '出游'
    }]
  }
];

export default class CategorySelector extends React.PureComponent {
  state = {
    modalVisible: false
  }

  onItemPress = () => this.setState({ modalVisible: true })

  render() {
    return (
      <Picker triggerType="onPress" data={categoriesData}>
        <LabeledItem tip="分类" text="食品酒水 &gt; 吃饭买菜" />
      </Picker>
    );
  }
}
