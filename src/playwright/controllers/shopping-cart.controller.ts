import { APIRequestContext, expect } from "@playwright/test";
import { BASE_URL } from "../../../playwright.config";
import {
  Cart,
  RawItem,
  Item,
  DiscountCode,
  DiscountResponse,
  HealthResponse,
} from "../types/cart.types";

/**
 * Shopping Cart API Controller
 * Handles all API interactions with shopping cart endpoints
 * Following Single Responsibility Principle - only API communication
 */
export class ShoppingCartController {
  constructor(private request: APIRequestContext) {}

  /**
   * Health check endpoint
   * @throws Error if health check fails
   */
  async healthCheck(): Promise<void> {
    const response = await this.request.get(`${BASE_URL}/health`);
    const body: HealthResponse = await response.json();

    expect(response.status(), "Health check should return 200").toBe(200);
    expect(body.status, "Health check status should be 'ok'").toBe("ok");
  }

  /**
   * Create new shopping cart
   * @returns Object containing cartId
   */
  async createCart(): Promise<{ cartId: string }> {
    const response = await this.request.post(`${BASE_URL}/cart`);
    
    expect(response.status(), "Cart creation should return 201").toBe(201);
    
    const body = await response.json();
    expect(body.cartId, "CartId should be present").toBeTruthy();
    
    return body;
  }

  /**
   * Get cart details by cartId
   * @param cartId - Cart identifier
   * @returns Complete cart object with items and summary
   */
  async getCart(cartId: string): Promise<Cart> {
    const response = await this.request.get(`${BASE_URL}/cart/${cartId}`);
    
    expect(response.status(), `Getting cart ${cartId} should return 200`).toBe(200);
    
    return response.json();
  }

  /**
   * Add item to cart
   * @param cartId - Cart identifier
   * @param item - Item data (name, price, quantity)
   * @returns Created item with ID
   */
  async addItem(cartId: string, item: RawItem): Promise<Item> {
    const response = await this.request.post(`${BASE_URL}/cart/${cartId}/items`, {
      headers: { "Content-Type": "application/json" },
      data: JSON.stringify(item),
    });
    
    expect(
      response.status(),
      `Adding item "${item.name}" should return 201`
    ).toBe(201);
    
    const body = await response.json();
    expect(body.id, "Item should have ID").toBeTruthy();
    expect(body.name, "Item name should match").toBe(item.name);
    expect(body.price, "Item price should match").toBe(item.price);
    expect(body.quantity, "Item quantity should match").toBe(item.quantity);
    
    return body;
  }

  /**
   * Remove item from cart
   * @param cartId - Cart identifier
   * @param itemId - Item identifier
   */
  async removeItem(cartId: string, itemId: string): Promise<void> {
    const response = await this.request.delete(
      `${BASE_URL}/cart/${cartId}/items/${itemId}`
    );
    
    expect(
      response.status(),
      `Removing item ${itemId} should return 204`
    ).toBe(204);
  }

  /**
   * Apply discount code to cart
   * @param cartId - Cart identifier
   * @param code - Discount code (SAVE10, SAVE20, HALF)
   * @returns Discount response with message and percentage
   */
  async applyDiscount(
    cartId: string,
    code: DiscountCode
  ): Promise<DiscountResponse> {
    const response = await this.request.post(
      `${BASE_URL}/cart/${cartId}/discount`,
      {
        headers: { "Content-Type": "application/json" },
        data: JSON.stringify({ code }),
      }
    );
    
    expect(
      response.status(),
      `Applying discount code "${code}" should return 200`
    ).toBe(200);
    
    return response.json();
  }

  /**
   * Get empty cart state for assertions
   * @returns Empty cart object
   */
  getEmptyCartState() {
    return {
      items: [],
      subtotal: 0,
      discountCode: null,
      discount: 0,
      total: 0,
    };
  }
}
