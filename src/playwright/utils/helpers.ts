import { RawItem } from "../types/cart.types";

/**
 * Factory function to create test item data with default values
 * @param overrides - Partial item data to override defaults
 * @returns Complete RawItem object
 */
export const createItem = (overrides: Partial<RawItem> = {}): RawItem => {
  return {
    name: "Default Test Item",
    price: 10,
    quantity: 1,
    ...overrides,
  };
};

/**
 * Calculate discount amount based on percentage
 * @param subtotal - Cart subtotal
 * @param percent - Discount percentage (10, 20, 50)
 * @returns Discount amount rounded to 2 decimal places
 */
export const calculateDiscount = (subtotal: number, percent: number): number => {
  return Math.round((subtotal * percent) / 100 * 100) / 100;
};

/**
 * Format price to USD string with 2 decimal places
 * @param price - Price to format
 * @returns Formatted price string (e.g., "$100.00")
 */
export const formatPrice = (price: number): string => {
  return `$${price.toFixed(2)}`;
};

/**
 * Calculate expected total after discount
 * @param subtotal - Cart subtotal
 * @param discountPercent - Discount percentage
 * @returns Total amount after discount
 */
export const calculateTotal = (subtotal: number, discountPercent: number): number => {
  const discount = calculateDiscount(subtotal, discountPercent);
  return Math.round((subtotal - discount) * 100) / 100;
};
