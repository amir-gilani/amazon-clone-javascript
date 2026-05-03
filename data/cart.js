export let cart = JSON.parse(localStorage.getItem('cart')) || [
  {
    productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
    quantity: 2,
  },
  {
    productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
    quantity: 1,
  },
];

function saveToStorage() {
  localStorage.setItem('cart', JSON.stringify(cart))
}

export function addToCart(productId, quantity) {
  let matchingItem;

  //Check if product already exists in cart
  cart.forEach((cartItem) => {
    if (cartItem.productId === productId) {
      matchingItem = cartItem;
    }
  });

  //Update quantity if exists, or add new item
  if (matchingItem) {
    matchingItem.quantity += quantity;
  } else {
    cart.push({
      productId,
      quantity,
    });
  }
  saveToStorage();
}

//Single timeout ID - clears previous timeout on every click
let cartTimeoutId;

export function addToCartAnimation(productId) {
  //FIXED: Target correct "Added" element per product
  const addToCartElm = document.querySelector(`.js-added-to-cart-${productId}`);

  //Show "Added" animation
  addToCartElm.classList.add("js-added-to-cart");

  //FIXED: Clear PREVIOUS timeout (prevents overlap)
  if (cartTimeoutId) {
    clearTimeout(cartTimeoutId);
  }

  //Set NEW 2-second timeout (always 2s from last click)
  cartTimeoutId = setTimeout(() => {
    addToCartElm.classList.remove("js-added-to-cart");
  }, 2000);

  saveToStorage();
}

export function selectorQunatityDropdown(productId) {
  //Get SELECTED quantity value from dropdown
  const quantitySelectorElm = document.querySelector(
    `.js-quantity-selector-${productId}`,
  ).value;

  //Convert string quantity to number
  const quantity = Number(quantitySelectorElm);
  return quantity;
}

export function removeFromCart(productId) {
  const newCart = [];

  cart.forEach((cartItem) => {
    if (cartItem.productId !== productId) {
      newCart.push(cartItem);
    }
  });

  cart = newCart;
  saveToStorage();
}
