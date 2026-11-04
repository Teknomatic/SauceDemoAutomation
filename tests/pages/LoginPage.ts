import { expect, type Locator, type Page } from '@playwright/test';

// Locators come from app-map.md > Pages Discovered > Page: Login.
export class LoginPage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly dismissErrorButton: Locator;

  constructor(private readonly page: Page) {
    this.usernameInput = page.getByRole('textbox', { name: 'Username' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.errorMessage = page.getByRole('alert');
    this.dismissErrorButton = page.getByRole('button', { name: 'Dismiss error' });
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  /** Readiness element from app-map.md: the Login button. */
  async waitUntilLoaded(): Promise<void> {
    await expect(this.loginButton).toBeVisible();
  }

  /** Submits credentials. Callers wait for the post-login page afterwards (Login Wait Rule). */
  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
