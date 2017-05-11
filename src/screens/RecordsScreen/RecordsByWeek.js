import React, { PropTypes } from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import BaseText from '../../components/BaseText';
import PeriodSummary from './PeriodSummary';
import RecordsRefreshWrapper from './RecordsRefreshWrapper';
import RecordItem from './RecordItem';
import connectDB from '../../lib/connectDB';
import CustomPropTypes from '../../lib/CustomPropTypes';
import recordsScreenUtils, { recordsStyles, RecordsPropTypes } from './recordsScreenUtils';
import { getWeekPeriod } from '../../utils/period';
import { Colors } from '../../variables';

const styles = StyleSheet.create({
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

  render() {
    const { detailRecords } = this.props;
    const content = detailRecords && detailRecords.length === 0 ? (
      <View style={styles.emptyTip}>
        {this._getHeaderComponent()()}
        <View style={styles.emptyTip__labelContainer}>
          <MaterialCommunityIcons size={100} name="newspaper" color={Colors.Text_Hint} />
          <BaseText style={styles.emptyTip__label}>暂无记录</BaseText>
        </View>
      </View>
    ) : (
      <FlatList
        style={recordsStyles.container}
        ListHeaderComponent={this._getHeaderComponent()}
        data={detailRecords || []}
        renderItem={this._renderItem}
        keyExtractor={this._keyExtractor}
      />
    );

    return (
      <RecordsRefreshWrapper onBottomRefresh={this.onBottomRefresh}>
        {content}
      </RecordsRefreshWrapper>
    );
  }
}
