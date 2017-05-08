module.exports = {
  "parser": "babel-eslint",
  "extends": "airbnb",

  "rules": {
    // ### We don't need these... ###
    // underscore naming convention (this._foo) for private props is useful
    'no-underscore-dangle': 'off',
    // Explicit "return" is more meaningful if body is too large
    "arrow-body-style": "off",
    // Method without this is meaningful. (More meaningful with super call case)
    "class-methods-use-this": "off",
    // Default props doesn't always make sense (i.e. I want to check whether the prop is provided)
    "react/require-default-props": "off",


    // ### Following are my own coding preference ###
    "import/prefer-default-export": "off",
    "no-return-assign": "off",
    "no-multi-assign": "off",
    // The ending comma which don't make any sense make me unhappy. It's ONLY useful for diff comparasion
    "comma-dangle": "off",
    // I don't use jsx only in .jsx file
    "react/jsx-filename-extension": "off",
    // It's meaningful to define a small component which is only used inside that file
    "react/no-multi-comp": "off",
    // No, stateless-fucntion style differs from Component style, which causes inconsistent codes and tough code refactor
    "react/prefer-stateless-function": "off",
    // Custom lifecycle
    'react/sort-comp': ['error', {
      order: [
        'static-methods',
        'lifecycle',
        '/^component.+$/', //Custom lifecycle
        '/^on.+$/',
        '/^(get|set)(?!(InitialState$|DefaultProps$|ChildContext$)).+$/',
        'everything-else',
        '/^render.+$/',
        'render'
      ],
    }],

    // ### Temporary change ###
    // Before I get better solution, I don't want to forbid "array" and "object" types
    "react/forbid-prop-types": ['error', { forbid: ['any'] }]
  }
};
