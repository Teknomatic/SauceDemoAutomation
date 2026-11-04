import type { Locator, Page } from '@playwright/test';
import { AppLayout } from './AppLayout';

// Covers the three Dynamic Catalog sub-pages. Only the title is known from discovery
// (app-map.md > Pages Discovered > Page: Dynamic Catalog); their behavior was not explored.
export class DynamicCatalogPage {
  readonly layout: AppLayout;
  readonly title: Locator;

  constructor(page: Page) {
    this.layout = new AppLayout(page);
    this.title = page.getByTestId('title');
  }
}
