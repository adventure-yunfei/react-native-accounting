import { StackNavigator } from 'react-navigation';

import Home from './screens/Home';
import Accounts from './screens/Accounts';
import Records from './screens/Records';

export default StackNavigator(
  {
    Home: {
      screen: Home,
    },

    Records: {
      screen: Records
    },

    Accounts: {
      screen: Accounts
    }
  },

  {
    initialRouteName: 'Home',
    // initialRouteParams: {
    //   startTime: Date.now() - (7 * 24 * 60 * 60 * 1000),
    //   endTime: Date.now()
    // }
  }
);
