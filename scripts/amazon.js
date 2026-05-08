// ═══════════════════════════════════════════════════════════════════════════════════════
// PRODUCT GRID RENDERING MODULE
// Renders all products with quantity selectors, ratings, and add-to-cart functionality
// ═══════════════════════════════════════════════════════════════════════════════════════

// MODULE IMPORTS
import {
  addToCart,
  addToCartAnimation,
  selectorQunatityDropdown,
  calculateCartQuantity,
} from "../data/cart.js";
import { products } from "../data/products.js";
import formatCurrency from "./utils/money.js";

// ═══════════════════════════════════════════════════════════════════════════════════════
// PRODUCTS HTML GENERATION (ACCUMULATOR PATTERN)
// Builds HTML string for all products using template literals
// ═══════════════════════════════════════════════════════════════════════════════════════
let productsHTML = "";

products.forEach((product) => {
  const { image, name, rating, priceCents, id } = product;

  productsHTML += `
    <div class="product-container">
      <!-- PRODUCT IMAGE -->
      <div class="product-image-container">
        <img class="product-image" src="${image}">
      </div>

      <!-- PRODUCT NAME (LIMITED TO 2 LINES) -->
      <div class="product-name limit-text-to-2-lines">${name}</div>

      <!-- PRODUCT RATING & REVIEW COUNT -->
      <div class="product-rating-container">
        <img class="product-rating-stars"
             src="images/ratings/rating-${rating.stars * 10}.png">
        <div class="product-rating-count link-primary">${rating.count}</div>
      </div>

      <!-- PRODUCT PRICE -->
      <div class="product-price">$${formatCurrency(priceCents)}</div>

      <!-- QUANTITY SELECTOR DROPDOWN -->
      <div class="product-quantity-container">
        <select class="js-quantity-selector-${id}">
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

      <!-- SPACER FOR LAYOUT -->
      <div class="product-spacer"></div>

      <!-- "ADDED TO CART" ANIMATION ELEMENT -->
      <div class="added-to-cart js-added-to-cart-${id}">
        <img src="images/icons/checkmark.png">Added
      </div>

      <!-- ADD TO CART BUTTON -->
      <button class="add-to-cart-button button-primary js-add-to-cart"
              data-product-id="${id}">
        Add to Cart
      </button>
    </div>
  `;
});

// ═══════════════════════════════════════════════════════════════════════════════════════
// RENDER PRODUCTS TO DOM & INITIALIZE
// ═══════════════════════════════════════════════════════════════════════════════════════

// RENDER ALL PRODUCTS TO GRID CONTAINER
document.querySelector(".js-products-grid").innerHTML = productsHTML;

// UPDATE CART QUANTITY DISPLAY IN HEADER
function updateCartQuantity() {
  document.querySelector(".js-cart-quantity").innerHTML =
    calculateCartQuantity();
}
updateCartQuantity();

// ═══════════════════════════════════════════════════════════════════════════════════════
// ADD TO CART EVENT HANDLERS
// Attaches click listeners to all "Add to Cart" buttons
// Handles quantity selection, cart updates, and animations
// ═══════════════════════════════════════════════════════════════════════════════════════
document.querySelectorAll(".js-add-to-cart").forEach((button) => {
  button.addEventListener("click", () => {
    // EXTRACT PRODUCT ID FROM DATA ATTRIBUTE
    const { productId } = button.dataset;

    // GET SELECTED QUANTITY FROM DROPDOWN
    const quantity = selectorQunatityDropdown(productId);

    // CLEAR OTHER "ADDED" ANIMATIONS (KEEP CURRENT ONE)
    setTimeout(() => {
      document.querySelectorAll(".js-added-to-cart").forEach((el) => {
        if (!el.classList.contains(`js-added-to-cart-${productId}`)) {
          el.classList.remove("js-added-to-cart");
        }
      });
    }, 100);

    // EXECUTE CART OPERATIONS
    addToCart(productId, quantity);
    updateCartQuantity();
    addToCartAnimation(productId);
  });
});
