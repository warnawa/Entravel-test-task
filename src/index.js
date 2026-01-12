const express = require('express');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

const carts = new Map();

const discountCodes = {
  'SAVE10': 10,
  'SAVE20': 20,
  'HALF': 50
};

app.post('/cart', (req, res) => {
  const cartId = uuidv4();
  carts.set(cartId, { items: [], discountCode: null });
  res.status(201).json({ cartId });
});

app.get('/cart/:cartId', (req, res) => {
  const cart = carts.get(req.params.cartId);
  if (!cart) {
    return res.status(404).json({ error: 'Cart not found' });
  }

  const summary = calculateCartSummary(cart);
  res.json(summary);
});

app.post('/cart/:cartId/items', (req, res) => {
  const cart = carts.get(req.params.cartId);
  if (!cart) {
    return res.status(404).json({ error: 'Cart not found' });
  }

  const { name, price, quantity } = req.body;

  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: 'Invalid item name' });
  }

  if (typeof price !== 'number' || price < 0) {
    return res.status(400).json({ error: 'Invalid price' });
  }

  if (typeof quantity !== 'number' || quantity < 1) {
    return res.status(400).json({ error: 'Invalid quantity' });
  }

  const item = {
    id: uuidv4(),
    name,
    price,
    quantity
  };

  cart.items.push(item);
  res.status(201).json(item);
});

app.delete('/cart/:cartId/items/:itemId', (req, res) => {
  const cart = carts.get(req.params.cartId);
  if (!cart) {
    return res.status(404).json({ error: 'Cart not found' });
  }

  const itemIndex = cart.items.findIndex(item => item.id === req.params.itemId);
  if (itemIndex === -1) {
    return res.status(404).json({ error: 'Item not found' });
  }

  cart.items.splice(itemIndex, 1);
  res.status(204).send();
});

app.post('/cart/:cartId/discount', (req, res) => {
  const cart = carts.get(req.params.cartId);
  if (!cart) {
    return res.status(404).json({ error: 'Cart not found' });
  }

  const { code } = req.body;

  if (!code || !discountCodes[code]) {
    return res.status(400).json({ error: 'Invalid discount code' });
  }

  cart.discountCode = code;
  res.json({ message: 'Discount code applied', discount: `${discountCodes[code]}%` });
});

function calculateCartSummary(cart) {
  const items = cart.items.map(item => ({
    ...item,
    subtotal: item.price * item.quantity
  }));

  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);

  let discount = 0;
  if (cart.discountCode && items.length > 0) {
    const discountPercent = discountCodes[cart.discountCode];
    discount = (items[0].subtotal * discountPercent) / 100;
  }

  const total = subtotal - discount;

  return {
    items,
    subtotal: Math.round(subtotal * 100) / 100,
    discountCode: cart.discountCode,
    discount: Math.round(discount * 100) / 100,
    total: Math.round(total * 100) / 100
  };
}

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Shopping Cart API running on port ${PORT}`);
});
