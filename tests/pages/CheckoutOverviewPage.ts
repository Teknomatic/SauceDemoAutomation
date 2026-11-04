import { expect, type Locator, type Page } from '@playwright/test';
import { AppLayout } from './AppLayout';

// Locators come from app-map.md > Pages Discovered > Page: Checkout - Overview.
export class CheckoutOverviewPage {
  readonly layout: AppLayout;
  readonly title: Locator;
  readonly items: Locator;
  readonly itemNames: Locator;
  readonly paymentValue: Locator;
  readonly shippingValue: Locator;
  readonly subtotal: Locator;
  readonly tax: Locator;
  readonly total: Locator;
  readonly cancelButton: Locator;
  readonly finishButton: Locator;

  constructor(page: Page) {
    this.layout = new AppLayout(page);
    this.title = page.getByTestId('title');
    this.items = page.getByTestId('inventory-item');
    this.itemNames = page.getByTestId('inventory-item-name');
    this.paymentValue = page.getByTestId('payment-info-value');
    this.shippingValue = page.getByTestId('shipping-info-value');
    this.subtotal = page.getByTestId('subtotal-label');
    this.tax = page.getByTestId('tax-label');
    this.total = page.getByTestId('total-label');
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
    this.finishButton = page.getByRole('button', { name: 'Finish' });
  }

  /** Readiness element from app-map.md: the page title "Checkout: Overview". */
  async waitUntilLoaded(): Promise<void> {
    await expect(this.title).toHaveText('Checkout: Overview');
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }

  async finish(): Promise<void> {
    await this.finishButton.click();
  }
}
