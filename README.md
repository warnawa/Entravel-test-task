# Shopping Cart API

[![Playwright Tests](https://github.com/warnawa/Entravel-test-task/actions/workflows/playwright-tests.yml/badge.svg)](https://github.com/warnawa/Entravel-test-task/actions/workflows/playwright-tests.yml)

A simple shopping cart application with discount code functionality.

> **Test Task**: QA Automation framework created as technical assessment.  
> Based on requirements from: [YevheniiBezuhlyi/qa_test_task](https://github.com/YevheniiBezuhlyi/qa_test_task)

## Features

- Create a shopping cart
- Add items with name, price, and quantity
- Remove items from cart
- Apply discount codes (SAVE10, SAVE20, HALF)
- View order summary with subtotal, discount, and total

## Running with Docker

### Prerequisites

- Docker
- Docker Compose

### Start the Application

```bash
docker compose up --build
```

The application will be available at `http://localhost:3000`

### Stop the Application

```bash
docker compose down
```

## Running Locally (without Docker)

### Prerequisites

- Node.js 18+

### Install Dependencies

```bash
npm install
```

### Start the Server

```bash
npm start
```

## API Endpoints

### Create Cart
```
POST /cart
Response: { "cartId": "uuid" }
```

### Get Cart
```
GET /cart/:cartId
Response: { "items": [...], "subtotal": 0, "discount": 0, "total": 0 }
```

### Add Item
```
POST /cart/:cartId/items
Body: { "name": "string", "price": number, "quantity": number }
```

### Remove Item
```
DELETE /cart/:cartId/items/:itemId
```

### Apply Discount
```
POST /cart/:cartId/discount
Body: { "code": "SAVE10" | "SAVE20" | "HALF" }
```

### Health Check
```
GET /health
```

## Discount Codes

| Code   | Discount |
|--------|----------|
| SAVE10 | 10% off  |
| SAVE20 | 20% off  |
| HALF   | 50% off  |

---

## 🧪 Running Tests

This project includes comprehensive automated tests using Playwright.

### Prerequisites for Testing

- Node.js 18+
- Playwright installed (`npm install`)

### Test Commands

```bash
# Install test dependencies
npm install

# Run all tests (API Positive + API Negative + E2E)
npm test

# Run API positive tests only
npm run test:api

# Run API negative tests only
npx playwright test --grep @api-negative

# Run E2E tests only
npm run test:e2e

# Run tests in UI mode (interactive)
npm run test:ui

# Run tests in headed mode (see browser)
npm run test:headed

# Debug specific test
npm run test:debug

# View test report
npm run test:report
```

### Test Structure

```
tests/
├── api/
│   ├── shopping-cart.spec.ts          # API positive tests (13 tests)
│   └── shopping-cart-negative.spec.ts # API negative tests (17 tests)
└── e2e/
    └── shopping-cart.spec.ts           # E2E/UI tests (11 tests)

src/playwright/
├── controllers/            # API controllers (SOLID)
├── pages/                  # Page Object Model
├── fixtures/               # Test fixtures (DI)
├── utils/                  # Helper functions
└── types/                  # TypeScript types
```

### Test Reports

After running tests, view detailed reports:
- HTML Report: `npm run test:report`
- Bug Report: See `BUG_REPORT.md`
- Test Report: See `TEST_REPORT.md`

### Test Coverage

✅ **API Endpoints**: 100% coverage (6/6 endpoints)  
✅ **Positive Scenarios**: 24 tests (13 API + 11 E2E)  
✅ **Negative Scenarios**: 17 tests (validation, 404, boundaries)  
✅ **Discount Codes**: All codes tested (SAVE10, SAVE20, HALF)  
✅ **CRUD Operations**: Complete coverage  
✅ **Edge Cases**: Price 0, quantity 1, multiple items  
✅ **UI Flows**: Full E2E scenarios

**Total Tests**: 41 | **Pass Rate**: 95.1% (39 passed, 2 failed due to known bug)

### Known Issues

🐛 **Bug #1** (CRITICAL): Discount calculation applies to first item only instead of total.  
See `BUG_REPORT.md` for details.