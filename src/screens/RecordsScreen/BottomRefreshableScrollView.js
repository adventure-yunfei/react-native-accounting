import React, { PropTypes } from 'react';
import { View, ScrollView, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import ParallaxView from 'react-native-parallax-view';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import BaseText from '../../components/BaseText';
import { Colors } from '../../variables';

const RefreshCtrlHeight = 40;

const styles = StyleSheet.create({
  srollContainer: {
    backgroundColor: Colors.BG_Default
  },
  scrollContent: {
    minHeight: '100%'
  },
  refreshCtrl: {
    width: '100%',
    height: RefreshCtrlHeight,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  refreshCtrl__label: {
    paddingLeft: 16,
    color: Colors.Text_Hint
  },
  bottomRefreshCtrl: {
    position: 'absolute',
    top: '100%',
    left: 0,
    marginTop: -1
  },
  topRefreshCtrl: {
    position: 'absolute',
    top: -(RefreshCtrlHeight - 1),
    left: 0
  },

  scrollableView: {
    shadowOpacity: 0
  }
});

export default class BottomRefreshableScrollView extends React.Component {
  static propTypes = {
    ...ParallaxView.propTypes,
    onTopRefresh: PropTypes.func,
    onBottomRefresh: PropTypes.func
  }
  state = {
    canFireTopLoading: false,
    canFireBottomLoading: false
  }

  onScroll = (evt) => {
    const { onScroll } = this.props;
    const { canFireTopLoading, canFireBottomLoading } = this.state;
    const threshold = RefreshCtrlHeight * 1.5;
    const { contentOffset, contentSize, layoutMeasurement } = evt.nativeEvent;
    const bottomOffset = contentSize.height - layoutMeasurement.height - contentOffset.y;
    if (canFireTopLoading) {
      if (contentOffset.y >= -threshold) {
        this.setState({ canFireTopLoading: false });
      }
    } else {
      if (contentOffset.y < -threshold) {
        this.setState({ canFireTopLoading: true });
      }
    }

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
    const { canFireTopLoading, canFireBottomLoading } = this.state;
    const { onTopRefresh, onBottomRefresh } = this.props;
    if (canFireTopLoading) {
      if (onTopRefresh) {
        onTopRefresh();
      }
    } else if (canFireBottomLoading) {
      if (onBottomRefresh) {
        onBottomRefresh();
      }
    }
  }

  render() {
    const { style, contentContainerStyle, children, scrollEventThrottle = 16,
      backgroundSource, header, scrollableViewStyle } = this.props;
    const { canFireTopLoading, canFireBottomLoading } = this.state;
    const topRefreshCtrl = (
      <View style={[styles.refreshCtrl, styles.topRefreshCtrl]}>
        <MaterialIcons size={24} color={Colors.Text_Hint} name={canFireTopLoading ? 'arrow-upward' : 'arrow-downward'} />
        <BaseText style={styles.refreshCtrl__label}>{canFireTopLoading ? '放开加载' : '下拉加载更多'}</BaseText>
      </View>
    );
    let hasTopCtrlShown = false;
    let ScrollComponent = ScrollView;
    let extraScrollProps = null;
    if (backgroundSource) {
      ScrollComponent = ParallaxView;
      extraScrollProps = {
        scrollableViewStyle: [styles.scrollableView, scrollableViewStyle],
        header: (
          <View>
            {topRefreshCtrl}
            {header}
          </View>
        )
      };
      hasTopCtrlShown = true;
    }
    return (
      <TouchableWithoutFeedback onPressOut={this.onPressOut}>
        <ScrollComponent
          {...this.props}
          {...extraScrollProps}
          onScroll={this.onScroll}
          scrollEventThrottle={scrollEventThrottle}
          style={[style, styles.srollContainer]}
          contentContainerStyle={[contentContainerStyle, styles.scrollContent]}
        >
          {children}
          {!hasTopCtrlShown && topRefreshCtrl}
          <View style={[styles.refreshCtrl, styles.bottomRefreshCtrl]}>
            <MaterialIcons size={24} color={Colors.Text_Hint} name={canFireBottomLoading ? 'arrow-downward' : 'arrow-upward'} />
            <BaseText style={styles.refreshCtrl__label}>{canFireBottomLoading ? '放开加载' : '上拉加载更多'}</BaseText>
          </View>
        </ScrollComponent>
      </TouchableWithoutFeedback>
    );
  }
}
