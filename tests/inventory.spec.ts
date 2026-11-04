import { DEFAULT_PRODUCT_NAMES, DEFAULT_PRODUCT_PRICES, PRODUCTS, SORT_CASES } from './support/data';
import { expect, test } from './fixtures';

test.describe('Inventory', { tag: '@inventory' }, () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.goto();
    await inventoryPage.waitUntilLoaded();
  });

  test(
    'TC009: Products page lists six products with names and prices',
    {
      tag: ['@smoke', '@priority-high'],
      annotation: {
        type: 'groundedIn',
        description: '## Pages Discovered > ### Page: Inventory (Products) > Product data observed',
      },
    },
    async ({ inventoryPage }) => {
      await expect(inventoryPage.productCards).toHaveCount(6);
      await expect(inventoryPage.productNames).toHaveText(DEFAULT_PRODUCT_NAMES);
      await expect(inventoryPage.productPrices).toHaveText(DEFAULT_PRODUCT_PRICES);
    },
  );

  for (const { option, first, last } of SORT_CASES) {
    test(
      `TC010: Products can be sorted by ${option}`,
      {
        tag: '@priority-medium',
        annotation: [
          {
            type: 'groundedIn',
            description:
              '## Pages Discovered > ### Page: Inventory (Products) > Sort options and the observed order',
          },
          {
            type: 'inference',
            description:
              'Only first and last are asserted because two products share the price $15.99 and their relative order was observed once.',
          },
        ],
      },
      async ({ inventoryPage }) => {
        await inventoryPage.sortBy(option);

        await expect(inventoryPage.firstProductName).toHaveText(first);
        await expect(inventoryPage.lastProductName).toHaveText(last);
      },
    );
  }

  test(
    'TC011: User can add a product to the cart from the Products page',
    {
      tag: ['@smoke', '@priority-high'],
      annotation: {
        type: 'groundedIn',
        description: '## Pages Discovered > ### Page: Inventory (Products) (Add to cart / Remove, cart badge)',
      },
    },
    async ({ inventoryPage }) => {
      await inventoryPage.addToCart(PRODUCTS.backpack.name);

      await expect(inventoryPage.removeButton(PRODUCTS.backpack.name)).toBeVisible();
      await expect(inventoryPage.addToCartButton(PRODUCTS.backpack.name)).toBeHidden();
      await expect(inventoryPage.layout.cartBadge).toHaveText('1');
    },
  );

  test(
    'TC012: User can remove a product from the Products page',
    {
      tag: '@priority-medium',
      annotation: {
        type: 'groundedIn',
        description: '## Pages Discovered > ### Page: Inventory (Products) (Add to cart / Remove, cart badge)',
      },
    },
    async ({ inventoryPage }) => {
      await inventoryPage.addToCart(PRODUCTS.backpack.name);

      await inventoryPage.removeFromCart(PRODUCTS.backpack.name);

      await expect(inventoryPage.addToCartButton(PRODUCTS.backpack.name)).toBeVisible();
      await expect(inventoryPage.layout.cartBadge).toBeHidden();
    },
  );

  test(
    'TC013: User can open a product detail page',
    {
      tag: '@priority-medium',
      annotation: {
        type: 'groundedIn',
        description: '## Pages Discovered > ### Page: Product Detail; ## User Flows > 3. View a product',
      },
    },
    async ({ page, inventoryPage, productDetailPage }) => {
      await inventoryPage.openProduct(PRODUCTS.backpack.name);

      await productDetailPage.waitUntilLoaded();
      await expect(page).toHaveURL(PRODUCTS.backpack.detailUrl);
      await expect(productDetailPage.name).toHaveText(PRODUCTS.backpack.name);
      await expect(productDetailPage.description).toHaveText(PRODUCTS.backpack.description);
      await expect(productDetailPage.price).toHaveText(PRODUCTS.backpack.price);
    },
  );

  test(
    'TC014: User can return to the Products page from a product detail page',
    {
      tag: '@priority-medium',
      annotation: { type: 'groundedIn', description: '## User Flows > 3. View a product' },
    },
    async ({ page, inventoryPage, productDetailPage }) => {
      await inventoryPage.openProduct(PRODUCTS.backpack.name);
      await productDetailPage.waitUntilLoaded();

      await productDetailPage.backToProducts();

      await expect(page).toHaveURL(/\/inventory\.html$/);
      await expect(inventoryPage.title).toHaveText('Products');
    },
  );

  test(
    'TC015: User can add a product to the cart from its detail page',
    {
      tag: '@priority-medium',
      annotation: {
        type: 'groundedIn',
        description: '## Pages Discovered > ### Page: Product Detail (Add to cart / Remove)',
      },
    },
    async ({ inventoryPage, productDetailPage }) => {
      await inventoryPage.openProduct(PRODUCTS.backpack.name);
      await productDetailPage.waitUntilLoaded();

      await productDetailPage.addToCart();

      await expect(productDetailPage.removeButton).toBeVisible();
      await expect(productDetailPage.layout.cartBadge).toHaveText('1');
    },
  );
});
