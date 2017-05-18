import './setupApp';

/* eslint import/first:off */
import React from 'react';
import { StackNavigator } from 'react-navigation';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import TestScreen from './screens/TestScreen';
import HomeScreen from './screens/HomeScreen';
import AccountsScreen from './screens/AccountsScreen';
import RecordsScreen from './screens/RecordsScreen';
import PublishRecordScreen from './screens/PublishRecordScreen';
import EditRecordScreen from './screens/PublishRecordScreen/EditRecordScreen';
import ChartScreen from './screens/ChartScreen';
import { provideRootNavigationContext } from './lib/exposeRootNavigation';
import { argumentNavigatorRouter } from './lib/navigationExt';
import onError from './lib/onError';
import { Colors } from './variables';
import { initializeDBs } from './databases';
import './scripts';
import './dev';

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.Orange,
    shadowOffset: null
  },
  headerLeft: {
    paddingLeft: 10
  }
});

const App = argumentNavigatorRouter(StackNavigator(
  {
    Home: {
      screen: provideRootNavigationContext(HomeScreen),
    },

    Records: {
      screen: provideRootNavigationContext(RecordsScreen)
    },

    Accounts: {
      screen: provideRootNavigationContext(AccountsScreen)
    },

    PublishRecord: {
      screen: provideRootNavigationContext(PublishRecordScreen)
    },

    EditRecord: {
      screen: provideRootNavigationContext(EditRecordScreen)
    },

    Chart: {
      screen: ChartScreen
    },

    __Test__: {
      screen: TestScreen
    }
  },

  {
    headerMode: 'screen',
    initialRouteName: 'Home',
    initialRouteParams: {
      startTime: 1488297600000,
      endTime: 1490975999999
    },
    navigationOptions: ({ navigation }) => ({
      headerStyle: styles.header,
      headerLeft: (
        <TouchableOpacity style={styles.headerLeft} onPress={() => navigation.goBack()} >
          <MaterialIcons
            name="arrow-back" color="#725715" size={28}
          />
        </TouchableOpacity>
      )
    })
  }
));

App.displayName = `App-${App.name || App.displayName}`;

export default class AppWrapper extends React.PureComponent {
  state = { dbsReady: false }
  componentWillMount() {
    initializeDBs()
      .then(() => this.setState({ dbsReady: true }))
      .catch(onError('initializeDBs'));
  }
  render() {
    if (!this.state.dbsReady) {
      return <View />;
    }
    return <App {...this.props} />;
  }
}
