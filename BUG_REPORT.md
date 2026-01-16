# 🐛 Bug Report - Shopping Cart Application

## Bug #1: Discount Applied Only to First Item Instead of Total Subtotal

**Severity**: 🔴 **CRITICAL**

**Status**: Found  
**Found by**: API Test - "complete happy path - full cart lifecycle"  
**Date**: 2026-01-16

---

### Description
When applying a discount code to a cart with multiple items, the discount is calculated based only on the first item's subtotal instead of the entire cart subtotal.

### Steps to Reproduce
1. Create a new cart
2. Add multiple items to the cart:
   - Item 1: $50 x 2 = $100
   - Item 2: $75 x 1 = $75
   - **Total subtotal: $175**
3. Apply discount code "SAVE10" (10% discount)
4. Check the discount amount

### Expected Behavior
- Discount should be calculated on the **total subtotal** ($175)
- Expected discount: $175 * 10% = **$17.50**
- Expected total: $175 - $17.50 = **$157.50**

### Actual Behavior
- Discount is calculated on the **first item's subtotal only** ($100)
- Actual discount: $100 * 10% = **$10.00**
- Actual total: $175 - $10.00 = **$165.00**

### Impact
- **Financial Impact**: Customers receive less discount than advertised
- **Business Logic**: Incorrect calculation affects all discount codes (SAVE10, SAVE20, HALF)
- **User Experience**: Misleading discount display

### Root Cause
Located in `src/index.js` line 106:

```javascript
// Current (WRONG)
discount = (items[0].subtotal * discountPercent) / 100;

// Should be (CORRECT)
discount = (subtotal * discountPercent) / 100;
```

The code uses `items[0].subtotal` (first item only) instead of `subtotal` (total of all items).

### Test Evidence

```typescript
// Test that caught the bug
test("complete happy path - full cart lifecycle", async ({ shoppingCartController }) => {
  const { cartId } = await shoppingCartController.createCart();
  
  // Add items: $50x2 + $75x1 = $175
  await shoppingCartController.addItem(cartId, createItem({ name: "Item 1", price: 50, quantity: 2 }));
  await shoppingCartController.addItem(cartId, createItem({ name: "Item 2", price: 75, quantity: 1 }));
  
  // Apply 10% discount
  await shoppingCartController.applyDiscount(cartId, "SAVE10");
  
  const cart = await shoppingCartController.getCart(cartId);
  
  // Expected: 17.5, Actual: 10
  expect(cart.discount).toBe(calculateDiscount(175, 10)); // FAILS
});
```

### Error Output
```
Error: expect(received).toBe(expected)

Expected: 17.5
Received: 10
```
