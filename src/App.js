import { StackNavigator } from 'react-navigation';

import './setupApp';
import Home from './screens/Home';
import AccountsScreen from './screens/AccountsScreen';
import Records from './screens/Records';
import PublishRecord from './screens/PublishRecord';
import { provideRootNavigationContext } from './lib/exposeRootNavigation';

const App = StackNavigator(
  {
    Home: {
      screen: provideRootNavigationContext(Home),
    },

    Records: {
      screen: provideRootNavigationContext(Records)
    },

    Accounts: {
      screen: provideRootNavigationContext(AccountsScreen)
    },

    PublishRecord: {
      screen: provideRootNavigationContext(PublishRecord)
    }
  },

  {
    headerMode: 'screen',
    initialRouteName: 'Accounts',
    // initialRouteParams: {
    //   startTime: Date.now() - (7 * 24 * 60 * 60 * 1000),
    //   endTime: Date.now()
    // }
  }
);

App.displayName = `App-${App.name || App.displayName}`;

export default App;
