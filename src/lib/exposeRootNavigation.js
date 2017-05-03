import React, { PropTypes } from 'react';
import { NavigationActions } from 'react-navigation';

export default function exposeRootNavigation(BaseComponent) {
  class ExposeRootNavigationWrapper extends React.PureComponent {
    static contextTypes = {
      rootNavigation: PropTypes.object.isRequired
    }

    render() {
      return <BaseComponent {...this.props} rootNavigation={this.context.rootNavigation} />;
    }
  }

  return ExposeRootNavigationWrapper;
}

export function provideRootNavigationContext(BaseComponent) {
  class ProvideRootNavigationContextWrapper extends BaseComponent {
    static propTypes = {
      ...BaseComponent.propTypes,
      navigation: PropTypes.object.isRequired
    }

    static childContextTypes = {
      rootNavigation: PropTypes.object.isRequired
    }

    getChildContext() {
      const rootNavigation = this.props.navigation;
      rootNavigation.$navigateByPath = function $navigateByPath(path, params) {
        const routeNames = path.split('/');
        const action = routeNames.reduceRight((result, routeName) => {
          return NavigationActions.navigate({
            routeName,
            params,
            action: result
          });
        }, undefined);

        rootNavigation.dispatch(action);
      };
      return {
        rootNavigation: this.props.navigation
      };
    }
  }

  return ProvideRootNavigationContextWrapper;
}
