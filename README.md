# Shopping Cart API

A simple shopping cart application with discount code functionality.

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
docker-compose up --build
```

The application will be available at `http://localhost:3000`

### Stop the Application

```bash
docker-compose down
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
