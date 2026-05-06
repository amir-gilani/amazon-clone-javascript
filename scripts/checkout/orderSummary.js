// ═══════════════════════════════════════════════════════════════════════════════════════
// EXTERNAL LIBRARIES & IMPORTS
// ═══════════════════════════════════════════════════════════════════════════════════════

import {
  cart,
  removeFromCart,
  calculateCartQuantity,
  updateQuantity,
  updateDeliveryOption,
} from "../../data/cart.js";
import { getProduct } from "../../data/products.js";
import formatCurrency from "../utils/money.js";
import dayjs from "http://unpkg.com/dayjs@1.11.10/esm/index.js"; //ESM external library && defult import
import { deliveryOptions, getDeliveryOption } from "../../data/deliveryOptions.js";
import { renderPaymentSummary } from "./paymentSummary.js";


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

    // CALCULATE DELIVERY DATE
    const today = dayjs();
    const delivaryDate = today.add(deliveryDays, "days");
    const dateString = delivaryDate.format("dddd, MMMM D");

    cartSummaryHTML += `
    <div class="cart-item-container js-cart-item-container-${productId}">
      <div class="delivery-date">
        Delivery date: ${dateString}
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

      // CALCULATE DELIVERY DATE FOR EACH OPTION
      const today = dayjs();
      const delivaryDate = today.add(deliveryDays, "days");
      const dateString = delivaryDate.format("dddd, MMMM D");

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
              ${dateString}
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
  function updateCartQuantity() {
    document.querySelector(".js-return-to-home").innerHTML =
      `${calculateCartQuantity()} items`;
  }
  updateCartQuantity();

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
      updateCartQuantity();
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
      saveButton.addEventListener("click", () => {
        container.classList.remove("is-editing-qunatity");

        const inputElement = container.querySelector(".js-quantity-input");
        const newQuantity = Number(inputElement.value);

        updateQuantity(productId, newQuantity);
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

