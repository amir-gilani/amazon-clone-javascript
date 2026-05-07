import { calculateCartQuantity } from "../../data/cart.js";

export function renderCheckoutHeader() {
  let cartQuantity = calculateCartQuantity();

  let quantityHeaderHTML = `
  Checkout (<a class="return-to-home-link js-return-to-home" href="amazon.html">
  ${`${cartQuantity} items`}</a>)
  `;
  document.querySelector(".js-checkout-header-quantity").innerHTML =
    quantityHeaderHTML;
}
