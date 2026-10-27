import { calculateCartQuantity } from "../../data/cart.js";

export function renderCheckoutHeader() {
  let cartQuantity = calculateCartQuantity();

  const checkoutQtyEl = document.querySelector(".js-checkout-header-quantity");
  if (checkoutQtyEl) {
    if (checkoutQtyEl.classList.contains("cart-quantity")) {
      checkoutQtyEl.innerHTML = cartQuantity;
    } else {
      let quantityHeaderHTML = `Checkout (<a class="return-to-home-link js-return-to-home" href="amazon.html">${cartQuantity} items</a>)`;
      checkoutQtyEl.innerHTML = quantityHeaderHTML;
    }
  }

  const cartQtyEl = document.querySelector(".js-cart-quantity");
  if (cartQtyEl) {
    cartQtyEl.innerHTML = cartQuantity;
  }
}
