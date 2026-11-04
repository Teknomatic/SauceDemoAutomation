import { expect, type Locator, type Page } from '@playwright/test';
import { AppLayout } from './AppLayout';

// Locators come from app-map.md > Pages Discovered > Page: Product Detail.
export class ProductDetailPage {
  readonly layout: AppLayout;
  readonly backButton: Locator;
  readonly name: Locator;
  readonly description: Locator;
  readonly price: Locator;
  readonly addToCartButton: Locator;
  readonly removeButton: Locator;

  constructor(page: Page) {
    this.layout = new AppLayout(page);
    this.backButton = page.getByRole('button', { name: 'Back to products' });
    this.name = page.getByTestId('inventory-item-name');
    this.description = page.getByTestId('inventory-item-desc');
    this.price = page.getByTestId('inventory-item-price');
    this.addToCartButton = page.getByRole('button', { name: 'Add to cart' });
    this.removeButton = page.getByRole('button', { name: 'Remove' });
  }

  /** Readiness element from app-map.md: the "Back to products" button. */
  async waitUntilLoaded(): Promise<void> {
    await expect(this.backButton).toBeVisible();
  }

  async addToCart(): Promise<void> {
    await this.addToCartButton.click();
  }

  async backToProducts(): Promise<void> {
    await this.backButton.click();
  }
}
