import { CHECKOUT_CUSTOMER, MESSAGES, PRODUCTS, TWO_ITEM_TOTALS } from './support/data';
import { expect, test } from './fixtures';

test.describe('Checkout', { tag: '@checkout' }, () => {
  test.describe('Information form', () => {
    // Each test starts on "Checkout: Your Information" with the Backpack in the cart.
    test.beforeEach(async ({ inventoryPage, cartPage, checkoutInfoPage }) => {
      await inventoryPage.goto();
      await inventoryPage.waitUntilLoaded();
      await inventoryPage.addToCart(PRODUCTS.backpack.name);
      await inventoryPage.layout.openCart();
      await cartPage.waitUntilLoaded();
      await cartPage.checkout();
      await checkoutInfoPage.waitUntilLoaded();
    });

    test(
      'TC020: Checkout requires a first name',
      {
        tag: '@priority-medium',
        annotation: {
          type: 'groundedIn',
          description: '## Test Data Opportunities > ### Forms > Checkout information form (all empty)',
        },
      },
      async ({ page, checkoutInfoPage }) => {
        await checkoutInfoPage.continue();

        await expect(checkoutInfoPage.errorMessage).toHaveText(MESSAGES.firstNameRequired);
        await expect(page).toHaveURL(/\/checkout-step-one\.html$/);
      },
    );

    test(
      'TC021: Checkout requires a last name',
      {
        tag: '@priority-medium',
        annotation: {
          type: 'groundedIn',
          description: '## Test Data Opportunities > ### Forms > Checkout information form (first name only)',
        },
      },
      async ({ checkoutInfoPage }) => {
        await checkoutInfoPage.firstNameInput.fill(CHECKOUT_CUSTOMER.firstName);

        await checkoutInfoPage.continue();

        await expect(checkoutInfoPage.errorMessage).toHaveText(MESSAGES.lastNameRequired);
      },
    );

    test(
      'TC022: Checkout requires a postal code',
      {
        tag: '@priority-medium',
        annotation: {
          type: 'groundedIn',
          description:
            '## Test Data Opportunities > ### Forms > Checkout information form (first and last name)',
        },
      },
      async ({ checkoutInfoPage }) => {
        await checkoutInfoPage.firstNameInput.fill(CHECKOUT_CUSTOMER.firstName);
        await checkoutInfoPage.lastNameInput.fill(CHECKOUT_CUSTOMER.lastName);

        await checkoutInfoPage.continue();

        await expect(checkoutInfoPage.errorMessage).toHaveText(MESSAGES.postalCodeRequired);
      },
    );

    test(
      'TC023: User can cancel checkout information and return to the cart',
      {
        tag: '@priority-medium',
        annotation: {
          type: 'groundedIn',
          description: '## Pages Discovered > ### Page: Checkout - Your Information (Cancel)',
        },
      },
      async ({ page, checkoutInfoPage, cartPage }) => {
        await checkoutInfoPage.cancel();

        await cartPage.waitUntilLoaded();
        await expect(page).toHaveURL(/\/cart\.html$/);
      },
    );
  });

  test.describe('Order', () => {
    test.beforeEach(async ({ inventoryPage }) => {
      await inventoryPage.goto();
      await inventoryPage.waitUntilLoaded();
    });

    test(
      'TC024: Checkout overview shows the correct totals',
      {
        tag: '@priority-high',
        annotation: { type: 'groundedIn', description: '## Test Data Opportunities > ### Calculated values' },
      },
      async ({ inventoryPage, cartPage, checkoutInfoPage, checkoutOverviewPage }) => {
        await inventoryPage.addToCart(PRODUCTS.backpack.name);
        await inventoryPage.addToCart(PRODUCTS.bikeLight.name);
        await inventoryPage.layout.openCart();
        await cartPage.waitUntilLoaded();
        await cartPage.checkout();
        await checkoutInfoPage.waitUntilLoaded();
        await checkoutInfoPage.fillCustomer(CHECKOUT_CUSTOMER);

        await checkoutInfoPage.continue();

        await checkoutOverviewPage.waitUntilLoaded();
        await expect(checkoutOverviewPage.items).toHaveCount(2);
        await expect(checkoutOverviewPage.itemNames).toHaveText([PRODUCTS.backpack.name, PRODUCTS.bikeLight.name]);
        await expect(checkoutOverviewPage.paymentValue).toHaveText(TWO_ITEM_TOTALS.payment);
        await expect(checkoutOverviewPage.shippingValue).toHaveText(TWO_ITEM_TOTALS.shipping);
        await expect(checkoutOverviewPage.subtotal).toHaveText(TWO_ITEM_TOTALS.subtotal);
        await expect(checkoutOverviewPage.tax).toHaveText(TWO_ITEM_TOTALS.tax);
        await expect(checkoutOverviewPage.total).toHaveText(TWO_ITEM_TOTALS.total);
      },
    );

    test(
      'TC025: User can cancel on the checkout overview',
      {
        tag: '@priority-medium',
        annotation: {
          type: 'groundedIn',
          description: '## Pages Discovered > ### Page: Checkout - Overview (Cancel)',
        },
      },
      async ({ page, inventoryPage, cartPage, checkoutInfoPage, checkoutOverviewPage }) => {
        await inventoryPage.addToCart(PRODUCTS.backpack.name);
        await inventoryPage.layout.openCart();
        await cartPage.waitUntilLoaded();
        await cartPage.checkout();
        await checkoutInfoPage.waitUntilLoaded();
        await checkoutInfoPage.fillCustomer(CHECKOUT_CUSTOMER);
        await checkoutInfoPage.continue();
        await checkoutOverviewPage.waitUntilLoaded();

        await checkoutOverviewPage.cancel();

        await expect(page).toHaveURL(/\/inventory\.html$/);
        await expect(inventoryPage.title).toHaveText('Products');
      },
    );

    test(
      'TC026: User can complete a purchase',
      {
        tag: ['@smoke', '@priority-high'],
        annotation: { type: 'groundedIn', description: '## User Flows > 4. Purchase' },
      },
      async ({
        page,
        inventoryPage,
        cartPage,
        checkoutInfoPage,
        checkoutOverviewPage,
        checkoutCompletePage,
      }) => {
        await inventoryPage.addToCart(PRODUCTS.backpack.name);
        await inventoryPage.layout.openCart();
        await cartPage.waitUntilLoaded();
        await cartPage.checkout();
        await checkoutInfoPage.waitUntilLoaded();
        await checkoutInfoPage.fillCustomer(CHECKOUT_CUSTOMER);
        await checkoutInfoPage.continue();
        await checkoutOverviewPage.waitUntilLoaded();

        await checkoutOverviewPage.finish();

        await checkoutCompletePage.waitUntilLoaded();
        await expect(page).toHaveURL(/\/checkout-complete\.html$/);
        await expect(checkoutCompletePage.confirmationHeading).toHaveText(MESSAGES.orderConfirmation);
        await expect(checkoutCompletePage.layout.cartBadge).toBeHidden();
      },
    );
  });
});
