module.exports = {
  "extends": ["@cybozu", "@cybozu/eslint-config/globals/kintone"],
  "plugins": ["xss"],
  "rules": {
    "xss/no-mixed-html": 2,
    "xss/no-location-href-assign": 2
  },
  "parserOptions": {
    "ecmaVersion": 2020
  },
  "env": {
    "es2020": true
  }
};