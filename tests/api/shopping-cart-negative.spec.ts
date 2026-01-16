import { test, expect } from "../../src/playwright/fixtures/shopping-cart.fixture";

test.describe("Shopping Cart API - Negative Scenarios", { tag: "@api-negative" }, () => {
  
  test.beforeEach("Health check before each test", async ({ shoppingCartController }) => {
    await shoppingCartController.healthCheck();
  });

  test.describe("Invalid Item Data", () => {
    
    test("should reject item with negative price", async ({ request }) => {
      // Create cart
      const cartResponse = await request.post("http://localhost:3000/cart");
      const { cartId } = await cartResponse.json();
      
      // Try to add item with negative price
      const response = await request.post(`http://localhost:3000/cart/${cartId}/items`, {
        headers: { "Content-Type": "application/json" },
        data: JSON.stringify({ name: "Item", price: -10, quantity: 1 }),
      });
      
      expect(response.status()).toBe(400);
      const error = await response.json();
      expect(error.error).toBeTruthy();
    });

    test("should reject item with zero quantity", async ({ request }) => {
      const cartResponse = await request.post("http://localhost:3000/cart");
      const { cartId } = await cartResponse.json();
      
      // Try to add item with zero quantity
      const response = await request.post(`http://localhost:3000/cart/${cartId}/items`, {
        headers: { "Content-Type": "application/json" },
        data: JSON.stringify({ name: "Item", price: 100, quantity: 0 }),
      });
      
      expect(response.status()).toBe(400);
      const error = await response.json();
      expect(error.error).toContain("quantity");
    });

    test("should reject item with missing name", async ({ request }) => {
      const cartResponse = await request.post("http://localhost:3000/cart");
      const { cartId } = await cartResponse.json();
      
      // Try to add item without name
      const response = await request.post(`http://localhost:3000/cart/${cartId}/items`, {
        headers: { "Content-Type": "application/json" },
        data: JSON.stringify({ price: 100, quantity: 1 }),
      });
      
      expect(response.status()).toBe(400);
    });

    test("should reject item with empty name", async ({ request }) => {
      const cartResponse = await request.post("http://localhost:3000/cart");
      const { cartId } = await cartResponse.json();
      
      // Try to add item with empty name
      const response = await request.post(`http://localhost:3000/cart/${cartId}/items`, {
        headers: { "Content-Type": "application/json" },
        data: JSON.stringify({ name: "", price: 100, quantity: 1 }),
      });
      
      expect(response.status()).toBe(400);
    });

    test("should reject item with non-numeric price", async ({ request }) => {
      const cartResponse = await request.post("http://localhost:3000/cart");
      const { cartId } = await cartResponse.json();
      
      // Try to add item with string price
      const response = await request.post(`http://localhost:3000/cart/${cartId}/items`, {
        headers: { "Content-Type": "application/json" },
        data: JSON.stringify({ name: "Item", price: "not-a-number", quantity: 1 }),
      });
      
      expect(response.status()).toBe(400);
    });

    test("should reject item with non-numeric quantity", async ({ request }) => {
      const cartResponse = await request.post("http://localhost:3000/cart");
      const { cartId } = await cartResponse.json();
      
      // Try to add item with string quantity
      const response = await request.post(`http://localhost:3000/cart/${cartId}/items`, {
        headers: { "Content-Type": "application/json" },
        data: JSON.stringify({ name: "Item", price: 100, quantity: "two" }),
      });
      
      expect(response.status()).toBe(400);
    });
  });

  test.describe("Invalid Discount Codes", () => {
    
    test("should reject empty discount code", async ({ request }) => {
      const cartResponse = await request.post("http://localhost:3000/cart");
      const { cartId } = await cartResponse.json();
      
      // Try to apply empty discount code
      const response = await request.post(`http://localhost:3000/cart/${cartId}/discount`, {
        headers: { "Content-Type": "application/json" },
        data: JSON.stringify({ code: "" }),
      });
      
      expect(response.status()).toBe(400);
    });

    test("should reject invalid discount code", async ({ request }) => {
      const cartResponse = await request.post("http://localhost:3000/cart");
      const { cartId } = await cartResponse.json();
      
      // Try to apply non-existent discount code
      const response = await request.post(`http://localhost:3000/cart/${cartId}/discount`, {
        headers: { "Content-Type": "application/json" },
        data: JSON.stringify({ code: "INVALID_CODE" }),
      });
      
      expect(response.status()).toBe(400);
      const error = await response.json();
      expect(error.error).toContain("Invalid discount code");
    });

    test("should reject discount code without code field", async ({ request }) => {
      const cartResponse = await request.post("http://localhost:3000/cart");
      const { cartId } = await cartResponse.json();
      
      // Try to apply discount without code field
      const response = await request.post(`http://localhost:3000/cart/${cartId}/discount`, {
        headers: { "Content-Type": "application/json" },
        data: JSON.stringify({}),
      });
      
      expect(response.status()).toBe(400);
    });
  });

  test.describe("Non-existent Resources", () => {
    
    test("should return 404 for non-existent cart", async ({ request }) => {
      // Try to get non-existent cart
      const response = await request.get("http://localhost:3000/cart/fake-cart-id");
      
      expect(response.status()).toBe(404);
      const error = await response.json();
      expect(error.error).toContain("Cart not found");
    });

    test("should return 404 when adding item to non-existent cart", async ({ request }) => {
      // Try to add item to non-existent cart
      const response = await request.post("http://localhost:3000/cart/fake-cart-id/items", {
        headers: { "Content-Type": "application/json" },
        data: JSON.stringify({ name: "Item", price: 100, quantity: 1 }),
      });
      
      expect(response.status()).toBe(404);
    });

    test("should return 404 when removing non-existent item", async ({ request }) => {
      const cartResponse = await request.post("http://localhost:3000/cart");
      const { cartId } = await cartResponse.json();
      
      // Try to remove non-existent item
      const response = await request.delete(`http://localhost:3000/cart/${cartId}/items/fake-item-id`);
      
      expect(response.status()).toBe(404);
    });

    test("should return 404 when applying discount to non-existent cart", async ({ request }) => {
      // Try to apply discount to non-existent cart
      const response = await request.post("http://localhost:3000/cart/fake-cart-id/discount", {
        headers: { "Content-Type": "application/json" },
        data: JSON.stringify({ code: "SAVE10" }),
      });
      
      expect(response.status()).toBe(404);
    });
  });

  test.describe("Boundary Violations", () => {
    
    test("should handle extremely large price", async ({ request }) => {
      const cartResponse = await request.post("http://localhost:3000/cart");
      const { cartId } = await cartResponse.json();
      
      // Try to add item with very large price
      const response = await request.post(`http://localhost:3000/cart/${cartId}/items`, {
        headers: { "Content-Type": "application/json" },
        data: JSON.stringify({ name: "Item", price: Number.MAX_SAFE_INTEGER, quantity: 1 }),
      });
      
      // Should either accept or reject gracefully (not crash)
      expect([200, 201, 400]).toContain(response.status());
    });

    test("should handle extremely large quantity", async ({ request }) => {
      const cartResponse = await request.post("http://localhost:3000/cart");
      const { cartId } = await cartResponse.json();
      
      // Try to add item with very large quantity
      const response = await request.post(`http://localhost:3000/cart/${cartId}/items`, {
        headers: { "Content-Type": "application/json" },
        data: JSON.stringify({ name: "Item", price: 10, quantity: 999999 }),
      });
      
      // Should either accept or reject gracefully
      expect([200, 201, 400]).toContain(response.status());
    });

    test("should handle negative quantity", async ({ request }) => {
      const cartResponse = await request.post("http://localhost:3000/cart");
      const { cartId } = await cartResponse.json();
      
      // Try to add item with negative quantity
      const response = await request.post(`http://localhost:3000/cart/${cartId}/items`, {
        headers: { "Content-Type": "application/json" },
        data: JSON.stringify({ name: "Item", price: 100, quantity: -5 }),
      });
      
      expect(response.status()).toBe(400);
    });

    test("should handle fractional quantity", async ({ request }) => {
      const cartResponse = await request.post("http://localhost:3000/cart");
      const { cartId } = await cartResponse.json();
      
      // Try to add item with fractional quantity
      const response = await request.post(`http://localhost:3000/cart/${cartId}/items`, {
        headers: { "Content-Type": "application/json" },
        data: JSON.stringify({ name: "Item", price: 100, quantity: 1.5 }),
      });
      
      // Should either accept (rounding) or reject
      expect([200, 201, 400]).toContain(response.status());
    });
  });
});
