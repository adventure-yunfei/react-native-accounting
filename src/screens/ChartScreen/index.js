import React, { PropTypes } from 'react';
import { TabNavigator, TabBarTop } from 'react-navigation';
import map from 'lodash/map';
import sortBy from 'lodash/sortBy';

import connectDB from '../../lib/connectDB';
import ChartView from './ChartView';
import { getMonthPeriod } from '../../utils/period';
import utils from '../../utils';
import { Colors } from '../../variables';

@connectDB((dbs) => {
  const { startTime, endTime } = getMonthPeriod();
  return Promise.all([
    dbs.records.allDocsData({
      descending: true,
      startkey: endTime.toString(),
      endkey: startTime.toString()
    }),
    dbs.categories.allDocsData()
  ]).then(([records, categories]) => {
    const catMap = utils.arrayToMap(categories, '_id');
    const catAmountMap = {};
    records.forEach(({ categoryId, amount }) => {
      if (catMap[categoryId] && amount) {
        catAmountMap[categoryId] = (catAmountMap[categoryId] || 0) + amount;
      }
    });
    const chartData = map(catAmountMap, (amount, categoryId) => {
      return {
        value: amount,
        label: catMap[categoryId].name
      };
    })
      .sort((a, b) => b.value - a.value);
    return { chartData };
  });
})
class ExpenditureByCategoriesChart extends React.PureComponent {
  static propTypes = {
    chartData: PropTypes.array
  }
  render() {
    return <ChartView chartData={this.props.chartData || []} />;
  }
}

@connectDB((dbs) => {
  const { startTime, endTime } = getMonthPeriod();
  return Promise.all([
    dbs.records.allDocsData({
      descending: true,
      startkey: endTime.toString(),
      endkey: startTime.toString()
    }),
    dbs.categories.allDocsData()
  ]).then(([records, categories]) => {
    const catMap = utils.arrayToMap(categories, '_id');
    const catAmountMap = {};
    records.forEach(({ categoryId, amount }) => {
      if (catMap[categoryId] && amount) {
        catAmountMap[categoryId] = (catAmountMap[categoryId] || 0) + amount;
      }
    });
    const chartData = map(catAmountMap, (amount, categoryId) => {
      return {
        value: amount,
        label: catMap[categoryId].name
      };
    })
      .sort((a, b) => b.value - a.value);
    return { chartData };
  });
})
class IncomeByCategoriesChart extends React.PureComponent {
  static propTypes = {
    chartData: PropTypes.array
  }
  render() {
    return <ChartView chartData={this.props.chartData || []} />;
  }
}

@connectDB(dbs => Promise.all([
  dbs.records.query('amountGroupByAccounts', { group: true }),
  dbs.accounts.allDocsData()
]).then(([accountAmountsRes, accounts]) => {
  const accountNameMap = utils.arrayToMap(accounts, '_id', 'name');
  const chartData = sortBy(
    accountAmountsRes.rows.filter(({ value }) => value),
    'value'
  ).map(({ key, value }) => ({
    value,
    label: accountNameMap[key]
  }));
  return { chartData };
}))
class AccountAssetsChart extends React.PureComponent {
  static propTypes = {
    chartData: PropTypes.array
  }
  render() {
    return <ChartView chartData={this.props.chartData || []} />;
  }
}

export default TabNavigator(
  {
    ExpenditureByCategories: {
      screen: ExpenditureByCategoriesChart,
      navigationOptions: {
        tabBarLabel: '分类支出'
      }
    },

    IncomeByCategories: {
      screen: IncomeByCategoriesChart,
      navigationOptions: {
        tabBarLabel: '分类收入'
      }
    },

    AccountAssets: {
      screen: AccountAssetsChart,
      navigationOptions: {
        tabBarLabel: '资产'
      }
    }
  },

  {
    lazy: true,
    backBehavior: 'none',
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
