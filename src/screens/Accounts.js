import React from 'react';
import { View, Text } from 'react-native';

export default class Accounts extends React.PureComponent {
  static navigationOptions = {
    title: '账户',
  }

  render() {
    return (
      <View>
        <Text>账户</Text>
      </View>
    );
  }
}
