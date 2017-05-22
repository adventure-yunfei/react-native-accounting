import { NavigationActions } from 'react-navigation';
import omit from 'lodash/omit';

const NavigationExtActions = {
  REPLACE: 'navigationExt/REPLACE'
};

export const navigationExt = navigation => ({
  replace(routeName, params, action) {
    return navigation.dispatch({
      type: NavigationExtActions.REPLACE,
      routeName,
      params,
      action
    });
  },

  resetTo(routes, index = routes.length - 1) {
    return navigation.dispatch(NavigationActions.reset({
      index,
      actions: routes.map((route) => {
        return NavigationActions.navigate(
          typeof route === 'string' ? { routeName: route } : route
        );
      })
    }));
  },

  deepNavigate(routeNamesPath, params) {
    const routeNames = routeNamesPath.split('/');
    const action = routeNames.reduceRight((acc, routeName) => {
      return NavigationActions.navigate({
        routeName,
        params,
        action: acc
      });
    }, undefined);

    navigation.dispatch(action);
  }
});

export function argumentNavigatorRouter(navigator) {
  const router = navigator.router;
  const defaultGetStateForAction = router.getStateForAction;
  Object.assign(router, {
    getStateForAction(action, state) {
      if (action.type === NavigationExtActions.REPLACE) {
        const newState = defaultGetStateForAction(NavigationActions.navigate(omit(action, ['type'])), state);
        const prevIndex = newState.index - 1;
        const prevRoute = newState && newState.routes[prevIndex];
        if (state && prevRoute && prevRoute.key === state.routes[state.index].key) {
          const newRoutes = newState.routes.concat();
          newRoutes.splice(prevIndex, 1);
          return {
            ...newState,
            routes: newRoutes,
            index: newState.index - 1
          };
        }
      }
      return defaultGetStateForAction(action, state);
    }
  });
  return navigator;
}
