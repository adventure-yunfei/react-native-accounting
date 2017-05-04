import { StackNavigator } from 'react-navigation';

import './setupApp';
import HomeScreen from './screens/HomeScreen';
import AccountsScreen from './screens/AccountsScreen';
import Records from './screens/Records';
import PublishRecord from './screens/PublishRecord';
import ChartScreen from './screens/ChartScreen';
import { provideRootNavigationContext } from './lib/exposeRootNavigation';
import './shell';

const App = StackNavigator(
  {
    Home: {
      screen: provideRootNavigationContext(HomeScreen),
    },

    Records: {
      screen: provideRootNavigationContext(Records)
    },

    Accounts: {
      screen: provideRootNavigationContext(AccountsScreen)
    },

    PublishRecord: {
      screen: provideRootNavigationContext(PublishRecord)
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
  }
);

App.displayName = `App-${App.name || App.displayName}`;

export default App;
