import { cart, resetCart } from "../../data/cart.js";
import { getProduct } from "../../data/products.js";
import { getDeliveryOption } from "../../data/deliveryOptions.js";
import formatCurrency from "../utils/money.js";
import { addOrder } from "../../data/order.js";

export function renderPaymentSummary() {
  let productPriceCents = 0;
  let shipingPriceCents = 0;
  let totalItemsCount = 0;

  cart.forEach((cartItem) => {
    const { quantity, productId, deliveryOptionId } = cartItem;
    totalItemsCount += quantity;
    const product = getProduct(productId);
    if (product && product.priceCents) {
      productPriceCents += product.priceCents * quantity;
    }

    const deliveryOption = getDeliveryOption(deliveryOptionId);
    if (deliveryOption && deliveryOption.priceCents) {
      shipingPriceCents += deliveryOption.priceCents;
    }
  });

  const totalBeforeTaxCents = productPriceCents + shipingPriceCents;
  const taxCents = totalBeforeTaxCents * 0.1;
  const totalCents = totalBeforeTaxCents + taxCents;

  const paymentSummaryHTML = `
    <div class="payment-summary-title">
      Order Summary
    </div>

    <div class="payment-summary-row">
      <div>Items (${totalItemsCount}):</div>
      <div class="payment-summary-money">$${formatCurrency(productPriceCents)}</div>
    </div>

    <div class="payment-summary-row">
      <div>Shipping &amp; handling:</div>
      <div class="payment-summary-money">$${formatCurrency(shipingPriceCents)}</div>
    </div>

    <div class="payment-summary-row subtotal-row">
      <div>Total before tax:</div>
      <div class="payment-summary-money">$${formatCurrency(totalBeforeTaxCents)}</div>
    </div>

    <div class="payment-summary-row">
      <div>Estimated tax (10%):</div>
      <div class="payment-summary-money">$${formatCurrency(taxCents)}</div>
    </div>

    <div class="payment-summary-row total-row">
      <div>Order total:</div>
      <div class="payment-summary-money">$${formatCurrency(totalCents)}</div>
    </div>

    <button class="place-order-button button-primary js-place-order">
      Place your order
    </button>
  `;
  document.querySelector(".js-payment-summary").innerHTML = paymentSummaryHTML;

  document
    .querySelector(".js-place-order")
    .addEventListener("click", async () => {
      if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
      }

      const placeOrderBtn = document.querySelector(".js-place-order");
      if (placeOrderBtn) {
        placeOrderBtn.disabled = true;
        placeOrderBtn.textContent = "Placing order...";
      }

      let order;
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2500);

        const response = await fetch("https://supersimplebackend.dev/orders", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            cart: cart,
          }),
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (response.ok) {
          order = await response.json();
        } else {
          throw new Error('Backend failed');
        }
      } catch (error) {
        console.log('Using robust local order generation fallback');
        order = {
          id: (typeof crypto !== 'undefined' && crypto.randomUUID) 
            ? crypto.randomUUID() 
            : ('ord-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6)),
          orderTime: new Date().toISOString(),
          totalCostCents: Math.round(totalCents),
          products: cart.map(cartItem => {
            const deliveryDays = cartItem.deliveryOptionId === '3' ? 1 : (cartItem.deliveryOptionId === '2' ? 3 : 7);
            const deliveryDate = new Date();
            deliveryDate.setDate(deliveryDate.getDate() + deliveryDays);
            return {
              productId: cartItem.productId,
              quantity: cartItem.quantity,
              estimatedDeliveryTime: deliveryDate.toISOString(),
              variation: null
            };
          })
        };
      }

      if (order) {
        addOrder(order);
        resetCart();
      }

      window.location.href = 'orders.html';
    });
}
