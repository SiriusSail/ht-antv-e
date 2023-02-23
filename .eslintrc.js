module.exports = {
  env: {
    browser: true,
    es2021: true,
    commonjs: true,
    es6: true,
    node: true,
  },
  extends: [
    "airbnb-base",
    "eslint:recommended",
    "plugin:vue/vue3-recommended",
    "plugin:@typescript-eslint/recommended",
    'plugin:vue/essential',
    "prettier",
  ],
  parserOptions: {
    ecmaVersion: 12,
    parser: "@typescript-eslint/parser",
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ["vue", "react", "@typescript-eslint"],
  rules: {
    'jsx-quotes': [2, 'prefer-single'],
    "no-unused-vars": "off",
    indent: ["warn", 2, { SwitchCase: 1 }],
    "vue/max-attributes-per-line": ["error", {
      "singleline": {
        "max": 2
      },
      "multiline": {
        "max": 1
      }
    }],
    "vue/html-closing-bracket-newline": ["error", {
      "singleline": "never",
      "multiline": "always"
    }],
    'vue/no-multi-spaces': 'error',
    "vue/html-indent": ["error", 2, {
      "attribute": 1,
      "baseIndent": 1,
      "closeBracket": 0,
      "alignAttributesVertically": false,
      "ignores": []
    }],
    'vue/html-closing-bracket-spacing': [
      'error',
      {
        startTag: 'never',
        endTag: 'never',
        selfClosingTag: 'always'
      }
    ],
    'vue/html-self-closing': [
      'error',
      {
        html: {
          "void": "never",
          "normal": "any",
          "component": "any"
        },
        svg: 'always',
        math: 'always'
      }
    ],
    // "max-len": ["error", { "code": 80 }],
    "import/no-unresolved": "off",
    "import/extensions": "off",
    "import/no-absolute-path": "off",
    "import/no-extraneous-dependencies": "off",
    "vue/no-multiple-template-root": "off",
    // "consistent-return":"off",  // 返回类型一致性
    "no-console": "off",
    "no-plusplus": "off",
    "rest-spread-spacing": ["error", "never"],
    "space-in-parens": ["error", "never"],
    "block-spacing": ["error", "never"],
    // "indent": ["error", "tab"],
    "key-spacing": ["error", { beforeColon: false }],
    "spaced-comment": 2, // 注释风格要不要有空格什么的
    "space-before-blocks": 2, // if function等的大括号之前需要有空格
    "space-infix-ops": 2,
    "multiline-ternary": ["error", "always-multiline"],
    "new-cap": "error",
    "no-irregular-whitespace": 2, // 不规则的空白不允许
    "no-trailing-spaces": 2, // 一行结束后面有空格就发出警告
    "no-bitwise": "off",
    "arrow-parens": ["error", "always"],
    // "brace-style": ["error", "stroustrup"],
    "array-bracket-spacing": ["error", "never"],
    "comma-spacing": ["error", { before: false, after: true }],

    "no-param-reassign": [
      "error",
      {
        props: true,
        ignorePropertyModificationsFor: ["state", "config"],
      },
    ],
  },
};
