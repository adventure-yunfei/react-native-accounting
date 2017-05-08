import React, { PropTypes } from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';

import CustomPropTypes from './CustomPropTypes';

export default function exposeRootNavigation(BaseComponent) {
  class ExposeRootNavigationWrapper extends React.PureComponent {
    static contextTypes = {
      rootNavigation: PropTypes.object.isRequired
    }

    render() {
      return <BaseComponent {...this.props} rootNavigation={this.context.rootNavigation} />;
    }
  }

  hoistNonReactStatic(ExposeRootNavigationWrapper, BaseComponent);

  return ExposeRootNavigationWrapper;
}

export function provideRootNavigationContext(BaseComponent) {
  class ProvideRootNavigationContextWrapper extends BaseComponent {
    static propTypes = {
      ...BaseComponent.propTypes,
      navigation: CustomPropTypes.navigation.isRequired
    }

    static childContextTypes = {
      rootNavigation: PropTypes.object.isRequired
    }

    getChildContext() {
      return {
        rootNavigation: this.props.navigation
      };
    }
  }

  hoistNonReactStatic(ProvideRootNavigationContextWrapper, BaseComponent);

  return ProvideRootNavigationContextWrapper;
}
