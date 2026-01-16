/**
 * Raw item data for creating new items (without ID)
 */
export interface RawItem {
  name: string;
  price: number;
  quantity: number;
}

/**
 * Item with generated ID after creation
 */
export interface Item extends RawItem {
  id: string;
}

/**
 * Cart item with calculated subtotal
 */
export interface CartItem extends Item {
  subtotal: number;
}

/**
 * Complete cart object with summary
 */
export interface Cart {
  items: CartItem[];
  subtotal: number;
  discountCode: string | null;
  discount: number;
  total: number;
}

/**
 * Available discount codes
 */
export type DiscountCode = "SAVE10" | "SAVE20" | "HALF";

/**
 * Response from applying discount
 */
export interface DiscountResponse {
  message: string;
  discount: string;
}

/**
 * Health check response
 */
export interface HealthResponse {
  status: string;
}
