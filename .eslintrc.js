module.exports = {
  env: {
    node: true,
    browser: true,
    es6: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
  ],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
    require: true,
  },
  parserOptions: {
    ecmaVersion: 2015,
    sourceType: "module",
  },
  rules: {
    curly: ["warn", "multi", "consistent"],
    "no-console": "warn",
    "no-debugger": "warn",
  },
  ignorePatterns: ["dist", "node_modules"],
};
