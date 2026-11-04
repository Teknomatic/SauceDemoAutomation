// Lint gate for generated Playwright code. Codegen output must pass `npm run lint` with zero warnings.
import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';
import playwright from 'eslint-plugin-playwright';

const sharedRestrictions = [
  {
    selector: "LogicalExpression[operator=/^(\\|\\||\\?\\?)$/][left.object.object.name='process'][left.object.property.name='env']",
    message: 'No hardcoded fallbacks for env vars. Use requireEnv() from tests/support/env.ts.',
  },
  {
    selector: "CallExpression[callee.name='expect'] > CallExpression.arguments[callee.property.name='url']",
    message: 'Use the retrying assertion: await expect(page).toHaveURL(...).',
  },
  {
    selector: "CallExpression[callee.property.name='goto'][arguments.0.type='TemplateLiteral']",
    message: 'Pass a relative path to goto(); baseURL comes from playwright.config.ts.',
  },
];

const specOnlyRestrictions = [
  {
    selector: "CallExpression[callee.object.name='page'][callee.property.name=/^(locator|getBy\\w+|\\$\\$?)$/]",
    message: 'Define locators in a page object (tests/pages) and use it through a fixture.',
  },
  {
    selector: "CallExpression[callee.property.name=/^(beforeEach|beforeAll)$/] CallExpression[callee.property.name='newPage']",
    message: 'Use the built-in { page } fixture instead of browser.newPage().',
  },
];

export default defineConfig(
  globalIgnores(['node_modules/', 'playwright-report/', 'test-results/', 'playwright/.auth/', '.testing/']),

  // TypeScript rules for all TS files (config, fixtures, page objects, specs).
  {
    files: ['**/*.ts'],
    extends: [tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // A missing `await` on a Playwright call is the most common source of flaky tests.
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/explicit-function-return-type': [
        'error',
        { allowExpressions: true, allowTypedFunctionExpressions: true },
      ],
    },
  },

  // Playwright rules for everything under tests/.
  {
    files: ['**/tests/**/*.ts'],
    extends: [playwright.configs['flat/recommended']],
    settings: {
      playwright: { globalAliases: { test: ['setup'] } },
    },
    rules: {
      // Page-object methods named expect*/waitUntil* contain web-first assertions and count as assertions.
      'playwright/expect-expect': ['error', { assertFunctionPatterns: ['^expect[A-Z]', '^waitUntil[A-Z]'] }],
      'playwright/no-networkidle': 'error',
      'playwright/no-wait-for-timeout': 'error',
      'playwright/no-wait-for-selector': 'error',
      'playwright/no-wait-for-navigation': 'error',
      'playwright/no-element-handle': 'error',
      'playwright/no-eval': 'error',
      'playwright/no-force-option': 'error',
      'playwright/no-page-pause': 'error',
      'playwright/no-focused-test': 'error',
      'playwright/no-skipped-test': ['error', { allowConditional: true }],
      'playwright/no-conditional-in-test': 'error',
      'playwright/no-conditional-expect': 'error',
      'playwright/no-standalone-expect': 'error',
      'playwright/no-nested-step': 'error',
      'playwright/no-useless-await': 'error',
      'playwright/no-useless-not': 'error',
      'playwright/missing-playwright-await': 'error',
      'playwright/prefer-web-first-assertions': 'error',
      'playwright/prefer-locator': 'error',
      'playwright/prefer-native-locators': 'error',
      'playwright/prefer-to-have-count': 'error',
      'playwright/prefer-to-have-length': 'error',
      'playwright/prefer-to-be': 'error',
      'playwright/prefer-to-contain': 'error',
      'playwright/valid-title': 'error',
      'playwright/valid-expect': 'error',
      // CSS/XPath via page.locator() needs an eslint-disable comment with a reason.
      'playwright/no-raw-locators': 'error',
    },
  },

  // Rules for all test code (pages, fixtures, setup, specs).
  {
    files: ['**/tests/**/*.ts'],
    rules: {
      'no-restricted-syntax': ['error', ...sharedRestrictions],
    },
  },

  // Specs talk to the app only through page objects and fixtures.
  {
    files: ['**/*.spec.ts'],
    rules: {
      'no-restricted-syntax': ['error', ...sharedRestrictions, ...specOnlyRestrictions],
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@playwright/test',
              importNames: ['test', 'expect'],
              message: "Import test and expect from './fixtures' so page-object fixtures are available.",
            },
          ],
        },
      ],
    },
  },
);
