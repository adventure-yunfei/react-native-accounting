import React, { PropTypes } from 'react';
import { TabNavigator, TabBarTop } from 'react-navigation';
import PublishExpenditureRecord from './PublishExpenditureRecord';
import PublishIncomeRecord from './PublishIncomeRecord';
import PublishTransferRecord from './PublishTransferRecord';
import { Colors } from '../../variables';

const PublishTitle = '记一笔';

const PublishRecordNavigator = TabNavigator(
  {
    Expenditure: {
      screen: PublishExpenditureRecord,
      navigationOptions: {
        title: PublishTitle,
        tabBarLabel: '支出'
      }
    },

    Income: {
      screen: PublishIncomeRecord,
      navigationOptions: {
        title: PublishTitle,
        tabBarLabel: '收入'
      }
    },

    Transfer: {
      screen: PublishTransferRecord,
      navigationOptions: {
        title: PublishTitle,
        tabBarLabel: '转账'
      }
    }
  },

  {
    tabBarComponent: TabBarTop,
    tabBarPosition: 'top',
    swipeEnabled: true,
    animationEnabled: true,
    tabBarOptions: {
      style: {
        backgroundColor: '#FDD352'
      },
      labelStyle: {
        fontSize: 13,
        color: Colors.Text_Gray
      },
      indicatorStyle: {
        backgroundColor: '#604912'
      }
    }
  }
);

export default class PublishRecord extends React.PureComponent {
  static propTypes = {
    navigation: PropTypes.object.isRequired
  }

  render() {
    return <PublishRecordNavigator screenProps={{ rootNavigation: this.props.navigation }} />;
  }
}
