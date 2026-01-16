import { Page, Locator } from "@playwright/test";
import { BASE_URL } from "../../../playwright.config";

/**
 * Shopping Cart Page Object
 * Encapsulates all UI interactions with shopping cart page
 * Using data-testid for stable, reliable locators
 */
export class ShoppingCartPage {
  // Form elements
  readonly addItemForm: Locator;
  readonly nameInput: Locator;
  readonly priceInput: Locator;
  readonly quantityInput: Locator;
  readonly addButton: Locator;

  // Cart items
  readonly cartItems: Locator;
  readonly cartItem: Locator;
  readonly emptyCartMessage: Locator;
  readonly cartItemName: Locator;
  readonly cartItemDetails: Locator;
  readonly cartItemSubtotal: Locator;
  readonly removeButton: Locator;

  // Discount
  readonly discountInput: Locator;
  readonly applyDiscountButton: Locator;

  // Summary
  readonly orderSummary: Locator;
  readonly subtotal: Locator;
  readonly discount: Locator;
  readonly total: Locator;

  constructor(private page: Page) {
    // Form elements - using data-testid
    this.addItemForm = page.getByTestId("add-item-form");
    this.nameInput = page.getByTestId("item-name-input");
    this.priceInput = page.getByTestId("item-price-input");
    this.quantityInput = page.getByTestId("item-quantity-input");
    this.addButton = page.getByTestId("add-item-button");

    // Cart items
    this.cartItems = page.getByTestId("cart-items");
    this.cartItem = page.getByTestId("cart-item");
    this.emptyCartMessage = page.getByTestId("empty-cart-message");
    this.cartItemName = page.getByTestId("cart-item-name");
    this.cartItemDetails = page.getByTestId("cart-item-details");
    this.cartItemSubtotal = page.getByTestId("cart-item-subtotal");
    this.removeButton = page.getByTestId("remove-item-button");

    // Discount
    this.discountInput = page.getByTestId("discount-code-input");
    this.applyDiscountButton = page.getByTestId("apply-discount-button");

    // Summary
    this.orderSummary = page.getByTestId("order-summary");
    this.subtotal = page.getByTestId("subtotal");
    this.discount = page.getByTestId("discount");
    this.total = page.getByTestId("total");
  }

  /**
   * Navigate to shopping cart page
   */
  async navigate(): Promise<void> {
    await this.page.goto(BASE_URL);
  }

  /**
   * Add item to cart through UI
   * @param name - Item name
   * @param price - Item price
   * @param quantity - Item quantity
   */
  async addItem(name: string, price: string, quantity: string): Promise<void> {
    await this.nameInput.fill(name);
    await this.priceInput.fill(price);
    await this.quantityInput.fill(quantity);
    await this.addButton.click();
  }

  /**
   * Apply discount code through UI
   * @param code - Discount code
   */
  async applyDiscount(code: string): Promise<void> {
    await this.discountInput.fill(code);
    await this.applyDiscountButton.click();
  }

  /**
   * Remove item by index
   * @param index - Item index (0-based)
   */
  async removeItemByIndex(index: number = 0): Promise<void> {
    await this.removeButton.nth(index).click();
  }

  /**
   * Get specific cart item by index
   * @param index - Item index
   * @returns Locator for specific cart item
   */
  getCartItemByIndex(index: number): Locator {
    return this.cartItem.nth(index);
  }

  /**
   * Get cart item name by index
   * @param index - Item index
   * @returns Locator for item name
   */
  getCartItemNameByIndex(index: number): Locator {
    return this.cartItemName.nth(index);
  }

  /**
   * Get cart item subtotal by index
   * @param index - Item index
   * @returns Locator for item subtotal
   */
  getCartItemSubtotalByIndex(index: number): Locator {
    return this.cartItemSubtotal.nth(index);
  }
}
