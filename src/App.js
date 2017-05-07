import React from 'react';
import { StackNavigator } from 'react-navigation';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-elements/src/icons/Icon';

import './setupApp';
import HomeScreen from './screens/HomeScreen';
import AccountsScreen from './screens/AccountsScreen';
import RecordsScreen from './screens/RecordsScreen';
import PublishRecordScreen from './screens/PublishRecordScreen';
import ChartScreen from './screens/ChartScreen';
import { provideRootNavigationContext } from './lib/exposeRootNavigation';
import { Colors } from './variables';
import './scripts';

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.Orange,
    shadowOffset: null
  },
  headerLeft: {
    paddingLeft: 10
  }
});

const App = StackNavigator(
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

    Chart: {
      screen: ChartScreen
    }
  },

  {
    headerMode: 'screen',
    initialRouteName: 'Home',
    // initialRouteParams: {
    //   startTime: Date.now() - (7 * 24 * 60 * 60 * 1000),
    //   endTime: Date.now()
    // }
    navigationOptions: ({ navigation }) => ({
      headerStyle: styles.header,
      headerLeft: (
        <TouchableOpacity style={styles.headerLeft} onPress={() => navigation.goBack()} >
          <Icon
            name="arrow-back" color="#725715" size={28}
          />
        </TouchableOpacity>
      )
    })
  }
);

App.displayName = `App-${App.name || App.displayName}`;

export default App;
