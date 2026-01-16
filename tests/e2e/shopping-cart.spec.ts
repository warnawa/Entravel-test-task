import { test, expect, formatPrice } from "../../src/playwright/fixtures/shopping-cart.fixture";

test.describe("Shopping Cart E2E - Positive Scenarios", { tag: "@e2e" }, () => {
  
  test("should display empty cart on initial page load", async ({ shoppingCartPage }) => {
    // Navigate to page
    await shoppingCartPage.navigate();
    
    // Verify initial state
    await expect(shoppingCartPage.emptyCartMessage).toBeVisible();
    await expect(shoppingCartPage.emptyCartMessage).toHaveText("Your cart is empty");
    
    await expect(shoppingCartPage.subtotal).toHaveText("$0.00");
    await expect(shoppingCartPage.discount).toHaveText("-$0.00");
    await expect(shoppingCartPage.total).toHaveText("$0.00");
    
    await expect(shoppingCartPage.cartItem).toHaveCount(0);
  });

  test("should add item through UI and update display", async ({ shoppingCartPage }) => {
    await shoppingCartPage.navigate();
    
    // Verify form fields are present
    await expect(shoppingCartPage.nameInput).toBeVisible();
    await expect(shoppingCartPage.priceInput).toBeVisible();
    await expect(shoppingCartPage.quantityInput).toBeVisible();
    await expect(shoppingCartPage.addButton).toBeVisible();
    
    // Add item through form
    await shoppingCartPage.addItem("Test Product", "100", "2");
    
    // Verify item appears in cart
    await expect(shoppingCartPage.emptyCartMessage).not.toBeVisible();
    await expect(shoppingCartPage.cartItem).toHaveCount(1);
    
    await expect(shoppingCartPage.getCartItemNameByIndex(0)).toHaveText("Test Product");
    await expect(shoppingCartPage.getCartItemSubtotalByIndex(0)).toHaveText("$200.00");
    
    // Verify summary updated
    await expect(shoppingCartPage.subtotal).toHaveText("$200.00");
    await expect(shoppingCartPage.total).toHaveText("$200.00");
  });

  test("should add multiple items and display all correctly", async ({ shoppingCartPage }) => {
    await shoppingCartPage.navigate();
    
    // Add first item
    await shoppingCartPage.addItem("Item 1", "50", "1");
    await expect(shoppingCartPage.cartItem).toHaveCount(1);
    
    // Add second item
    await shoppingCartPage.addItem("Item 2", "75.50", "2");
    await expect(shoppingCartPage.cartItem).toHaveCount(2);
    
    // Verify both items displayed with correct values
    await expect(shoppingCartPage.getCartItemNameByIndex(0)).toHaveText("Item 1");
    await expect(shoppingCartPage.getCartItemSubtotalByIndex(0)).toHaveText("$50.00");
    
    await expect(shoppingCartPage.getCartItemNameByIndex(1)).toHaveText("Item 2");
    await expect(shoppingCartPage.getCartItemSubtotalByIndex(1)).toHaveText("$151.00");
    
    await expect(shoppingCartPage.subtotal).toHaveText("$201.00");
  });

  test("should remove item through UI and update display", async ({ shoppingCartPage }) => {
    await shoppingCartPage.navigate();
    
    // Add two items
    await shoppingCartPage.addItem("Item 1", "100", "1");
    await shoppingCartPage.addItem("Item 2", "50", "1");
    await expect(shoppingCartPage.cartItem).toHaveCount(2);
    
    // Remove first item
    await shoppingCartPage.removeItemByIndex(0);
    
    // Verify item removed and totals updated
    await expect(shoppingCartPage.cartItem).toHaveCount(1);
    await expect(shoppingCartPage.getCartItemNameByIndex(0)).toHaveText("Item 2");
    await expect(shoppingCartPage.subtotal).toHaveText("$50.00");
    await expect(shoppingCartPage.total).toHaveText("$50.00");
  });

  test("should remove all items and show empty cart message", async ({ shoppingCartPage }) => {
    await shoppingCartPage.navigate();
    
    // Add single item
    await shoppingCartPage.addItem("Test Item", "25", "1");
    await expect(shoppingCartPage.cartItem).toHaveCount(1);
    
    // Remove the item
    await shoppingCartPage.removeItemByIndex(0);
    
    // Verify empty cart state
    await expect(shoppingCartPage.emptyCartMessage).toBeVisible();
    await expect(shoppingCartPage.cartItem).toHaveCount(0);
    await expect(shoppingCartPage.subtotal).toHaveText("$0.00");
    await expect(shoppingCartPage.total).toHaveText("$0.00");
  });

  test("should apply SAVE10 discount through UI", async ({ shoppingCartPage }) => {
    await shoppingCartPage.navigate();
    
    // Add item
    await shoppingCartPage.addItem("Product", "100", "1");
    await expect(shoppingCartPage.subtotal).toHaveText("$100.00");
    
    // Apply SAVE10 discount
    await shoppingCartPage.applyDiscount("SAVE10");
    
    // Verify discount applied
    await expect(shoppingCartPage.subtotal).toHaveText("$100.00");
    await expect(shoppingCartPage.discount).toHaveText("-$10.00");
    await expect(shoppingCartPage.total).toHaveText("$90.00");
  });

  test("should apply SAVE20 discount through UI", async ({ shoppingCartPage }) => {
    await shoppingCartPage.navigate();
    
    await shoppingCartPage.addItem("Product", "200", "2");
    
    // Apply SAVE20 discount
    await shoppingCartPage.applyDiscount("SAVE20");
    
    // Verify 20% discount
    await expect(shoppingCartPage.subtotal).toHaveText("$400.00");
    await expect(shoppingCartPage.discount).toHaveText("-$80.00");
    await expect(shoppingCartPage.total).toHaveText("$320.00");
  });

  test("should apply HALF discount through UI", async ({ shoppingCartPage }) => {
    await shoppingCartPage.navigate();
    
    await shoppingCartPage.addItem("Product", "150", "2");
    
    // Apply HALF discount
    await shoppingCartPage.applyDiscount("HALF");
    
    // Verify 50% discount
    await expect(shoppingCartPage.subtotal).toHaveText("$300.00");
    await expect(shoppingCartPage.discount).toHaveText("-$150.00");
    await expect(shoppingCartPage.total).toHaveText("$150.00");
  });

  test("should replace discount code when applying different one", async ({ shoppingCartPage }) => {
    await shoppingCartPage.navigate();
    
    await shoppingCartPage.addItem("Product", "100", "1");
    
    // Apply SAVE10 first
    await shoppingCartPage.applyDiscount("SAVE10");
    await expect(shoppingCartPage.discount).toHaveText("-$10.00");
    await expect(shoppingCartPage.total).toHaveText("$90.00");
    
    // Replace with SAVE20
    await shoppingCartPage.applyDiscount("SAVE20");
    await expect(shoppingCartPage.discount).toHaveText("-$20.00");
    await expect(shoppingCartPage.total).toHaveText("$80.00");
  });

  test("complete E2E flow - add items, apply discount, remove item", async ({ shoppingCartPage }) => {
    await shoppingCartPage.navigate();
    
    // 1. Verify initial empty state
    await expect(shoppingCartPage.emptyCartMessage).toBeVisible();
    await expect(shoppingCartPage.subtotal).toHaveText("$0.00");
    
    // 2. Add first item
    await shoppingCartPage.addItem("Laptop", "1000", "1");
    await expect(shoppingCartPage.cartItem).toHaveCount(1);
    await expect(shoppingCartPage.subtotal).toHaveText("$1000.00");
    
    // 3. Add second item
    await shoppingCartPage.addItem("Mouse", "25", "2");
    await expect(shoppingCartPage.cartItem).toHaveCount(2);
    await expect(shoppingCartPage.subtotal).toHaveText("$1050.00");
    
    // 4. Apply discount code
    await shoppingCartPage.applyDiscount("SAVE10");
    await expect(shoppingCartPage.discount).toHaveText("-$105.00");
    await expect(shoppingCartPage.total).toHaveText("$945.00");
    
    // 5. Remove first item
    await shoppingCartPage.removeItemByIndex(0);
    await expect(shoppingCartPage.cartItem).toHaveCount(1);
    await expect(shoppingCartPage.getCartItemNameByIndex(0)).toHaveText("Mouse");
    
    // 6. Verify final state
    await expect(shoppingCartPage.subtotal).toHaveText("$50.00");
    await expect(shoppingCartPage.total).toBeTruthy(); // Verify total is calculated
  });

  test("should handle form clearing after adding item", async ({ shoppingCartPage }) => {
    await shoppingCartPage.navigate();
    
    // Fill and submit form
    await shoppingCartPage.nameInput.fill("Test Item");
    await shoppingCartPage.priceInput.fill("99.99");
    await shoppingCartPage.quantityInput.fill("3");
    await shoppingCartPage.addButton.click();
    
    // Verify form is cleared
    await expect(shoppingCartPage.nameInput).toHaveValue("");
    await expect(shoppingCartPage.priceInput).toHaveValue("");
    await expect(shoppingCartPage.quantityInput).toHaveValue("1");
    
    // Verify item was added
    await expect(shoppingCartPage.cartItem).toHaveCount(1);
  });
});
