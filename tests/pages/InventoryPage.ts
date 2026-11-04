import { expect, type Locator, type Page } from '@playwright/test';
import { AppLayout } from './AppLayout';

// Locators come from app-map.md > Pages Discovered > Page: Inventory (Products).
export class InventoryPage {
  readonly layout: AppLayout;
  readonly title: Locator;
  readonly sortSelect: Locator;
  readonly productCards: Locator;
  readonly productNames: Locator;
  readonly productPrices: Locator;
  /** Position is the behavior under test for sorting, so these two are defined here, not in specs. */
  readonly firstProductName: Locator;
  readonly lastProductName: Locator;

  constructor(private readonly page: Page) {
    this.layout = new AppLayout(page);
    this.title = page.getByTestId('title');
    this.sortSelect = page.getByRole('combobox', { name: 'Sort products' });
    this.productCards = page.getByTestId('inventory-item');
    this.productNames = page.getByTestId('inventory-item-name');
    this.productPrices = page.getByTestId('inventory-item-price');
    this.firstProductName = this.productNames.first();
    this.lastProductName = this.productNames.last();
  }

  async goto(): Promise<void> {
    await this.page.goto('/inventory.html');
  }

  /** Readiness element from app-map.md: the page title "Products". */
  async waitUntilLoaded(): Promise<void> {
    await expect(this.title).toHaveText('Products');
  }

  /** Login Wait Rule: post-login URL reached and readiness element visible, 30s each. */
  async waitUntilLoggedIn(): Promise<void> {
    await expect(this.page).toHaveURL(/\/inventory\.html$/, { timeout: 30_000 });
    await expect(this.title).toHaveText('Products', { timeout: 30_000 });
  }

  /** The product card with the given visible name, so tests never depend on list position. */
  card(name: string): Locator {
    return this.productCards.filter({ has: this.page.getByTestId('inventory-item-name').filter({ hasText: name }) });
  }

  addToCartButton(name: string): Locator {
    return this.card(name).getByRole('button', { name: 'Add to cart' });
  }

  removeButton(name: string): Locator {
    return this.card(name).getByRole('button', { name: 'Remove' });
  }

  /** The name link; the card's image link has the same accessible name, so filter by visible text. */
  productLink(name: string): Locator {
    return this.card(name).getByRole('button', { name: `View details for ${name}` }).filter({ hasText: name });
  }

  async addToCart(name: string): Promise<void> {
    await this.addToCartButton(name).click();
  }

  async removeFromCart(name: string): Promise<void> {
    await this.removeButton(name).click();
  }

  async openProduct(name: string): Promise<void> {
    await this.productLink(name).click();
  }

  async sortBy(option: string): Promise<void> {
    await this.sortSelect.selectOption({ label: option });
  }
}
