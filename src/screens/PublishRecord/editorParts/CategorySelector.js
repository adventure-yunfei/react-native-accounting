import React from 'react';

import LabeledItem from './LabeledItem';

export default class CategorySelector extends React.PureComponent {
  render() {
    return <LabeledItem tip="分类" text="食品酒水 &gt; 吃饭买菜" />;
  }
}
