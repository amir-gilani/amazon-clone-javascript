// ═══════════════════════════════════════════════════════════════════════════════════════
// AMAZON 2026 AUTHENTIC SHOPPING CART & CHECKOUT CONTROLLER
// Exclusively uses existing products from data/products.js (No external/custom products)
// ═══════════════════════════════════════════════════════════════════════════════════════

import {
  cart,
  removeFromCart,
  addToCart,
  calculateCartQuantity,
} from "../data/cart.js";
import { loadProductsFetch, getProduct, products } from "../data/products.js";
import formatCurrency from "./utils/money.js";
import { addOrder } from "../data/order.js";
import { renderCheckoutHeader } from "./checkout/checkoutHeader.js";

// Sidebar recommendations using existing catalog products
const sidebarRecProductIds = [
  "58b4fc92-e98c-42aa-8c55-b6b79996769a", // Waterproof Knit Athletic Sneakers - Gray
  "83d4ca15-0f35-48f5-b7a3-1ea210004f2e", // Adults Plain Cotton T-Shirt - 2 Pack
  "dd82ca78-a18b-4e2a-9250-31e67412f98d", // Plain Hooded Fleece Sweatshirt
  "04701903-bc79-49c6-bc11-1af7e3651358", // Women's Two Strap Buckle Sandals - Tan
  "82bb68d7-ebc9-476a-989c-c78a40ee5cd9", // Men's Slim-Fit Summer Shorts
  "aad29d11-ea98-41ee-9285-b916638cac4a", // Round Sunglasses
  "54e0eccd-8f36-462b-b68a-8182611d9add", // 2 Slot Toaster - Black
  "c2a82c5e-aff4-435f-9975-517cfaba2ece", // Electric Glass and Steel Hot Tea Water Kettle
];

// Carousel items using existing catalog products (3 pages of 6 items)
const carouselPagesProductIds = [
  // Page 1: Apparel & Footwear
  [
    "ee1f7c56-f977-40a4-9642-12ba5072e2b0", // Men's Classic-fit Pleated Chino Pants
    "1c079479-8586-494f-ab53-219325432536", // Men's Athletic Sneaker
    "4f4fbcc2-4e72-45cc-935c-9e13d79cc57f", // Women's Knit Ballet Flat
    "8b5a2ee1-6055-422a-a666-b34ba28b76d4", // Men's Regular-Fit Quick-Dry Golf Polo Shirt
    "b0f17cc5-8b40-4ca5-9142-b61fe3d98c85", // Women's Stretch Popover Hoodie
    "5968897c-4d27-4872-89f6-5bcb052746d7", // Women's Chiffon Beachwear Cover Up
  ],
  // Page 2: Kitchen & Appliances
  [
    "3ebe75dc-64d2-4137-8860-1f5a963e534b", // 6 Piece White Dinner Plate Set
    "8c9c52b5-5a19-4bcb-a5d1-158a74287c53", // 6-Piece Nonstick Baking Set
    "0d7f9afa-2efe-4fd9-b0fd-ba5663e0a524", // Coffeemaker with Glass Carafe
    "77a845b1-16ed-4eac-bdf9-5b591882113d", // Countertop Blender - 64oz
    "d37a651a-d501-483b-aae6-a9659b0757a0", // Round Airtight Food Storage Containers
    "4e37dd03-3b23-4bc6-9ff8-44e112a92c64", // Non-Stick Cookware Set - 15 Pieces
  ],
  // Page 3: Bed, Bath & Home
  [
    "a93a101d-79ef-4cf3-a6cf-6dbe532a1b4a", // Bathroom Bath Rug Mat
    "8a53b080-6d40-4a65-ab26-b24ecf700bce", // 100% Cotton Bath Towels - 2 Pack
    "19c6a64a-5463-4d45-9af8-e41140a4100c", // Duvet Cover Set with Zipper Closure
    "901eb2ca-386d-432e-82f0-6fb1ee7bf969", // Blackout Curtains Set 4-Pack
    "e4f64a65-1377-42bc-89a5-e572d19252e2", // Sterling Silver Sky Flower Stud Earrings
    "a82c6bac-3067-4e68-a5ba-d827ac0be010", // Straw Lifeguard Sun Hat
  ]
];

let currentCarouselPage = 0;

// ─────────────────────────────────────────────────────────────────────────────
// INITIALIZATION
// ─────────────────────────────────────────────────────────────────────────────
async function initCheckoutPage() {
  try {
    await loadProductsFetch();
  } catch (error) {
    console.log("Using static products catalog");
  }

  renderCartPage();
  renderSidebarRecs();
  renderCarousel();
  setupGlobalEvents();
}

// ─────────────────────────────────────────────────────────────────────────────
// RENDER CART PAGE (ITEMS, TOTALS, VISA PROMO)
// ─────────────────────────────────────────────────────────────────────────────
function renderCartPage() {
  let totalItemCount = 0;
  let totalCents = 0;
  let firstCartProduct = null;

  // Calculate totals and find first product
  cart.forEach((cartItem) => {
    totalItemCount += cartItem.quantity;
    const product = getProduct(cartItem.productId);
    if (product) {
      if (!firstCartProduct) firstCartProduct = product;
      totalCents += product.priceCents * cartItem.quantity;
    }
  });

  // 1. Update Visa Promo Banner
  const visaCurrentEl = document.querySelector(".js-visa-current-total");
  const visaAfterEl = document.querySelector(".js-visa-cost-after");
  const visaThumbEl = document.querySelector(".js-visa-promo-thumb");

  if (visaCurrentEl) visaCurrentEl.textContent = `$${formatCurrency(totalCents)}`;
  if (visaAfterEl) {
    const afterSavingsCents = Math.max(0, totalCents - 6000);
    visaAfterEl.textContent = `$${formatCurrency(afterSavingsCents)}`;
  }
  if (visaThumbEl && firstCartProduct) {
    visaThumbEl.src = firstCartProduct.image;
    visaThumbEl.alt = firstCartProduct.name;
  }

  // Update carousel title based on first item
  const carouselTitleEl = document.querySelector(".js-carousel-rec-title");
  if (carouselTitleEl && firstCartProduct) {
    carouselTitleEl.textContent = `Customers who shopped for ${firstCartProduct.name} also shopped for:`;
  }

  // 2. Render Items List
  const itemsContainer = document.querySelector(".js-cart-items-list");
  if (!itemsContainer) return;

  if (cart.length === 0) {
    itemsContainer.innerHTML = `
      <div class="empty-cart-view">
        <h2 class="empty-cart-title">Your Amazon Cart is empty</h2>
        <p style="margin-bottom: 18px; color: #565959; font-size: 14px;">Your Shopping Cart lives to serve. Give it purpose — fill it with groceries, clothing, home essentials, and more.</p>
        <a href="amazon.html" class="empty-cart-link">Continue shopping</a>
      </div>
    `;
  } else {
    let itemsHTML = "";
    cart.forEach((cartItem) => {
      const { productId, quantity } = cartItem;
      const product = getProduct(productId);
      if (!product) return;

      const starsRating = product.rating ? product.rating.stars : 4.5;
      const starsUrl = `images/ratings/rating-${Math.round(starsRating * 10)}.png`;

      itemsHTML += `
        <div class="cart-item-row js-cart-row-${productId}" data-product-id="${productId}">
          <div class="cart-item-checkbox-wrapper">
            <input type="checkbox" checked class="cart-item-chk" aria-label="Select item">
          </div>

          <a href="amazon.html" class="cart-item-image-link">
            <img class="cart-item-img" src="${product.image}" alt="${product.name}">
          </a>

          <div class="cart-item-info-col">
            <a href="amazon.html" class="cart-item-name">${product.name}</a>
            <div class="cart-item-stock">In Stock</div>
            <div class="cart-item-shipping-badge">Eligible for FREE Shipping &amp; FREE Returns</div>

            <label class="cart-item-gift-label">
              <input type="checkbox">
              <span>This is a gift <a href="#">Learn more</a></span>
            </label>

            <div class="cart-item-actions-row">
              <div class="a-quantity-pill">
                <button type="button" class="qty-btn js-decrease-qty" data-product-id="${productId}" aria-label="Decrease quantity">−</button>
                <span class="qty-count">${quantity}</span>
                <button type="button" class="qty-btn js-increase-qty" data-product-id="${productId}" aria-label="Increase quantity">+</button>
              </div>

              <span class="action-pipe">|</span>
              <button type="button" class="cart-action-btn js-delete-item" data-product-id="${productId}">Delete</button>
              <span class="action-pipe">|</span>
              <button type="button" class="cart-action-btn">Save for later</button>
              <span class="action-pipe">|</span>
              <button type="button" class="cart-action-btn">Compare with similar items</button>
              <span class="action-pipe">|</span>
              <button type="button" class="cart-action-btn">Share</button>
            </div>
          </div>

          <div class="cart-item-price-col">
            <div class="cart-item-price-val">$${formatCurrency(product.priceCents)}</div>
          </div>
        </div>
      `;
    });
    itemsContainer.innerHTML = itemsHTML;
  }

  // 3. Render Cart Subtotal Footer
  const cartSubtotalEl = document.querySelector(".js-cart-card-subtotal");
  if (cartSubtotalEl) {
    cartSubtotalEl.innerHTML = `Subtotal (${totalItemCount} ${totalItemCount === 1 ? "item" : "items"}): <strong>$${formatCurrency(totalCents)}</strong>`;
  }

  // 4. Render Right Sidebar Subtotal Line
  const asideSubtotalEl = document.querySelector(".js-subtotal-amount-line");
  if (asideSubtotalEl) {
    asideSubtotalEl.innerHTML = `Subtotal (${totalItemCount} ${totalItemCount === 1 ? "item" : "items"}): <strong>$${formatCurrency(totalCents)}</strong>`;
  }

  // 5. Update Header Cart Badges
  renderCheckoutHeader();
  document.querySelectorAll(".js-cart-quantity").forEach((el) => {
    el.textContent = totalItemCount;
  });

  // Attach dynamic button listeners
  attachCartItemListeners();
}

// ─────────────────────────────────────────────────────────────────────────────
// ATTACH ITEM EVENT LISTENERS (DECREASE, INCREASE, DELETE)
// ─────────────────────────────────────────────────────────────────────────────
function attachCartItemListeners() {
  // Decrease Quantity
  document.querySelectorAll(".js-decrease-qty").forEach((btn) => {
    btn.addEventListener("click", () => {
      const productId = btn.dataset.productId;
      const matchingItem = cart.find((item) => item.productId === productId);
      if (matchingItem) {
        if (matchingItem.quantity > 1) {
          matchingItem.quantity -= 1;
          saveCartStorage();
        } else {
          removeFromCart(productId);
        }
        renderCartPage();
      }
    });
  });

  // Increase Quantity
  document.querySelectorAll(".js-increase-qty").forEach((btn) => {
    btn.addEventListener("click", () => {
      const productId = btn.dataset.productId;
      const matchingItem = cart.find((item) => item.productId === productId);
      if (matchingItem) {
        matchingItem.quantity += 1;
        saveCartStorage();
        renderCartPage();
      }
    });
  });

  // Delete Item
  document.querySelectorAll(".js-delete-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      const productId = btn.dataset.productId;
      removeFromCart(productId);
      renderCartPage();
    });
  });
}

function saveCartStorage() {
  if (typeof localStorage !== "undefined") {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// RENDER SIDEBAR RECOMMENDATIONS (EXCLUSIVELY FROM EXISTING CATALOG)
// ─────────────────────────────────────────────────────────────────────────────
function renderSidebarRecs() {
  const container = document.querySelector(".js-sidebar-rec-list");
  if (!container) return;

  let html = "";
  sidebarRecProductIds.forEach((id) => {
    const product = getProduct(id);
    if (!product) return;

    const starsRating = product.rating ? product.rating.stars : 4.5;
    const ratingCount = product.rating ? product.rating.count : 150;
    const starsUrl = `images/ratings/rating-${Math.round(starsRating * 10)}.png`;

    html += `
      <div class="sidebar-rec-item" data-product-id="${product.id}">
        <img class="sidebar-rec-thumb" src="${product.image}" alt="${product.name}">
        <div class="sidebar-rec-info">
          <a href="#" class="sidebar-rec-name" title="${product.name}">${product.name}</a>
          <div class="sidebar-rec-rating">
            <img class="sidebar-rec-stars" src="${starsUrl}" alt="${starsRating} stars">
            <span>${ratingCount}</span>
          </div>
          <div class="sidebar-rec-price">$${formatCurrency(product.priceCents)}</div>
          <div class="sidebar-rec-shipping">FREE delivery on orders over $35</div>
          <button type="button" class="sidebar-add-btn js-sidebar-add-to-cart" data-product-id="${product.id}">Add to Cart</button>
        </div>
      </div>
    `;
  });
  container.innerHTML = html;

  // Add to cart click
  container.querySelectorAll(".js-sidebar-add-to-cart").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.productId;
      addToCart(id, 1);
      btn.textContent = "Added ✓";
      btn.style.background = "#232F3E";
      btn.style.color = "#FFFFFF";
      setTimeout(() => {
        btn.textContent = "Add to Cart";
        btn.style.background = "#FFD814";
        btn.style.color = "#0F1111";
      }, 1200);
      renderCartPage();
    });
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// RENDER BOTTOM CAROUSEL (EXCLUSIVELY FROM EXISTING CATALOG)
// ─────────────────────────────────────────────────────────────────────────────
function renderCarousel() {
  const track = document.querySelector(".js-carousel-track");
  const pageNumEl = document.querySelector(".js-carousel-page-num");
  if (!track) return;

  const currentIds = carouselPagesProductIds[currentCarouselPage] || carouselPagesProductIds[0];
  if (pageNumEl) pageNumEl.textContent = currentCarouselPage + 1;

  let html = "";
  currentIds.forEach((id) => {
    const product = getProduct(id);
    if (!product) return;

    const starsRating = product.rating ? product.rating.stars : 4.5;
    const ratingCount = product.rating ? product.rating.count : 120;
    const starsUrl = `images/ratings/rating-${Math.round(starsRating * 10)}.png`;

    html += `
      <div class="carousel-card">
        <img class="carousel-card-img" src="${product.image}" alt="${product.name}">
        <a href="#" class="carousel-card-title" title="${product.name}">${product.name}</a>
        <div class="carousel-card-rating">
          <img class="sidebar-rec-stars" src="${starsUrl}" alt="${starsRating} stars">
          <span>${ratingCount}</span>
        </div>
        <div class="carousel-card-price">$${formatCurrency(product.priceCents)}</div>
        <button type="button" class="carousel-card-btn js-carousel-add-btn" data-product-id="${product.id}">Add to Cart</button>
      </div>
    `;
  });
  track.innerHTML = html;

  track.querySelectorAll(".js-carousel-add-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.productId;
      addToCart(id, 1);
      btn.textContent = "Added to Cart ✓";
      setTimeout(() => {
        btn.textContent = "Add to Cart";
      }, 1200);
      renderCartPage();
    });
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// GLOBAL EVENTS (PROCEED TO CHECKOUT, CAROUSEL CONTROLS, BACK TO TOP)
// ─────────────────────────────────────────────────────────────────────────────
function setupGlobalEvents() {
  // Proceed to Checkout Button
  const checkoutBtn = document.querySelector(".js-proceed-checkout");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      if (cart.length === 0) {
        alert("Your cart is empty! Please add items to proceed.");
        return;
      }
      checkoutBtn.textContent = "Placing your order...";
      checkoutBtn.disabled = true;

      // Create new order record
      const newOrder = {
        id: "order-" + Math.random().toString(36).substr(2, 9),
        orderTime: new Date().toISOString(),
        totalCostCents: calculateTotalCents(),
        products: cart.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          estimatedDeliveryTime: new Date(Date.now() + 5 * 86400000).toISOString()
        }))
      };

      addOrder(newOrder);

      setTimeout(() => {
        window.location.href = "orders.html";
      }, 800);
    });
  }

  // Carousel Controls
  const prevBtn = document.querySelector(".js-carousel-prev");
  const nextBtn = document.querySelector(".js-carousel-next");

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      currentCarouselPage = (currentCarouselPage - 1 + carouselPagesProductIds.length) % carouselPagesProductIds.length;
      renderCarousel();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      currentCarouselPage = (currentCarouselPage + 1) % carouselPagesProductIds.length;
      renderCarousel();
    });
  }

  // Smooth scroll back to top
  const backToTopBtn = document.getElementById("navBackToTop");
  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
}

function calculateTotalCents() {
  let total = 0;
  cart.forEach((item) => {
    const product = getProduct(item.productId);
    if (product) {
      total += product.priceCents * item.quantity;
    }
  });
  return total;
}

// Start application
initCheckoutPage();
