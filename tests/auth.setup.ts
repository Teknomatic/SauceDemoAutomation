import { test as setup } from '@playwright/test';
import { InventoryPage } from './pages/InventoryPage';
import { LoginPage } from './pages/LoginPage';
import { requireEnv } from './support/env';
import { STORAGE_STATE } from './support/paths';

// Logs in once per run and saves the session. Browser projects reuse it through `storageState`.
setup('authenticate as default test user', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(requireEnv('TEST_USER'), requireEnv('TEST_PASSWORD'));
  await new InventoryPage(page).waitUntilLoggedIn();
  await page.context().storageState({ path: STORAGE_STATE });
});
