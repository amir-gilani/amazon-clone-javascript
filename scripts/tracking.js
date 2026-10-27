import { getOrder, orders } from "../data/order.js";
import { getProduct, loadProductsFetch } from "../data/products.js";
import { calculateCartQuantity } from "../data/cart.js";

// Initialize tracking page
initTrackingPage();

async function initTrackingPage() {
  updateCartQuantity();
  renderTrackingDetails();

  try {
    await loadProductsFetch();
    renderTrackingDetails();
  } catch (e) {
    console.log("Using local catalog for tracking");
  }
}

function updateCartQuantity() {
  document.querySelectorAll(".js-cart-quantity").forEach((el) => {
    el.textContent = calculateCartQuantity();
  });
}

function formatTrackingDate(dateString) {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  } catch (e) {
    return dateString;
  }
}

function renderTrackingDetails() {
  const container = document.querySelector(".order-tracking");
  if (!container) return;

  const url = new URL(window.location.href);
  const orderId = url.searchParams.get("orderId");
  const productId = url.searchParams.get("productId");

  // 1. Locate Order
  let order = orderId ? getOrder(orderId) : null;
  if (!order && orders && orders.length > 0) {
    order = orders[0];
  }

  if (!order) {
    container.innerHTML = `
      <div style="text-align: center; padding: 40px 20px;">
        <h2>Order Not Found</h2>
        <p style="margin: 14px 0 20px 0; color: #565959;">We could not locate tracking information for this request.</p>
        <a href="orders.html" class="button-primary" style="display: inline-block; padding: 10px 24px; border-radius: 20px; text-decoration: none; color: #0f1111; font-weight: 600; background-color: #ffd814; border: 1px solid #fcd200;">View All Orders</a>
      </div>
    `;
    return;
  }

  // 2. Locate Product Details in Order
  let orderProduct = null;
  if (productId && order.products) {
    orderProduct = order.products.find((p) => p.productId === productId);
  }
  if (!orderProduct && order.products && order.products.length > 0) {
    orderProduct = order.products[0];
  }

  const actualProductId = productId || orderProduct?.productId;
  let product = actualProductId ? getProduct(actualProductId) : null;

  if (!product) {
    product = {
      name: "Purchased Order Item",
      image: "images/icons/cart-icon.png",
    };
  }

  const quantity = orderProduct?.quantity || 1;
  const deliveryDateString = orderProduct?.estimatedDeliveryTime
    ? formatTrackingDate(orderProduct.estimatedDeliveryTime)
    : "Soon";

  // 3. Compute Progress Status
  const today = Date.now();
  const orderTime = new Date(order.orderTime).getTime();
  const deliveryTime = new Date(orderProduct?.estimatedDeliveryTime || (orderTime + 3 * 86400000)).getTime();

  let percentProgress = 50;
  if (deliveryTime > orderTime) {
    percentProgress = Math.round(((today - orderTime) / (deliveryTime - orderTime)) * 100);
  }
  percentProgress = Math.max(5, Math.min(100, percentProgress));

  const isPreparing = percentProgress < 50;
  const isShipped = percentProgress >= 50 && percentProgress < 100;
  const isDelivered = percentProgress >= 100;

  container.innerHTML = `
    <div class="delivery-date">
      Arriving on ${deliveryDateString}
    </div>

    <div class="product-info">
      ${product.name}
    </div>

    <div class="product-info">
      Quantity: ${quantity}
    </div>

    <img class="product-image" src="${product.image}" alt="${product.name}">

    <div class="progress-labels-container">
      <div class="progress-label ${isPreparing ? "current-status" : ""}">
        Preparing
      </div>
      <div class="progress-label ${isShipped ? "current-status" : ""}">
        Shipped
      </div>
      <div class="progress-label ${isDelivered ? "current-status" : ""}">
        Delivered
      </div>
    </div>

    <div class="progress-bar-container">
      <div class="progress-bar" style="width: ${percentProgress}%;"></div>
    </div>
  `;
}
