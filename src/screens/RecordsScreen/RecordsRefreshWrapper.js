import React, { PropTypes } from 'react';
import { TouchableWithoutFeedback, ScrollView, View, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import BaseText from '../../components/BaseText';
import { Colors } from '../../variables';

const BottomRefreshHeight = 25;

const pullUpRefreshStyles = StyleSheet.create({
  srollContainer: {
    backgroundColor: Colors.BG_Default
  },
  scrollContent: {
    height: '100%'
  },
  bottomRefresh: {
    position: 'absolute',
    top: '100%',
    left: 0,
    width: '100%',
    height: BottomRefreshHeight,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.BG_Default
  },
  bottomRefresh__label: {
    paddingLeft: 16,
    color: Colors.Text_Hint
  }
});

export default class PullUpToRefresh extends React.PureComponent {
  static propTypes = {
    children: PropTypes.node,
    onBottomRefresh: PropTypes.func,
  }

  state = { canFireBottomLoading: false }

  onScroll = (evt) => {
    const { canFireBottomLoading } = this.state;
    const threshold = BottomRefreshHeight * 1.8;
    const offsetY = evt.nativeEvent.contentOffset.y;
    if (canFireBottomLoading) {
      if (offsetY < threshold) {
        this.setState({ canFireBottomLoading: false });
      }
    } else {
      if (offsetY >= threshold) {
        this.setState({ canFireBottomLoading: true });
      }
    }
  }

  onPressOut = () => {
    if (this.state.canFireBottomLoading) {
      const { onBottomRefresh } = this.props;
      if (onBottomRefresh) {
        onBottomRefresh();
      }
    }
  }

  render() {
    const { canFireBottomLoading } = this.state;
    return (
      <TouchableWithoutFeedback onPressOut={this.onPressOut}>
        <ScrollView
          style={pullUpRefreshStyles.srollContainer}
          contentContainerStyle={pullUpRefreshStyles.scrollContent}
          onScroll={this.onScroll}
          scrollEventThrottle={16}
        >
          {this.props.children}
          <View style={pullUpRefreshStyles.bottomRefresh}>
            <MaterialIcons size={24} color={Colors.Text_Hint} name={canFireBottomLoading ? 'arrow-downward' : 'arrow-upward'} />
            <BaseText style={pullUpRefreshStyles.bottomRefresh__label}>{canFireBottomLoading ? '放开加载' : '上拉加载更多'}</BaseText>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    );
  }
}
