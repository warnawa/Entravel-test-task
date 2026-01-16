import { test as base } from "@playwright/test";
import { ShoppingCartController } from "../controllers/shopping-cart.controller";
import { ShoppingCartPage } from "../pages/shopping-cart.page";

/**
 * Custom fixtures for shopping cart tests
 * Implements Dependency Injection pattern for better testability
 */
type MyFixtures = {
  shoppingCartController: ShoppingCartController;
  shoppingCartPage: ShoppingCartPage;
};

/**
 * Extended Playwright test with custom fixtures
 * Usage:
 * - import { test, expect } from "../fixtures/shopping-cart.fixture";
 * - test("my test", async ({ shoppingCartController, shoppingCartPage }) => { ... });
 */
export const test = base.extend<MyFixtures>({
  /**
   * Shopping Cart API Controller fixture
   * Automatically injects APIRequestContext
   */
  shoppingCartController: async ({ request }, use) => {
    const controller = new ShoppingCartController(request);
    await use(controller);
  },

  /**
   * Shopping Cart Page Object fixture
   * Automatically injects Page instance
   */
  shoppingCartPage: async ({ page }, use) => {
    const cartPage = new ShoppingCartPage(page);
    await use(cartPage);
  },
});

// Re-export expect and other utilities
export { expect } from "@playwright/test";
export { createItem, calculateDiscount, formatPrice, calculateTotal } from "../utils/helpers";
export { ShoppingCartController } from "../controllers/shopping-cart.controller";
export { ShoppingCartPage } from "../pages/shopping-cart.page";
