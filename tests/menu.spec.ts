import { DYNAMIC_CATALOG_PAGES, PRODUCTS } from './support/data';
import { expect, test } from './fixtures';

test.describe('Menu & Navigation', { tag: '@menu' }, () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.goto();
    await inventoryPage.waitUntilLoaded();
  });

  test(
    'TC027: Menu shows its navigation options',
    {
      tag: '@priority-medium',
      annotation: {
        type: 'groundedIn',
        description: '## Pages Discovered > ### Shared layout (all authenticated pages)',
      },
    },
    async ({ inventoryPage }) => {
      const { layout } = inventoryPage;

      await layout.openMenu();

      await expect(layout.allItemsMenuItem).toBeVisible();
      await expect(layout.dynamicCatalogMenuItem).toBeVisible();
      await expect(layout.aboutMenuItem).toBeVisible();
      await expect(layout.logoutMenuItem).toBeVisible();
      await expect(layout.resetAppStateMenuItem).toBeVisible();
    },
  );

  test(
    'TC028: Reset App State clears the cart badge',
    {
      tag: '@priority-medium',
      annotation: [
        {
          type: 'groundedIn',
          description: '## Known Edge Cases (Reset App State clears the cart badge)',
        },
        {
          type: 'inference',
          description: 'The product button state after reset is an open question in the app-map and is not asserted.',
        },
      ],
    },
    async ({ inventoryPage }) => {
      await inventoryPage.addToCart(PRODUCTS.backpack.name);
      await expect(inventoryPage.layout.cartBadge).toHaveText('1');

      await inventoryPage.layout.resetAppState();

      await expect(inventoryPage.layout.cartBadge).toBeHidden();
    },
  );

  for (const { entry, title, url } of DYNAMIC_CATALOG_PAGES) {
    test(
      `TC029: Dynamic Catalog page can be opened from the menu (${entry})`,
      {
        tag: '@priority-low',
        annotation: [
          {
            type: 'groundedIn',
            description: '## Pages Discovered > ### Page: Dynamic Catalog (3 sub-pages, partially explored)',
          },
          {
            type: 'inference',
            description: 'Only navigation is asserted. The behavior of each page was not explored.',
          },
        ],
      },
      async ({ page, inventoryPage, dynamicCatalogPage }) => {
        const { layout } = inventoryPage;
        await layout.openMenu();
        await layout.dynamicCatalogMenuItem.click();

        await layout.dynamicCatalogEntry(entry).click();

        await expect(page).toHaveURL(url);
        await expect(dynamicCatalogPage.title).toHaveText(title);
      },
    );
  }
});
