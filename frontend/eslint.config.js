import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import prettier from 'eslint-config-prettier';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  // Загальні налаштування для всіх файлів
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended, // Загальні рекомендовані правила ESLint
      react.configs.recommended, // Рекомендовані правила для React
      reactHooks.configs.recommended, // Рекомендовані правила для React Hooks
      prettier, // Відключає правила, що конфліктують з Prettier
    ],
    languageOptions: {
      globals: globals.browser,
      ecmaVersion: 2020,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      react: react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'off',
      'react/prop-types': 'off', // Вимкнення перевірки PropTypes, оскільки ми будемо використовувати TypeScript або це не потрібно
      'react/react-in-jsx-scope': 'off', // Вимкнення правила для нового React JSX
    },
  },
  // Налаштування для Vite
  {
    files: ['**/*.{js,jsx}'],
    rules: {
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
]);