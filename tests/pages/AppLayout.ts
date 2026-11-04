import type { Locator, Page } from '@playwright/test';

// Header, side menu and cart link shared by every authenticated page.
// Locators come from app-map.md > Pages Discovered > Shared layout.
export class AppLayout {
  readonly openMenuButton: Locator;
  readonly closeMenuButton: Locator;
  readonly allItemsMenuItem: Locator;
  readonly dynamicCatalogMenuItem: Locator;
  readonly aboutMenuItem: Locator;
  readonly logoutMenuItem: Locator;
  readonly resetAppStateMenuItem: Locator;
  readonly cartLink: Locator;
  readonly cartBadge: Locator;

  constructor(private readonly page: Page) {
    this.openMenuButton = page.getByRole('button', { name: 'Open Menu' });
    this.closeMenuButton = page.getByRole('button', { name: 'Close Menu' });
    this.allItemsMenuItem = page.getByRole('button', { name: 'All Items' });
    this.dynamicCatalogMenuItem = page.getByRole('button', { name: 'Dynamic Catalog' });
    this.aboutMenuItem = page.getByRole('link', { name: 'About' });
    this.logoutMenuItem = page.getByRole('button', { name: 'Logout' });
    this.resetAppStateMenuItem = page.getByRole('button', { name: 'Reset App State' });
    this.cartLink = page.getByRole('button', { name: /^Cart/ });
    this.cartBadge = page.getByTestId('shopping-cart-badge');
  }

  /** Entry inside the expanded "Dynamic Catalog" menu item (Lazy Load, Spinner, Slider). */
  dynamicCatalogEntry(name: string): Locator {
    return this.page.getByRole('button', { name });
  }

  async openMenu(): Promise<void> {
    await this.openMenuButton.click();
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }

  async logout(): Promise<void> {
    await this.openMenu();
    await this.logoutMenuItem.click();
  }

  async resetAppState(): Promise<void> {
    await this.openMenu();
    await this.resetAppStateMenuItem.click();
  }
}
