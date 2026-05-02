export const cart = [];

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
}

//Single timeout ID - clears previous timeout on every click
let cartTimeoutId;

export function addToCartAnimation(productId) {
  //FIXED: Target correct "Added" element per product
  const addToCartElm = document.querySelector(`.js-added-to-cart-${productId}`);

  //Show "Added" animation
  addToCartElm.classList.add('js-added-to-cart');

  //FIXED: Clear PREVIOUS timeout (prevents overlap)
  if (cartTimeoutId) {
    clearTimeout(cartTimeoutId);
  }

  //Set NEW 2-second timeout (always 2s from last click)
  cartTimeoutId = setTimeout(() => {
    addToCartElm.classList.remove('js-added-to-cart');
  }, 2000);
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