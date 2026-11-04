import { expect, type Locator, type Page } from '@playwright/test';
import { AppLayout } from './AppLayout';

// Locators come from app-map.md > Pages Discovered > Page: Checkout - Complete.
export class CheckoutCompletePage {
  readonly layout: AppLayout;
  readonly confirmationHeading: Locator;
  readonly confirmationText: Locator;
  readonly backHomeButton: Locator;

  constructor(page: Page) {
    this.layout = new AppLayout(page);
    this.confirmationHeading = page.getByRole('heading', { level: 2, name: 'Thank you for your order!' });
    this.confirmationText = page.getByTestId('complete-text');
    this.backHomeButton = page.getByRole('button', { name: 'Back Home' });
  }

  /** Readiness element from app-map.md: the confirmation heading. */
  async waitUntilLoaded(): Promise<void> {
    await expect(this.confirmationHeading).toBeVisible();
  }
}
