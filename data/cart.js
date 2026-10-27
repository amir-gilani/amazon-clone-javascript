// ═══════════════════════════════════════════════════════════════════════════════════════
// CART DATA & LOCALSTORAGE MANAGEMENT
// Starts empty (0 items) unless the user explicitly adds products to cart
// ═══════════════════════════════════════════════════════════════════════════════════════
export let cart = [];

loadFromStorage();

export function loadFromStorage() {
  const stored = typeof localStorage !== "undefined" ? localStorage.getItem("cart") : null;
  if (!stored) {
    cart = [];
  } else {
    try {
      cart = JSON.parse(stored);
      if (!Array.isArray(cart)) {
        cart = [];
      } else {
        cart.forEach((item) => {
          item.quantity = Number(item.quantity) || 1;
        });
      }
    } catch (e) {
      cart = [];
    }
  }
}

function saveToStorage() {
  if (typeof localStorage !== "undefined") {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
}

// ═══════════════════════════════════════════════════════════════════════════════════════
// CART OPERATIONS
// ═══════════════════════════════════════════════════════════════════════════════════════

// ADD ITEM TO CART
export function addToCart(productId, quantity = 1) {
  const qty = Number(quantity) || 1;
  let matchingItem = cart.find((cartItem) => cartItem.productId === productId);

  if (matchingItem) {
    matchingItem.quantity = (Number(matchingItem.quantity) || 0) + qty;
  } else {
    cart.push({
      productId,
      quantity: qty,
      deliveryOptionId: "1",
    });
  }
  saveToStorage();
}

// ADD TO CART ANIMATION
let cartTimeoutId;
export function addToCartAnimation(productId) {
  const addToCartElm = document.querySelector(`.js-added-to-cart-${productId}`);
  if (!addToCartElm) return;

  addToCartElm.classList.add("js-added-to-cart");

  if (cartTimeoutId) {
    clearTimeout(cartTimeoutId);
  }

  cartTimeoutId = setTimeout(() => {
    addToCartElm.classList.remove("js-added-to-cart");
  }, 2000);
}

// GET SELECTED QUANTITY FROM DROPDOWN
export function selectorQunatityDropdown(productId) {
  const quantitySelectorElm = document.querySelector(
    `.js-quantity-selector-${productId}`
  );
  if (!quantitySelectorElm) return 1;
  const quantity = Number(quantitySelectorElm.value) || 1;
  return quantity;
}

// REMOVE ITEM FROM CART
export function removeFromCart(productId) {
  cart = cart.filter((cartItem) => cartItem.productId !== productId);
  saveToStorage();
}

// RESET CART (EMPTY CART COMPLETELY)
export function resetCart() {
  cart = [];
  saveToStorage();
}

// CALCULATE TOTAL CART QUANTITY
export function calculateCartQuantity() {
  let cartQuantity = 0;
  cart.forEach((cartItem) => {
    cartQuantity += Number(cartItem.quantity) || 0;
  });
  return cartQuantity;
}

// UPDATE ITEM QUANTITY
export function updateQuantity(productId, newQuantity) {
  const matchingItem = cart.find((cartItem) => cartItem.productId === productId);
  if (matchingItem) {
    matchingItem.quantity = Number(newQuantity) || 1;
    saveToStorage();
  }
}

// UPDATE DELIVERY OPTION
export function updateDeliveryOption(productId, deliveryOptionId) {
  const matchingItem = cart.find((cartItem) => cartItem.productId === productId);
  if (matchingItem) {
    matchingItem.deliveryOptionId = deliveryOptionId;
    saveToStorage();
  }
}

export function loadCart(fun) {
  if (fun) fun();
}
