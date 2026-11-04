import { test as base } from '@playwright/test';
import { CartPage } from './pages/CartPage';
import { CheckoutCompletePage } from './pages/CheckoutCompletePage';
import { CheckoutInfoPage } from './pages/CheckoutInfoPage';
import { CheckoutOverviewPage } from './pages/CheckoutOverviewPage';
import { DynamicCatalogPage } from './pages/DynamicCatalogPage';
import { InventoryPage } from './pages/InventoryPage';
import { LoginPage } from './pages/LoginPage';
import { ProductDetailPage } from './pages/ProductDetailPage';

type PageFixtures = {
  cartPage: CartPage;
  checkoutCompletePage: CheckoutCompletePage;
  checkoutInfoPage: CheckoutInfoPage;
  checkoutOverviewPage: CheckoutOverviewPage;
  dynamicCatalogPage: DynamicCatalogPage;
  inventoryPage: InventoryPage;
  loginPage: LoginPage;
  productDetailPage: ProductDetailPage;
};

/** Specs import `test` and `expect` from here, never from '@playwright/test'. */
export const test = base.extend<PageFixtures>({
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutCompletePage: async ({ page }, use) => {
    await use(new CheckoutCompletePage(page));
  },
  checkoutInfoPage: async ({ page }, use) => {
    await use(new CheckoutInfoPage(page));
  },
  checkoutOverviewPage: async ({ page }, use) => {
    await use(new CheckoutOverviewPage(page));
  },
  dynamicCatalogPage: async ({ page }, use) => {
    await use(new DynamicCatalogPage(page));
  },
  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  productDetailPage: async ({ page }, use) => {
    await use(new ProductDetailPage(page));
  },
});

export { expect } from '@playwright/test';
