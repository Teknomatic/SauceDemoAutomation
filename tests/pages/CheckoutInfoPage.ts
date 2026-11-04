import { expect, type Locator, type Page } from '@playwright/test';
import { AppLayout } from './AppLayout';

// Locators come from app-map.md > Pages Discovered > Page: Checkout - Your Information.
export class CheckoutInfoPage {
  readonly layout: AppLayout;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly cancelButton: Locator;
  readonly continueButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.layout = new AppLayout(page);
    this.firstNameInput = page.getByRole('textbox', { name: 'First Name' });
    this.lastNameInput = page.getByRole('textbox', { name: 'Last Name' });
    this.postalCodeInput = page.getByRole('textbox', { name: 'Zip/Postal Code' });
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
    this.continueButton = page.getByRole('button', { name: 'Continue' });
    this.errorMessage = page.getByRole('alert');
  }

  /** Readiness element from app-map.md: the First Name field. */
  async waitUntilLoaded(): Promise<void> {
    await expect(this.firstNameInput).toBeVisible();
  }

  async fillCustomer(customer: { firstName: string; lastName: string; postalCode: string }): Promise<void> {
    await this.firstNameInput.fill(customer.firstName);
    await this.lastNameInput.fill(customer.lastName);
    await this.postalCodeInput.fill(customer.postalCode);
  }

  async continue(): Promise<void> {
    await this.continueButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }
}
