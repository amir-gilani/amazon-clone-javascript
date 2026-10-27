// ═══════════════════════════════════════════════════════════════════════════════════════
// CART DATA & LOCALSTORAGE MANAGEMENT
// Starts empty (0 items) unless the user explicitly adds products to cart
// ═══════════════════════════════════════════════════════════════════════════════════════
export let cart = [];

// One-time reset to fulfill user request to start fresh from 0 items
if (typeof localStorage !== "undefined" && !localStorage.getItem("cart_fresh_reset_v4")) {
  localStorage.setItem("cart", JSON.stringify([]));
  localStorage.setItem("cart_fresh_reset_v4", "true");
}

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
  let matchingItem = cart.find((cartItem) => cartItem.productId === productId);

  if (matchingItem) {
    matchingItem.quantity += quantity;
  } else {
    cart.push({
      productId,
      quantity,
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
    matchingItem.quantity = newQuantity;
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
