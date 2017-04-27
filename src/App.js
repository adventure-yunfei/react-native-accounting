import { StackNavigator } from 'react-navigation';

import Home from './screens/Home';
import Accounts from './screens/Accounts';

export default StackNavigator({
  Home: {
    screen: Home,
  },

  Accounts: {
    screen: Accounts
  }
});
