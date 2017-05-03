// 自定义生命周期方法

import hoistNonReactStatic from 'hoist-non-react-statics';

/** 生命周期 componentPropsWillChange:
 * - 在 componentWillMount 和 componentWillReceiveProps 时触发
 * - componentWillMount 时触发，参数为 (undefined, this.props)
 * - componentWillReceiveProps 时触发，参数为 (this.props, nextProps)
 */
export function componentPropsWillChange(BaseComponent) {
  class ComponentPropsWillChangeWrapper extends BaseComponent {
    static displayName = BaseComponent.displayName || BaseComponent.name

    componentWillMount(...args) {
      if (super.componentWillMount) {
        super.componentWillMount(...args);
      }
      this.componentPropsWillChange(undefined, this.props);
    }

    componentWillReceiveProps(nextProps, ...args) {
      if (super.componentWillReceiveProps) {
        super.componentWillReceiveProps(nextProps, ...args);
      }
      this.componentPropsWillChange(this.props, nextProps);
    }
  }

  hoistNonReactStatic(ComponentPropsWillChangeWrapper, BaseComponent);

  return ComponentPropsWillChangeWrapper;
}
