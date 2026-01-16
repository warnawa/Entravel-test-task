import { test, expect, createItem, calculateDiscount, calculateTotal } from "../../src/playwright/fixtures/shopping-cart.fixture";

test.describe("Shopping Cart API - Positive Scenarios", { tag: "@api" }, () => {
  
  test.beforeEach("Health check before each test", async ({ shoppingCartController }) => {
    await shoppingCartController.healthCheck();
  });

  test("should create empty cart and verify initial state", async ({ shoppingCartController }) => {
    // Create new cart
    const { cartId } = await shoppingCartController.createCart();
    
    expect(cartId).toBeTruthy();
    expect(typeof cartId).toBe("string");
  });

  test("should get empty cart with correct initial values", async ({ shoppingCartController }) => {
    const { cartId } = await shoppingCartController.createCart();
    
    // Verify empty cart state
    const cart = await shoppingCartController.getCart(cartId);
    const emptyState = shoppingCartController.getEmptyCartState();
    
    expect(cart).toMatchObject(emptyState);
    expect(cart.items).toHaveLength(0);
  });

  test("should add single item to cart and calculate subtotal correctly", async ({ shoppingCartController }) => {
    const { cartId } = await shoppingCartController.createCart();
    
    // Add item to cart
    const item = createItem({
      name: "Test Product",
      price: 100,
      quantity: 2,
    });
    
    const addedItem = await shoppingCartController.addItem(cartId, item);
    
    expect(addedItem.id).toBeTruthy();
    expect(addedItem.name).toBe(item.name);
    expect(addedItem.price).toBe(item.price);
    expect(addedItem.quantity).toBe(item.quantity);
    
    // Verify cart calculations
    const cart = await shoppingCartController.getCart(cartId);
    
    expect(cart.items).toHaveLength(1);
    expect(cart.subtotal).toBe(200);
    expect(cart.discount).toBe(0);
    expect(cart.total).toBe(200);
  });

  test("should add multiple items with different prices and quantities", async ({ shoppingCartController }) => {
    const { cartId } = await shoppingCartController.createCart();
    
    const items = [
      createItem({ name: "Item 1", price: 50, quantity: 2 }),
      createItem({ name: "Item 2", price: 30.5, quantity: 1 }),
      createItem({ name: "Item 3", price: 100, quantity: 3 }),
    ];
    
    // Add multiple items
    for (const item of items) {
      await shoppingCartController.addItem(cartId, item);
    }
    
    // Verify cart with multiple items
    const cart = await shoppingCartController.getCart(cartId);
    
    expect(cart.items).toHaveLength(3);
    
    const expectedSubtotal = 50 * 2 + 30.5 * 1 + 100 * 3;
    expect(cart.subtotal).toBe(expectedSubtotal);
    expect(cart.total).toBe(expectedSubtotal);
    
    cart.items.forEach((cartItem, index) => {
      expect(cartItem.name).toBe(items[index].name);
      expect(cartItem.subtotal).toBe(items[index].price * items[index].quantity);
    });
  });

  test("should remove item from cart and recalculate totals", async ({ shoppingCartController }) => {
    const { cartId } = await shoppingCartController.createCart();
    
    const item1 = createItem({ name: "Item 1", price: 100, quantity: 1 });
    const item2 = createItem({ name: "Item 2", price: 50, quantity: 2 });
    
    const addedItem1 = await shoppingCartController.addItem(cartId, item1);
    const addedItem2 = await shoppingCartController.addItem(cartId, item2);
    
    // Remove first item
    await shoppingCartController.removeItem(cartId, addedItem1.id);
    
    // Verify cart after removal
    const cart = await shoppingCartController.getCart(cartId);
    
    expect(cart.items).toHaveLength(1);
    expect(cart.items[0].name).toBe(item2.name);
    expect(cart.subtotal).toBe(100);
    expect(cart.total).toBe(100);
  });

  test("should apply SAVE10 discount code correctly", async ({ shoppingCartController }) => {
    const { cartId } = await shoppingCartController.createCart();
    const item = createItem({ name: "Product", price: 100, quantity: 1 });
    
    await shoppingCartController.addItem(cartId, item);
    
    // Apply SAVE10 discount
    const discountResponse = await shoppingCartController.applyDiscount(cartId, "SAVE10");
    
    expect(discountResponse.message).toBe("Discount code applied");
    expect(discountResponse.discount).toBe("10%");
    
    // Verify discount applied correctly
    const cart = await shoppingCartController.getCart(cartId);
    
    const expectedDiscount = calculateDiscount(100, 10);
    const expectedTotal = calculateTotal(100, 10);
    
    expect(cart.discountCode).toBe("SAVE10");
    expect(cart.discount).toBe(expectedDiscount);
    expect(cart.total).toBe(expectedTotal);
  });

  test("should apply SAVE20 discount code correctly", async ({ shoppingCartController }) => {
    const { cartId } = await shoppingCartController.createCart();
    const item = createItem({ name: "Product", price: 200, quantity: 2 });
    
    await shoppingCartController.addItem(cartId, item);
    
    // Apply SAVE20 discount
    await shoppingCartController.applyDiscount(cartId, "SAVE20");
    
    // Verify discount calculations
    const cart = await shoppingCartController.getCart(cartId);
    
    expect(cart.subtotal).toBe(400);
    expect(cart.discount).toBe(calculateDiscount(400, 20));
    expect(cart.total).toBe(calculateTotal(400, 20));
  });

  test("should apply HALF discount code correctly", async ({ shoppingCartController }) => {
    const { cartId } = await shoppingCartController.createCart();
    const item = createItem({ name: "Product", price: 150, quantity: 2 });
    
    await shoppingCartController.addItem(cartId, item);
    
    // Apply HALF discount
    await shoppingCartController.applyDiscount(cartId, "HALF");
    
    // Verify 50% discount
    const cart = await shoppingCartController.getCart(cartId);
    
    expect(cart.subtotal).toBe(300);
    expect(cart.discount).toBe(calculateDiscount(300, 50));
    expect(cart.total).toBe(calculateTotal(300, 50));
  });

  test("should handle discount code replacement", async ({ shoppingCartController }) => {
    const { cartId } = await shoppingCartController.createCart();
    const item = createItem({ name: "Product", price: 100, quantity: 1 });
    
    await shoppingCartController.addItem(cartId, item);
    
    // Apply SAVE10 then replace with SAVE20
    await shoppingCartController.applyDiscount(cartId, "SAVE10");
    
    let cart = await shoppingCartController.getCart(cartId);
    expect(cart.discountCode).toBe("SAVE10");
    expect(cart.discount).toBe(10);
    
    await shoppingCartController.applyDiscount(cartId, "SAVE20");
    
    cart = await shoppingCartController.getCart(cartId);
    expect(cart.discountCode).toBe("SAVE20");
    expect(cart.discount).toBe(20);
  });

  test("should handle edge case - item with price 0", async ({ shoppingCartController }) => {
    const { cartId } = await shoppingCartController.createCart();
    
    // Add item with price 0
    const item = createItem({ name: "Free Item", price: 0, quantity: 1 });
    await shoppingCartController.addItem(cartId, item);
    
    // Verify cart with zero price item
    const cart = await shoppingCartController.getCart(cartId);
    
    expect(cart.items).toHaveLength(1);
    expect(cart.subtotal).toBe(0);
    expect(cart.total).toBe(0);
  });

  test("should handle edge case - minimum quantity", async ({ shoppingCartController }) => {
    const { cartId } = await shoppingCartController.createCart();
    
    // Add item with quantity 1
    const item = createItem({ name: "Single Item", price: 99.99, quantity: 1 });
    await shoppingCartController.addItem(cartId, item);
    
    // Verify calculations with single quantity
    const cart = await shoppingCartController.getCart(cartId);
    
    expect(cart.items[0].quantity).toBe(1);
    expect(cart.subtotal).toBe(99.99);
  });

  test("should create multiple independent carts", async ({ shoppingCartController }) => {
    // Create and verify multiple carts are independent
    const { cartId: cartId1 } = await shoppingCartController.createCart();
    const { cartId: cartId2 } = await shoppingCartController.createCart();
    
    expect(cartId1).not.toBe(cartId2);
    
    const item1 = createItem({ name: "Cart 1 Item", price: 10, quantity: 1 });
    const item2 = createItem({ name: "Cart 2 Item", price: 20, quantity: 1 });
    
    await shoppingCartController.addItem(cartId1, item1);
    await shoppingCartController.addItem(cartId2, item2);
    
    const cart1 = await shoppingCartController.getCart(cartId1);
    const cart2 = await shoppingCartController.getCart(cartId2);
    
    expect(cart1.items).toHaveLength(1);
    expect(cart2.items).toHaveLength(1);
    expect(cart1.subtotal).toBe(10);
    expect(cart2.subtotal).toBe(20);
  });

  test("complete happy path - full cart lifecycle", async ({ shoppingCartController }) => {
    let cartId: string;
    
    // 1. Create cart
    ({ cartId } = await shoppingCartController.createCart());
    const cart = await shoppingCartController.getCart(cartId);
    expect(cart.items).toHaveLength(0);
    
    // 2. Add multiple items
    await shoppingCartController.addItem(cartId, createItem({ name: "Item 1", price: 50, quantity: 2 }));
    await shoppingCartController.addItem(cartId, createItem({ name: "Item 2", price: 75, quantity: 1 }));
    
    let updatedCart = await shoppingCartController.getCart(cartId);
    expect(updatedCart.items).toHaveLength(2);
    expect(updatedCart.subtotal).toBe(175);
    
    // 3. Apply discount
    await shoppingCartController.applyDiscount(cartId, "SAVE10");
    
    updatedCart = await shoppingCartController.getCart(cartId);
    expect(updatedCart.discount).toBe(calculateDiscount(175, 10));
    expect(updatedCart.total).toBe(calculateTotal(175, 10));
    
    // 4. Remove one item
    const firstItemId = updatedCart.items[0].id;
    
    await shoppingCartController.removeItem(cartId, firstItemId);
    
    const finalCart = await shoppingCartController.getCart(cartId);
    expect(finalCart.items).toHaveLength(1);
    expect(finalCart.subtotal).toBe(75);
  });
});
