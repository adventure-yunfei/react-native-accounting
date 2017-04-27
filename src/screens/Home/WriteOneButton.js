import React from 'react';
import { Button } from 'react-native';

export default class WriteOneButton extends React.PureComponent {
  onPress = () => {
  }

  render() {
    return <Button title="记一笔" onPress={this.onPress} />;
  }
}
