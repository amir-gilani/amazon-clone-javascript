// ═══════════════════════════════════════════════════════════════════════════════════════
// CART DATA & LOCALSTORAGE MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════════════════
export let cart;

loadFromStorage();

export function loadFromStorage() {
  const stored = typeof localStorage !== "undefined" ? localStorage.getItem("cart") : null;
  if (!stored) {
    cart = [
      {
        productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
        quantity: 2,
        deliveryOptionId: "1",
      },
      {
        productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
        quantity: 1,
        deliveryOptionId: "1",
      },
    ];
  } else {
    try {
      cart = JSON.parse(stored);
      const hasCustom = Array.isArray(cart) && cart.some(item =>
        item.productId === "pawz-womens-nomad-boots" ||
        item.productId === "ez-rider-miracle-boots" ||
        (typeof item.productId === "string" && (item.productId.startsWith("rec-") || item.productId.startsWith("car-")))
      );
      if (hasCustom || !Array.isArray(cart) || cart.length === 0) {
        cart = [
          {
            productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
            quantity: 2,
            deliveryOptionId: "1",
          },
          {
            productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
            quantity: 1,
            deliveryOptionId: "1",
          },
        ];
        saveToStorage();
      }
    } catch (e) {
      cart = [
        {
          productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
          quantity: 2,
          deliveryOptionId: "1",
        },
        {
          productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
          quantity: 1,
          deliveryOptionId: "1",
        },
      ];
    }
  }
}
function saveToStorage() {
  if (typeof localStorage !== "undefined") { localStorage.setItem("cart", JSON.stringify(cart)); }
}

// ═══════════════════════════════════════════════════════════════════════════════════════
// CART OPERATIONS
// ═══════════════════════════════════════════════════════════════════════════════════════

// ADD ITEM TO CART
export function addToCart(productId, quantity) {
  let matchingItem;

  // CHECK IF PRODUCT ALREADY EXISTS IN CART
  cart.forEach((cartItem) => {
    if (cartItem.productId === productId) {
      matchingItem = cartItem;
    }
  });

  // UPDATE QUANTITY IF EXISTS, OR ADD NEW ITEM
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

// ADD TO CART ANIMATION (Single timeout prevents overlap)
let cartTimeoutId;
export function addToCartAnimation(productId) {
  const addToCartElm = document.querySelector(`.js-added-to-cart-${productId}`);

  // SHOW ANIMATION
  addToCartElm.classList.add("js-added-to-cart");

  // CLEAR PREVIOUS TIMEOUT
  if (cartTimeoutId) {
    clearTimeout(cartTimeoutId);
  }

  // SET NEW 2-SECOND TIMEOUT
  cartTimeoutId = setTimeout(() => {
    addToCartElm.classList.remove("js-added-to-cart");
  }, 2000);
}

// GET SELECTED QUANTITY FROM DROPDOWN
export function selectorQunatityDropdown(productId) {
  const quantitySelectorElm = document.querySelector(
    `.js-quantity-selector-${productId}`,
  ).value;
  const quantity = Number(quantitySelectorElm);
  return quantity;
}

// REMOVE ITEM FROM CART
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

// CALCULATE TOTAL CART QUANTITY
export function calculateCartQuantity() {
  let cartQuantity = 0;
  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  });
  return cartQuantity;
}

// UPDATE ITEM QUANTITY
export function updateQuantity(productId, newQuantity) {
  cart.forEach((cartItem) => {
    if (cartItem.productId === productId) {
      cartItem.quantity = newQuantity;
    }
  });
  saveToStorage();
}

// UPDATE DELIVERY OPTION
export function updateDeliveryOption(productId, deliveryOptionId) {
  let matchingItem;

  cart.forEach((cartItem) => {
    if (cartItem.productId === productId) {
      matchingItem = cartItem;
    }
  });

  matchingItem.deliveryOptionId = deliveryOptionId;
  saveToStorage();
}

export function loadCart(fun) {
  const xhr = new XMLHttpRequest();

  xhr.addEventListener("load", () => {
    console.log('Load cart');
    fun();
  });

  xhr.addEventListener('error', (error) => {
    console.log('Unexpected error. Please try again later.');
  })
  xhr.open("GET", "https://supersimplebackend.dev/cart");
  xhr.send();
}
