// eslint.config.mjs
import { defineConfig } from 'eslint/config'
import eslintJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import prettier from 'eslint-config-prettier'

export default defineConfig([
  // 1. JS 基础
  eslintJs.configs.recommended,

  // 2. TS
  ...tseslint.configs.recommended,

  // 3. Vue3 推荐规则
  ...pluginVue.configs['flat/vue3-recommended'],

  // 4. Vue SFC 解析器 + TS 嵌套解析
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        // vue-eslint-parser 负责 .vue，TS 部分委托给 tseslint.parser
        parser: tseslint.parser,
        project: './tsconfig.app.json', // 你实际的 tsconfig
        extraFileExtensions: ['.vue'],
        sourceType: 'module',
      },
    },
  },

  // 5. 自定义兜底规则
  {
    rules: {
      // TS：禁止 any（按团队容忍度 error / warn）
      '@typescript-eslint/no-explicit-any': ['warn', { ignoreRestArgs: true }],
      // 单单词组件名：看你们习惯 off / warn
      'vue/multi-word-component-names': 'off',
    },
  },

  // 6. 最后：关掉 ESLint 自己的格式规则，交给 Prettier
  prettier,
])