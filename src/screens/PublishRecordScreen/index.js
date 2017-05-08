import { TabNavigator, TabBarTop } from 'react-navigation';

import PublishExpenditureRecord from './PublishExpenditureRecord';
import PublishIncomeRecord from './PublishIncomeRecord';
import PublishTransferRecord from './PublishTransferRecord';
import { Colors } from '../../variables';

export default TabNavigator(
  {
    Expenditure: {
      screen: PublishExpenditureRecord,
      navigationOptions: {
        tabBarLabel: '支出'
      }
    },

    Income: {
      screen: PublishIncomeRecord,
      navigationOptions: {
        tabBarLabel: '收入'
      }
    },

    Transfer: {
      screen: PublishTransferRecord,
      navigationOptions: {
        tabBarLabel: '转账'
      }
    }
  },

  {
    lazy: true,
    backBehavior: 'none',
    tabBarComponent: TabBarTop,
    tabBarPosition: 'top',
    navigationOptions: {
      title: '记一笔'
    },
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
