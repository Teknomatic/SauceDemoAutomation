import { requireEnv } from './support/env';
import {
  LOCKED_OUT_USERNAME,
  MESSAGES,
  PROTECTED_PATHS,
  protectedPageMessage,
  WRONG_PASSWORD,
} from './support/data';
import { expect, test } from './fixtures';

test.describe('Authentication', { tag: '@auth' }, () => {
  test.describe('Login page', () => {
    // These tests exercise the login page, so they start without the saved session.
    test.use({ storageState: { cookies: [], origins: [] } });

    test.beforeEach(async ({ loginPage }) => {
      await loginPage.goto();
      await loginPage.waitUntilLoaded();
    });

    test(
      'TC001: User can log in with valid credentials',
      {
        tag: ['@smoke', '@priority-high'],
        annotation: { type: 'groundedIn', description: '## Authentication Status; ## User Flows > 1. Log in' },
      },
      async ({ page, loginPage, inventoryPage }) => {
        await loginPage.login(requireEnv('TEST_USER'), requireEnv('TEST_PASSWORD'));

        await inventoryPage.waitUntilLoggedIn();
        await expect(page).toHaveURL(/\/inventory\.html$/);
        await expect(inventoryPage.title).toHaveText('Products');
      },
    );

    test(
      'TC002: Login requires a username',
      {
        tag: '@priority-high',
        annotation: {
          type: 'groundedIn',
          description: '## Test Data Opportunities > ### Forms > Login form (both empty)',
        },
      },
      async ({ page, loginPage }) => {
        await loginPage.loginButton.click();

        await expect(loginPage.errorMessage).toHaveText(MESSAGES.usernameRequired);
        await expect(page).toHaveURL(/\/$/);
      },
    );

    test(
      'TC003: Login requires a password',
      {
        tag: '@priority-high',
        annotation: {
          type: 'groundedIn',
          description: '## Test Data Opportunities > ### Forms > Login form (username only)',
        },
      },
      async ({ loginPage }) => {
        await loginPage.usernameInput.fill(requireEnv('TEST_USER'));
        await loginPage.loginButton.click();

        await expect(loginPage.errorMessage).toHaveText(MESSAGES.passwordRequired);
      },
    );

    test(
      'TC004: Login rejects a wrong password',
      {
        tag: '@priority-high',
        annotation: {
          type: 'groundedIn',
          description: '## Test Data Opportunities > ### Forms > Login form (wrong password)',
        },
      },
      async ({ loginPage }) => {
        await loginPage.login(requireEnv('TEST_USER'), WRONG_PASSWORD);

        await expect(loginPage.errorMessage).toHaveText(MESSAGES.credentialsMismatch);
      },
    );

    test(
      'TC005: Locked-out user cannot log in',
      {
        tag: '@priority-medium',
        annotation: [
          {
            type: 'groundedIn',
            description:
              '## Test Data Opportunities > ### Forms > Login form (locked_out_user); ## Authentication Status',
          },
          {
            type: 'inference',
            description:
              'The login page states the password is the same for all users, so TEST_PASSWORD is reused for locked_out_user.',
          },
        ],
      },
      async ({ page, loginPage }) => {
        await loginPage.login(LOCKED_OUT_USERNAME, requireEnv('TEST_PASSWORD'));

        await expect(loginPage.errorMessage).toHaveText(MESSAGES.lockedOut);
        await expect(page).toHaveURL(/\/$/);
      },
    );

    test(
      'TC006: Login error can be dismissed',
      {
        tag: '@priority-medium',
        annotation: { type: 'groundedIn', description: '## Pages Discovered > ### Page: Login (Dismiss error)' },
      },
      async ({ loginPage }) => {
        await loginPage.loginButton.click();
        await expect(loginPage.errorMessage).toBeVisible();

        await loginPage.dismissErrorButton.click();

        await expect(loginPage.errorMessage).toBeHidden();
      },
    );

    for (const { path, case: caseName } of PROTECTED_PATHS) {
      test(
        `TC007: Protected page redirects to login when not logged in (${caseName})`,
        {
          tag: '@priority-high',
          annotation: {
            type: 'groundedIn',
            description: '## Known Edge Cases (opening a protected page without logging in)',
          },
        },
        async ({ page, loginPage }) => {
          await page.goto(path);

          await expect(loginPage.errorMessage).toHaveText(protectedPageMessage(path));
          await expect(page).toHaveURL(/\/$/);
        },
      );
    }
  });

  test.describe('Session', () => {
    test(
      'TC008: User can log out',
      {
        tag: '@priority-high',
        annotation: { type: 'groundedIn', description: '## User Flows > 5. Log out' },
      },
      async ({ loginPage, inventoryPage }) => {
        await inventoryPage.goto();
        await inventoryPage.waitUntilLoaded();

        await inventoryPage.layout.logout();

        await loginPage.waitUntilLoaded();
        await expect(loginPage.usernameInput).toHaveValue('');
      },
    );
  });
});
