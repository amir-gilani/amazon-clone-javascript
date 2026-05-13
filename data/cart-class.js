// ═══════════════════════════════════════════════════════════════════════════════════════
// CART DATA & LOCALSTORAGE MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════════════════
let cartTimeoutId;

class Cart {
  cartItem;
  #localStorageKey;

  constructor(localStorageKey) {
    this.#localStorageKey = localStorageKey;
    this.#loadFromStorage();
  }

  #loadFromStorage() {
    this.cartItem = JSON.parse(localStorage.getItem(this.#localStorageKey)) || [
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

  saveToStorage() {
    localStorage.setItem(this.#localStorageKey, JSON.stringify(this.cartItem));
  }

  // ADD ITEM TO CART
  addToCart(productId, quantity) {
    let matchingItem;

    // CHECK IF PRODUCT ALREADY EXISTS IN CART
    this.cartItem.forEach((cartItem) => {
      if (cartItem.productId === productId) {
        matchingItem = cartItem;
      }
    });

    // UPDATE QUANTITY IF EXISTS, OR ADD NEW ITEM
    if (matchingItem) {
      matchingItem.quantity += quantity;
    } else {
      this.cartItem.push({
        productId,
        quantity,
        deliveryOptionId: "1",
      });
    }
    this.saveToStorage();
  }
  // ADD TO CART ANIMATION (Single timeout prevents overlap)
  addToCartAnimation(productId) {
    const addToCartElm = document.querySelector(
      `.js-added-to-cart-${productId}`,
    );

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
  selectorQunatityDropdown(productId) {
    const quantitySelectorElm = document.querySelector(
      `.js-quantity-selector-${productId}`,
    ).value;
    const quantity = Number(quantitySelectorElm);
    return quantity;
  }

  // REMOVE ITEM FROM CART
  removeFromCart(productId) {
    const newCart = [];

    this.cartItem.forEach((cartItem) => {
      if (cartItem.productId !== productId) {
        newCart.push(cartItem);
      }
    });

    this.cartItem = newCart;
    this.saveToStorage();
  }

  // CALCULATE TOTAL CART QUANTITY
  calculateCartQuantity() {
    let cartQuantity = 0;
    this.cartItem.forEach((cartItem) => {
      cartQuantity += cartItem.quantity;
    });
    return cartQuantity;
  }

  // UPDATE ITEM QUANTITY
  updateQuantity(productId, newQuantity) {
    this.cartItem.forEach((cartItem) => {
      if (cartItem.productId === productId) {
        cartItem.quantity = newQuantity;
      }
    });
    this.saveToStorage();
  }

  // UPDATE DELIVERY OPTION
  updateDeliveryOption(productId, deliveryOptionId) {
    let matchingItem;

    this.cartItem.forEach((cartItem) => {
      if (cartItem.productId === productId) {
        matchingItem = cartItem;
      }
    });

    matchingItem.deliveryOptionId = deliveryOptionId;
    this.saveToStorage();
  }
}
const cart = new Cart('cart-oop');
const businessCart = new Cart('cart-business');


console.log(cart);
console.log(businessCart);
console.log(businessCart instanceof Cart);
console.log(cart instanceof Cart);
