//Modules
import { cart } from "../data/cart.js";
import { products } from "../data/products.js";

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
        $${(priceCents / 100).toFixed(2)}
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

//Single timeout ID - clears previous timeout on every click
let cartTimeoutId;

//Attach click event to ALL "Add to Cart" buttons
document
  .querySelectorAll(".js-add-to-cart") 
  .forEach((button) => {
    button.addEventListener("click", () => {
      //Extract product ID from button data attribute
      const { productId } = button.dataset;

      //Get SELECTED quantity value from dropdown
      const quantitySelectorElm = document.querySelector(
        `.js-quantity-selector-${productId}`,
      ).value; 

      //Convert string quantity to number
      const quantity = Number(quantitySelectorElm);

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

      //Accumulator for total cart items
      let cartQuantity = 0; 

      cart.forEach((cartItem) => {
        cartQuantity += cartItem.quantity;
      });

      //Update cart counter in header
      document.querySelector(".js-cart-quantity").innerHTML = cartQuantity; 

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
    });
  });
