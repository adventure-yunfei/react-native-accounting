import React, { PropTypes } from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import BaseText from '../../components/BaseText';
import PeriodSummary, { SummaryHeight } from './PeriodSummary';
import BottomRefreshableScrollView from './BottomRefreshableScrollView';
import RecordItem from './RecordItem';
import { connectDB } from '../../lib/pouchdb-connector';
import CustomPropTypes from '../../lib/CustomPropTypes';
import recordsScreenUtils, { recordsStyles, RecordsPropTypes } from './recordsScreenUtils';
import { getWeekPeriod } from '../../utils/period';
import { Colors } from '../../variables';

import imgHeaderBG from '../../images/header-bg.png';

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  bgHeader: {
    // backgroundColor: ''
  },

  emptyTip: {
    flex: 1,
    backgroundColor: '#FFF'
  },
  emptyTip__labelContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyTip__label: {
    color: Colors.Text_Hint,
    paddingBottom: 100
  }
});

@connectDB(recordsScreenUtils.mapToPeriodRecordsProps)
export default class RecordsByWeek extends React.PureComponent {
  static propTypes = {
    startTime: PropTypes.number.isRequired,
    endTime: PropTypes.number.isRequired,
    detailRecords: PropTypes.array,
    periodSummary: RecordsPropTypes.periodSummary,
    navigation: CustomPropTypes.navigation.isRequired
  }

  onTopRefresh = () => {
    const { navigation, endTime } = this.props;
    navigation.setParams(getWeekPeriod(endTime + 1));
  }

  onBottomRefresh = () => {
    const { navigation, startTime } = this.props;
    navigation.setParams(getWeekPeriod(startTime - 1));
  }

  _renderItem = ({ item }) => <RecordItem detailRecord={item} />
  _keyExtractor = item => item._id
  _getHeaderComponent = () => {
    const { periodSummary } = this.props;
    return () => <PeriodSummary {...periodSummary} />;
  }
  _renderScrollComponent = props => (
    <BottomRefreshableScrollView
      {...props}
      onTopRefresh={this.onTopRefresh}
      onBottomRefresh={this.onBottomRefresh}
    />
  )

  render() {
    const { detailRecords, periodSummary } = this.props;
    const renderScrollComponent = props => (
      <BottomRefreshableScrollView
        {...props}
        backgroundSource={imgHeaderBG}
        header={<PeriodSummary {...periodSummary} />}
        windowHeight={SummaryHeight}
        onTopRefresh={this.onTopRefresh}
        onBottomRefresh={this.onBottomRefresh}
      />
    );

    if (detailRecords && detailRecords.length === 0) {
      return renderScrollComponent({
        children: (
          <View style={styles.emptyTip}>
            <View style={styles.emptyTip__labelContainer}>
              <MaterialCommunityIcons size={100} name="newspaper" color={Colors.Text_Hint} />
              <BaseText style={styles.emptyTip__label}>暂无记录</BaseText>
            </View>
          </View>
        )
      });
    }

    return (
      <View style={styles.container}>
        <View />
        <FlatList
          renderScrollComponent={renderScrollComponent}
          style={recordsStyles.container}
          data={detailRecords || []}
          renderItem={this._renderItem}
          keyExtractor={this._keyExtractor}
        />
      </View>
    );
  }
}
