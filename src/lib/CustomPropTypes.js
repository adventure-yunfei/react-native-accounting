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

const navigationShape = {
  navigate: PropTypes.func.isRequired,
  goBack: PropTypes.func.isRequired
};

export default {
  navigation: PropTypes.shape(navigationShape),

  rootNavigation: PropTypes.shape({
    ...navigationShape,
    $navigateByPath: PropTypes.func.isRequired
  }),

  style: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.object
  ])
};
