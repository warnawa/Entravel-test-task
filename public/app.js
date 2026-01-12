let cartId = null;

async function initCart() {
  try {
    const response = await fetch('/cart', { method: 'POST' });
    const data = await response.json();
    cartId = data.cartId;
    updateCartDisplay();
  } catch (error) {
    console.error('Failed to initialize cart:', error);
  }
}

async function addItem(name, price, quantity) {
  if (!cartId) return;

  try {
    const response = await fetch(`/cart/${cartId}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, price, quantity })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error);
    }

    await updateCartDisplay();
  } catch (error) {
    alert('Error adding item: ' + error.message);
  }
}

async function removeItem(itemId) {
  if (!cartId) return;

  try {
    await fetch(`/cart/${cartId}/items/${itemId}`, { method: 'DELETE' });
    await updateCartDisplay();
  } catch (error) {
    console.error('Failed to remove item:', error);
  }
}

async function applyDiscount(code) {
  if (!cartId) return;

  try {
    const response = await fetch(`/cart/${cartId}/discount`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error);
    }

    await updateCartDisplay();
    alert('Discount code applied!');
  } catch (error) {
    alert('Error: ' + error.message);
  }
}

async function updateCartDisplay() {
  if (!cartId) return;

  try {
    const response = await fetch(`/cart/${cartId}`);
    const cart = await response.json();

    const cartItemsEl = document.getElementById('cartItems');

    if (cart.items.length === 0) {
      cartItemsEl.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
    } else {
      cartItemsEl.innerHTML = cart.items.map(item => `
        <div class="cart-item">
          <div class="cart-item-info">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-details">$${item.price.toFixed(2)} x ${item.quantity}</div>
          </div>
          <span class="cart-item-subtotal">$${item.subtotal.toFixed(2)}</span>
          <button class="btn btn-danger" onclick="removeItem('${item.id}')">Remove</button>
        </div>
      `).join('');
    }

    document.getElementById('subtotal').textContent = `$${cart.subtotal.toFixed(2)}`;
    document.getElementById('discount').textContent = `-$${cart.discount.toFixed(2)}`;
    document.getElementById('total').textContent = `$${cart.total.toFixed(2)}`;

    if (cart.discountCode) {
      document.getElementById('discountCode').value = cart.discountCode;
    }
  } catch (error) {
    console.error('Failed to update cart:', error);
  }
}

document.getElementById('addItemForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('itemName').value;
  const price = parseFloat(document.getElementById('itemPrice').value);
  const quantity = parseInt(document.getElementById('itemQuantity').value);

  await addItem(name, price, quantity);

  document.getElementById('itemName').value = '';
  document.getElementById('itemPrice').value = '';
  document.getElementById('itemQuantity').value = '1';
});

document.getElementById('applyDiscount').addEventListener('click', () => {
  const code = document.getElementById('discountCode').value.trim().toUpperCase();
  if (code) {
    applyDiscount(code);
  }
});

initCart();
