import React, { PropTypes } from 'react';
import { View, StyleSheet } from 'react-native';

import Button from '../../../components/Button';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginLeft: 16,
    marginRight: 16
  },

  saveBtn: {
    flex: 2,
    marginRight: 4
  },

  secondaryBtn: {
    flex: 1
  }
});

export default class EditorButtonBar extends React.PureComponent {
  static propTypes = {
    containerStyle: PropTypes.any,
    onSavePress: PropTypes.func.isRequired,
    onPublishAgainPress: PropTypes.func.isRequired
  }

  render() {
    const { containerStyle, onSavePress, onPublishAgainPress } = this.props;

    return (
      <View style={[styles.container, containerStyle]}>
        <Button containerStyle={styles.saveBtn} type="primary" onPress={onSavePress}>保存</Button>
        <Button containerStyle={styles.secondaryBtn} type="gray" onPress={onPublishAgainPress}>再记一笔</Button>
      </View>
    );
  }
}
