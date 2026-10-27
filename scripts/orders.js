import { orders } from "../data/order.js";
import { getProduct, loadProductsFetch, rawProductsCatalog } from "../data/products.js";
import formatCurrency from "./utils/money.js";
import { addToCart, calculateCartQuantity } from "../data/cart.js";

// Initialize orders page
initOrdersPage();

async function initOrdersPage() {
  updateCartQuantity();

  // Load products so getProduct() returns names and images
  try {
    await loadProductsFetch();
  } catch (e) {
    console.log("Using local products catalog for orders");
  }

  renderOrdersGrid();
}

function updateCartQuantity() {
  document.querySelectorAll(".js-cart-quantity").forEach((el) => {
    el.textContent = calculateCartQuantity();
  });
}

function formatOrderDate(dateString) {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("en-US", { month: "long", day: "numeric" });
  } catch (e) {
    return dateString;
  }
}

function formatDeliveryDate(dateString) {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("en-US", { month: "long", day: "numeric" });
  } catch (e) {
    return dateString;
  }
}

function renderOrdersGrid() {
  const ordersGrid = document.querySelector(".orders-grid");
  if (!ordersGrid) return;

  if (!orders || orders.length === 0) {
    ordersGrid.innerHTML = `
      <div class="no-orders-message" style="text-align: center; padding: 60px 20px; background: #ffffff; border: 1px solid #d5d9d9; border-radius: 8px;">
        <h2 style="font-size: 20px; margin-bottom: 12px; color: #0f1111;">You have not placed any orders yet.</h2>
        <p style="color: #565959; margin-bottom: 20px;">Explore our catalog and find great items to order!</p>
        <a href="products.html" class="button-primary" style="display: inline-block; padding: 10px 24px; border-radius: 20px; text-decoration: none; color: #0f1111; font-weight: 600; background-color: #ffd814; border: 1px solid #fcd200;">Explore Products</a>
      </div>
    `;
    return;
  }

  let html = "";
  orders.forEach((order) => {
    const orderDate = formatOrderDate(order.orderTime);
    const totalFormatted = formatCurrency(order.totalCostCents);

    html += `
      <div class="order-container">
        <div class="order-header">
          <div class="order-header-left-section">
            <div class="order-date">
              <div class="order-header-label">Order Placed:</div>
              <div>${orderDate}</div>
            </div>
            <div class="order-total">
              <div class="order-header-label">Total:</div>
              <div>$${totalFormatted}</div>
            </div>
          </div>

          <div class="order-header-right-section">
            <div class="order-header-label">Order ID:</div>
            <div>${order.id}</div>
          </div>
        </div>

        <div class="order-details-grid">
          ${renderOrderProductsHTML(order)}
        </div>
      </div>
    `;
  });

  ordersGrid.innerHTML = html;
  attachBuyAgainEvents();
}

function renderOrderProductsHTML(order) {
  let productsHTML = "";

  if (!order.products || order.products.length === 0) {
    return `<div style="padding: 20px;">No product items found in this order.</div>`;
  }

  order.products.forEach((orderProduct) => {
    let product = getProduct(orderProduct.productId);

    // Fallback if product is not found in catalog
    if (!product) {
      product = {
        id: orderProduct.productId,
        name: "Amazon Product",
        image: "images/products/athletic-cotton-socks-6-pairs.jpg"
      };
    }

    const deliveryDate = formatDeliveryDate(orderProduct.estimatedDeliveryTime);

    productsHTML += `
      <div class="product-image-container">
        <img src="${product.image}" alt="${product.name}">
      </div>

      <div class="product-details">
        <div class="product-name">
          ${product.name}
        </div>
        <div class="product-delivery-date">
          Arriving on: ${deliveryDate}
        </div>
        <div class="product-quantity">
          Quantity: ${orderProduct.quantity}
        </div>
        <button class="buy-again-button button-primary js-buy-again" data-product-id="${product.id}">
          <img class="buy-again-icon" src="images/icons/buy-again.png" alt="Buy again">
          <span class="buy-again-message">Buy it again</span>
        </button>
      </div>

      <div class="product-actions">
        <a href="tracking.html?orderId=${order.id}&productId=${product.id}">
          <button class="track-package-button button-secondary">
            Track package
          </button>
        </a>
      </div>
    `;
  });

  return productsHTML;
}

function attachBuyAgainEvents() {
  document.querySelectorAll(".js-buy-again").forEach((btn) => {
    btn.addEventListener("click", () => {
      const productId = btn.dataset.productId;
      addToCart(productId, 1);
      updateCartQuantity();

      const msg = btn.querySelector(".buy-again-message");
      if (msg) {
        const orig = msg.textContent;
        msg.textContent = "✓ Added";
        btn.style.backgroundColor = "#2ecc71";
        btn.style.borderColor = "#27ae60";
        btn.style.color = "#ffffff";

        setTimeout(() => {
          msg.textContent = orig;
          btn.style.backgroundColor = "";
          btn.style.borderColor = "";
          btn.style.color = "";
        }, 1500);
      }
    });
  });
}
