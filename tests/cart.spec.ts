import { PRODUCTS } from './support/data';
import { expect, test } from './fixtures';

test.describe('Cart', { tag: '@cart' }, () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.goto();
    await inventoryPage.waitUntilLoaded();
  });

  test(
    'TC016: Cart lists the products that were added',
    {
      tag: ['@smoke', '@priority-high'],
      annotation: {
        type: 'groundedIn',
        description: '## Pages Discovered > ### Page: Cart; ## User Flows > 4. Purchase',
      },
    },
    async ({ inventoryPage, cartPage }) => {
      await inventoryPage.addToCart(PRODUCTS.backpack.name);
      await inventoryPage.addToCart(PRODUCTS.bikeLight.name);

      await inventoryPage.layout.openCart();

      await cartPage.waitUntilLoaded();
      await expect(cartPage.items).toHaveCount(2);
      await expect(cartPage.itemNames).toHaveText([PRODUCTS.backpack.name, PRODUCTS.bikeLight.name]);
    },
  );

  test(
    'TC017: User can remove an item from the cart',
    {
      tag: '@priority-medium',
      annotation: { type: 'groundedIn', description: '## Pages Discovered > ### Page: Cart (Remove)' },
    },
    async ({ inventoryPage, cartPage }) => {
      await inventoryPage.addToCart(PRODUCTS.backpack.name);
      await inventoryPage.addToCart(PRODUCTS.bikeLight.name);
      await inventoryPage.layout.openCart();
      await cartPage.waitUntilLoaded();

      await cartPage.removeItem(PRODUCTS.backpack.name);

      await expect(cartPage.items).toHaveCount(1);
      await expect(cartPage.itemNames).toHaveText([PRODUCTS.bikeLight.name]);
      await expect(cartPage.layout.cartBadge).toHaveText('1');
    },
  );

  test(
    'TC018: User can continue shopping from the cart',
    {
      tag: '@priority-medium',
      annotation: { type: 'groundedIn', description: '## Pages Discovered > ### Page: Cart (Continue Shopping)' },
    },
    async ({ page, inventoryPage, cartPage }) => {
      await inventoryPage.layout.openCart();
      await cartPage.waitUntilLoaded();

      await cartPage.continueShopping();

      await expect(page).toHaveURL(/\/inventory\.html$/);
      await expect(inventoryPage.title).toHaveText('Products');
    },
  );

  test(
    'TC019: Empty cart shows no items',
    {
      tag: '@priority-low',
      annotation: {
        type: 'groundedIn',
        description: '## Known Edge Cases (An empty cart shows the headings and the buttons but no items)',
      },
    },
    async ({ inventoryPage, cartPage }) => {
      await inventoryPage.layout.openCart();

      await cartPage.waitUntilLoaded();
      await expect(cartPage.items).toHaveCount(0);
      await expect(cartPage.continueShoppingButton).toBeVisible();
      await expect(cartPage.checkoutButton).toBeVisible();
    },
  );
});
