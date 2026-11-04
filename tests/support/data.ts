// Test data observed during discovery. See .testing/app-map.md > Test Data Opportunities.
// Only values recorded there belong here; never invent data.

export const PRODUCTS = {
  backpack: {
    name: 'Sauce Labs Backpack',
    price: '$29.99',
    description:
      'carry.allTheThings() with the sleek, streamlined Sly Pack that melds uncompromising style with unequaled laptop and tablet protection.',
    detailUrl: /\/inventory-item\.html\?id=4$/,
  },
  bikeLight: { name: 'Sauce Labs Bike Light', price: '$9.99' },
  boltTShirt: { name: 'Sauce Labs Bolt T-Shirt', price: '$15.99' },
  fleeceJacket: { name: 'Sauce Labs Fleece Jacket', price: '$49.99' },
  onesie: { name: 'Sauce Labs Onesie', price: '$7.99' },
  redTShirt: { name: 'Test.allTheThings() T-Shirt (Red)', price: '$15.99' },
} as const;

/** Products in the default order of the Products page (Name A to Z). */
const DEFAULT_ORDER = [
  PRODUCTS.backpack,
  PRODUCTS.bikeLight,
  PRODUCTS.boltTShirt,
  PRODUCTS.fleeceJacket,
  PRODUCTS.onesie,
  PRODUCTS.redTShirt,
];
export const DEFAULT_PRODUCT_NAMES: string[] = DEFAULT_ORDER.map((product) => product.name);
export const DEFAULT_PRODUCT_PRICES: string[] = DEFAULT_ORDER.map((product) => product.price);

/**
 * Only the first and last product are asserted: the Bolt T-Shirt and the Red T-Shirt share a price,
 * so their relative order under the price sorts is not a reliable expectation.
 */
export const SORT_CASES = [
  { option: 'Name (Z to A)', first: PRODUCTS.redTShirt.name, last: PRODUCTS.backpack.name },
  { option: 'Price (low to high)', first: PRODUCTS.onesie.name, last: PRODUCTS.fleeceJacket.name },
  { option: 'Price (high to low)', first: PRODUCTS.fleeceJacket.name, last: PRODUCTS.onesie.name },
];

export const CHECKOUT_CUSTOMER = { firstName: 'Ada', lastName: 'Lovelace', postalCode: '12345' };

/** Cart of Backpack + Bike Light: $29.99 + $9.99. */
export const TWO_ITEM_TOTALS = {
  subtotal: 'Item total: $39.98',
  tax: 'Tax: $3.20',
  total: 'Total: $43.18',
  payment: 'SauceCard #31337',
  shipping: 'Free Pony Express Delivery!',
};

export const LOCKED_OUT_USERNAME = 'locked_out_user';
export const WRONG_PASSWORD = 'wrong-password';

export const MESSAGES = {
  usernameRequired: 'Epic sadface: Username is required',
  passwordRequired: 'Epic sadface: Password is required',
  credentialsMismatch: 'Epic sadface: Username and password do not match any user in this service',
  lockedOut: 'Epic sadface: Sorry, this user has been locked out.',
  firstNameRequired: 'Error: First Name is required',
  lastNameRequired: 'Error: Last Name is required',
  postalCodeRequired: 'Error: Postal Code is required',
  orderConfirmation: 'Thank you for your order!',
};

export function protectedPageMessage(path: string): string {
  return `Epic sadface: You can only access '${path}' when you are logged in.`;
}

export const DYNAMIC_CATALOG_PAGES = [
  { entry: 'Lazy Load', title: 'Dynamic Catalog - Lazy Load', url: /\/dynamic-catalog-lazy-load\.html$/ },
  { entry: 'Spinner', title: 'Dynamic Catalog - Spinner', url: /\/dynamic-catalog-spinner\.html$/ },
  { entry: 'Slider', title: 'Dynamic Catalog - Slider', url: /\/dynamic-catalog-slider\.html$/ },
];

export const PROTECTED_PATHS = [
  { path: '/inventory.html', case: 'inventory' },
  { path: '/cart.html', case: 'cart' },
  { path: '/checkout-step-one.html', case: 'checkout step one' },
];
