import React, { PropTypes } from 'react';
import { View, ScrollView, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import BaseText from '../../components/BaseText';
import { Colors } from '../../variables';

const BottomRefreshHeight = 40;

const styles = StyleSheet.create({
  srollContainer: {
    backgroundColor: Colors.BG_Default
  },
  scrollContent: {
    minHeight: '100%'
  },
  bottomRefresh: {
    position: 'absolute',
    top: '100%',
    left: 0,
    marginTop: -1,
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

export default class BottomRefreshableScrollView extends React.Component {
  static propTypes = {
    ...ScrollView.propTypes,
    onBottomRefresh: PropTypes.func
  }
  state = { canFireBottomLoading: false }

  onScroll = (evt) => {
    const { onScroll } = this.props;
    const { canFireBottomLoading } = this.state;
    const threshold = BottomRefreshHeight * 1.5;
    const { contentOffset, contentSize, layoutMeasurement } = evt.nativeEvent;
    const bottomOffset = contentSize.height - layoutMeasurement.height - contentOffset.y;
    if (canFireBottomLoading) {
      if (bottomOffset >= -threshold) {
        this.setState({ canFireBottomLoading: false });
      }
    } else {
      if (bottomOffset < -threshold) {
        this.setState({ canFireBottomLoading: true });
      }
    }

    if (onScroll) {
      onScroll(evt);
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
    const { style, contentContainerStyle, children, scrollEventThrottle = 16 } = this.props;
    const { canFireBottomLoading } = this.state;
    return (
      <TouchableWithoutFeedback onPressOut={this.onPressOut}>
        <ScrollView
          {...this.props}
          onScroll={this.onScroll}
          scrollEventThrottle={scrollEventThrottle}
          style={[style, styles.srollContainer]}
          contentContainerStyle={[contentContainerStyle, styles.scrollContent]}
        >
          {children}
          <View style={styles.bottomRefresh}>
            <MaterialIcons size={24} color={Colors.Text_Hint} name={canFireBottomLoading ? 'arrow-downward' : 'arrow-upward'} />
            <BaseText style={styles.bottomRefresh__label}>{canFireBottomLoading ? '放开加载' : '上拉加载更多'}</BaseText>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    );
  }
}
