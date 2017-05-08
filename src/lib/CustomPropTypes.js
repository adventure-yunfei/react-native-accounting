import { PropTypes } from 'react';

// function createReactChainableTypeChecker(validate) {
//   function checkType(isRequired, props, propName, componentName, location, propFullName) {
//     componentName = componentName || '<<anonymous>>';
//     propFullName = propFullName || propName;
//     if (props[propName] == null) {
//       if (isRequired) {
//         return new Error(
//           `Required ${location} \`${propFullName}\` was not specified in \`${componentName}\`.`
//         );
//       }
//       return null;
//     } else {
//       return validate(props, propName, componentName, location, propFullName);
//     }
//   }

//   const chainedCheckType = checkType.bind(null, false);
//   chainedCheckType.isRequired = checkType.bind(null, true);

//   return chainedCheckType;
// }

const navigationBaseShape = {
  navigate: PropTypes.func.isRequired,
  goBack: PropTypes.func.isRequired,
  state: PropTypes.object.isRequired
};

export default {
  navigation: PropTypes.shape(navigationBaseShape),

  navigationWithParams: paramsType => PropTypes.shape({
    ...navigationBaseShape,
    state: PropTypes.shape({
      params: paramsType
    }).isRequired
  }),

  style: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.object
  ])
};
