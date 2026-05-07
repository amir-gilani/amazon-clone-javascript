// ═══════════════════════════════════════════════════════════════════════════════════════
// EXTERNAL LIBRARIES & IMPORTS
// ═══════════════════════════════════════════════════════════════════════════════════════

import {
  cart,
  removeFromCart,
  updateQuantity,
  updateDeliveryOption,
} from "../../data/cart.js";
import { getProduct } from "../../data/products.js";
import formatCurrency from "../utils/money.js";
import {
  deliveryOptions,
  getDeliveryOption,
  calculateDeliveryDate,
} from "../../data/deliveryOptions.js";
import { renderPaymentSummary } from "./paymentSummary.js";
import { renderCheckoutHeader } from "./checkoutHeader.js";
// ═══════════════════════════════════════════════════════════════════════════════════════
// MAIN ORDER SUMMARY RENDERING FUNCTION
// ═══════════════════════════════════════════════════════════════════════════════════════

export function renderOrderSummarry() {
  let cartSummaryHTML = "";

  // LOOP THROUGH CART ITEMS & GENERATE HTML
  cart.forEach((cartItem) => {
    const { deliveryOptionId, quantity, productId } = cartItem;

    // FIND MATCHING PRODUCT
    const { image, name, priceCents } = getProduct(productId); //return matchingProduct

    // FIND MATCHING DELIVERY OPTION
    const { deliveryDays } = getDeliveryOption(deliveryOptionId); //return deliveryOption

    cartSummaryHTML += `
    <div class="cart-item-container js-cart-item-container-${productId}">
      <div class="delivery-date">
        Delivery date: ${calculateDeliveryDate(deliveryDays)} 
      </div>

      <div class="cart-item-details-grid">
        <img class="product-image"
          src="${image}">

        <div class="cart-item-details">
          <div class="product-name">
            ${name}
          </div>
          <div class="product-price">
            $${formatCurrency(priceCents)}
          </div>
          <div class="product-quantity">
            <span>
              Quantity: <span class="quantity-label">${quantity}</span>
            </span>
            <span class="update-quantity-link link-primary js-update-link"
            data-product-id="${productId}">
              Update
            </span>
            <input class="quantity-input js-quantity-input">
            <span class="save-quantity-link link-primary js-save-quantity">
            save</span>
            <span class="delete-quantity-link link-primary js-delete-link"
            data-product-id="${productId}">
              Delete
            </span>
          </div>
        </div>

        <div class="delivery-options">
          <div class="delivery-options-title">
            Choose a delivery option:
          </div>
          ${deliveryOptionsHTML(productId, deliveryOptionId)}
        </div>
      </div>
    </div>
  `;
  });

  // UPDATE DOM WITH GENERATED HTML
  document.querySelector(".js-order-summary").innerHTML = cartSummaryHTML;

  // ═══════════════════════════════════════════════════════════════════════════════════════
  // DELIVERY OPTIONS HTML GENERATOR (NESTED FUNCTION)
  // ═══════════════════════════════════════════════════════════════════════════════════════

  function deliveryOptionsHTML(productId, deliveryOptionId) {
    let html = "";

    deliveryOptions.forEach((deliveryOption) => {
      const { id, deliveryDays, priceCents } = deliveryOption;

      const priceString =
        priceCents === 0 ? "FREE" : `$${formatCurrency(priceCents)} -`;
      const isChecked = id === deliveryOptionId ? "checked" : "";
      html += `
        <div class="delivery-option js-delivery-option"
        data-delivery-option-id= "${id}"
        data-product-id="${productId}">
          <input type="radio"
            ${isChecked}
            class="delivery-option-input"
            name="delivery-option-${productId}">
          <div>
            <div class="delivery-option-date">
              ${calculateDeliveryDate(deliveryDays)}
            </div>
            <div class="delivery-option-price">
              ${priceString} Shipping
            </div>
          </div>
        </div>
      `;
    });

    return html;
  }

  // ═══════════════════════════════════════════════════════════════════════════════════════
  // UPDATE CART QUANTITY DISPLAY
  // ═══════════════════════════════════════════════════════════════════════════════════════

  renderCheckoutHeader();

  // ═══════════════════════════════════════════════════════════════════════════════════════
  // EVENT LISTENERS
  // ═══════════════════════════════════════════════════════════════════════════════════════

  // DELETE ITEM EVENT HANDLER
  document.querySelectorAll(".js-delete-link").forEach((link) => {
    link.addEventListener("click", () => {
      const { productId } = link.dataset;
      removeFromCart(productId);

      const container = document.querySelector(
        `.js-cart-item-container-${productId}`,
      );
      container.remove();
      renderCheckoutHeader();
      renderPaymentSummary();
    });
  });

  // UPDATE QUANTITY EVENT HANDLER
  document.querySelectorAll(".js-update-link").forEach((link) => {
    link.addEventListener("click", () => {
      const { productId } = link.dataset;
      const container = document.querySelector(
        `.js-cart-item-container-${productId}`,
      );

      container.classList.add("is-editing-qunatity");

      const saveButton = container.querySelector(".js-save-quantity");
      const inputElement = container.querySelector(".js-quantity-input");

      // ✅ ENTER LISTENER FIRST - before save!
      inputElement.addEventListener("keydown", (e) => {
        if (e.key === "Enter") saveButton.click();
      });

      saveButton.addEventListener("click", () => {
        container.classList.remove("is-editing-qunatity");
        const newQuantity = Number(inputElement.value);
        if (newQuantity > 0 && newQuantity <= 100) {
          updateQuantity(productId, newQuantity);
        }
        renderOrderSummarry();
        renderPaymentSummary();
        inputElement.value = "";
      });
    });
  });

  // DELIVERY OPTION CHANGE EVENT HANDLER
  document.querySelectorAll(".js-delivery-option").forEach((element) => {
    element.addEventListener("click", () => {
      const { deliveryOptionId, productId } = element.dataset;

      updateDeliveryOption(productId, deliveryOptionId);
      renderOrderSummarry(); //MVC
      renderPaymentSummary();
    });
  });
}
