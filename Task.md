# QA Automation Test Task

## Objective

Write automated tests for the Shopping Cart API application to verify its functionality and identify any potential bugs.

## Application Overview

This is a simple shopping cart web application that allows users to:
- Add items to a cart (with name, price, and quantity)
- Remove items from the cart
- Apply discount codes
- View order summary with calculated totals

## Requirements

### 1. Setup

- Run the application using Docker (`docker-compose up --build`)
- The application will be available at `http://localhost:3000`

### 2. Test Coverage

Write automated tests covering the following areas:

#### API Testing

Test the following endpoints:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/cart` | POST | Create a new cart |
| `/cart/:cartId` | GET | Get cart details and summary |
| `/cart/:cartId/items` | POST | Add item to cart |
| `/cart/:cartId/items/:itemId` | DELETE | Remove item from cart |
| `/cart/:cartId/discount` | POST | Apply discount code |
| `/health` | GET | Health check |

#### Functional Testing

- Cart creation and retrieval
- Adding items with valid data
- Adding items with invalid data (negative price, zero quantity, missing fields)
- Removing items from cart
- Applying valid discount codes (SAVE10, SAVE20, HALF)
- Applying invalid discount codes
- Cart total calculation accuracy
- Discount calculation accuracy

#### UI Testing (Optional)

- Form validation
- Adding items through the UI
- Removing items through the UI
- Applying discount codes through the UI
- Correct display of prices and totals

### 3. Discount Codes

The application supports the following discount codes:

| Code | Expected Discount |
|------|-------------------|
| SAVE10 | 10% off total |
| SAVE20 | 20% off total |
| HALF | 50% off total |

### 4. Deliverables

- Automated test suite (using a framework of your choice: Playwright, Cypress, Jest, Postman, etc.)
- Bug report documenting any issues found
- Brief summary of test coverage and results

### 5. Evaluation Criteria

- Test coverage completeness
- Code quality and organization
- Ability to identify bugs
- Clear bug reporting with reproduction steps
- Edge case consideration

## Time Limit

4 hours

## Notes

- Focus on both positive and negative test scenarios
- Pay attention to edge cases and boundary conditions
- Document any assumptions made during testing
