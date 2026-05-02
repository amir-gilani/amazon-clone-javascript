let productsHTML = ""; //Use accumulator pattern for save all the html data inside

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

      <div class="added-to-cart">
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

document.querySelector(".js-products-grid").innerHTML = productsHTML;

document
  .querySelectorAll(".js-add-to-cart") // For each "add to cart" button create add eventListener.
  .forEach((button) => {
    button.addEventListener("click", () => {
      const { productId } = button.dataset; // Allows us to attach any information to an element
      
      const quantitySelectorElm = document.querySelector(`.js-quantity-selector-${productId}`)
        .value; //This code for take quantity from selector quantity
      const quantity = Number(quantitySelectorElm);

      let matchingItem;

      cart.forEach((cartItem) => {
        if (cartItem.productId === productId) {
          matchingItem = cartItem;
        }
      });

      if (matchingItem) {
        matchingItem.quantity += quantity;
      } else {
        cart.push({
          productId,
          quantity
        });
      }

      let cartQuantity = 0; //Use accumulator pattern for save all quantity inside

      cart.forEach((cartItem) => {
        cartQuantity += cartItem.quantity;
      });

      document.querySelector(".js-cart-quantity").innerHTML = cartQuantity; //show cart qantity in header    
    });
  });
