module.exports = {
  "extends": "@cybozu/eslint-config/presets/kintone-customize-es5",
  "plugins": ["xss"],
  "rules": {
    "xss/no-mixed-html": 2,
    "xss/no-location-href-assign": 2
  }
};