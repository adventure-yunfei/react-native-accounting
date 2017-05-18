import React from 'react';
import { View } from 'react-native';

export default class TestScreen extends React.PureComponent {
  componentDidMount() {
    require('../../__unit-tests__');
  }

  render() {
    return <View />;
  }
}
