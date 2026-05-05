//Modules
import {
  cart,
  addToCart,
  addToCartAnimation,
  selectorQunatityDropdown,
  calculateCartQuantity,
} from "../data/cart.js";
import { products } from "../data/products.js";
import formatCurrency from "./utils/money.js";

//accumulator pattern for save all the html data inside
let productsHTML = "";

products.forEach((product) => {
  const { image, name, rating, priceCents } = product;

  productsHTML += `
    <div class="product-container">
      <div class="product-image-container">
        <img class="product-image"
          src="${image}">
      </div>

      <div class="product-name limit-text-to-2-lines">
        ${name}
      </div>

      <div class="product-rating-container">
        <img class="product-rating-stars"
          src="images/ratings/rating-${rating.stars * 10}.png">
        <div class="product-rating-count link-primary">
          ${rating.count}
        </div>
      </div>

      <div class="product-price">
        $${formatCurrency(priceCents)}
      </div>

      <div class="product-quantity-container">
        <select class= "js-quantity-selector-${product.id}">
          <option selected value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
        </select>
      </div>

      <div class="product-spacer"></div>

      <div class="added-to-cart js-added-to-cart-${product.id}">
        <img src="images/icons/checkmark.png">
        Added
      </div>

      <button class="add-to-cart-button button-primary js-add-to-cart"
      data-product-id="${product.id}">
        Add to Cart
      </button>
    </div>
  `;
});

//Render all products to the grid container
document.querySelector(".js-products-grid").innerHTML = productsHTML;

//Update cart counter in header
function updateCartQuantity() {
  document.querySelector(".js-cart-quantity").innerHTML =
    calculateCartQuantity();
}
updateCartQuantity();

//Attach click event to ALL "Add to Cart" buttons
document.querySelectorAll(".js-add-to-cart").forEach((button) => {
  button.addEventListener("click", () => {
    //Extract product ID from button data attribute
    const { productId } = button.dataset;
    //This code for creat "qantity" for addToCart && dropdown quantity
    const quantity = selectorQunatityDropdown(productId);
    setTimeout(() => {
      document.querySelectorAll(".js-added-to-cart").forEach((el) => {
        if (!el.classList.contains(`js-added-to-cart-${productId}`)) {
          el.classList.remove("js-added-to-cart");
        }
      });
    }, 100);

    addToCart(productId, quantity);
    updateCartQuantity();
    addToCartAnimation(productId);
  });
});
