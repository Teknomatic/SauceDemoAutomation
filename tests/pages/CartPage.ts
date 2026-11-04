import { expect, type Locator, type Page } from '@playwright/test';
import { AppLayout } from './AppLayout';

// Locators come from app-map.md > Pages Discovered > Page: Cart.
export class CartPage {
  readonly layout: AppLayout;
  readonly title: Locator;
  readonly items: Locator;
  readonly itemNames: Locator;
  readonly continueShoppingButton: Locator;
  readonly checkoutButton: Locator;

  constructor(private readonly page: Page) {
    this.layout = new AppLayout(page);
    this.title = page.getByTestId('title');
    this.items = page.getByTestId('inventory-item');
    this.itemNames = page.getByTestId('inventory-item-name');
    this.continueShoppingButton = page.getByRole('button', { name: 'Continue Shopping' });
    this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
  }

  /** Readiness element from app-map.md: the page title "Your Cart". */
  async waitUntilLoaded(): Promise<void> {
    await expect(this.title).toHaveText('Your Cart');
  }

  removeButton(name: string): Locator {
    return this.items
      .filter({ has: this.page.getByTestId('inventory-item-name').filter({ hasText: name }) })
      .getByRole('button', { name: 'Remove' });
  }

  async removeItem(name: string): Promise<void> {
    await this.removeButton(name).click();
  }

  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
  }

  async checkout(): Promise<void> {
    await this.checkoutButton.click();
  }
}
