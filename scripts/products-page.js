import {
  addToCart,
  addToCartAnimation,
  selectorQunatityDropdown,
  calculateCartQuantity,
} from "../data/cart.js";
import { products, Clothing, Appliance, rawProductsCatalog } from "../data/products.js";
import formatCurrency from "./utils/money.js";

// Active product list state
let allCatalogProducts = [];
let currentFilterSearch = "";
let currentSort = "featured";

// Initialize on page load
initProductsPage();

async function initProductsPage() {
  updateCartQuantity();

  // Parse search parameter from URL if present
  const urlParams = new URLSearchParams(window.location.search);
  const searchParam = urlParams.get("search");
  if (searchParam) {
    currentFilterSearch = searchParam.trim();
    const searchInput = document.querySelector(".js-search-bar");
    if (searchInput) searchInput.value = currentFilterSearch;
  }

  // Fetch or load fallback catalog
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1200);

    const response = await fetch("https://supersimplebackend.dev/products", { signal: controller.signal });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      allCatalogProducts = data.map((item) => createProductInstance(item));
    } else {
      throw new Error("Backend response error");
    }
  } catch (err) {
    console.log("Using local static products catalog");
    allCatalogProducts = rawProductsCatalog.map((item) => createProductInstance(item));
  }

  if (!allCatalogProducts || allCatalogProducts.length === 0) {
    allCatalogProducts = rawProductsCatalog.map((item) => createProductInstance(item));
  }

  renderProductsGrid();
  setupEventListeners();
}

function createProductInstance(productDetails) {
  if (productDetails.type === "clothing") {
    return new Clothing(productDetails);
  } else if (productDetails.type === "Appliance") {
    return new Appliance(productDetails);
  }
  return {
    ...productDetails,
    getStarsUrl() {
      return `images/ratings/rating-${(this.rating?.stars || 4.5) * 10}.png`;
    },
    getPrice() {
      return `$${formatCurrency(this.priceCents || 0)}`;
    },
    extraInfoHTML() {
      return "";
    }
  };
}

function updateCartQuantity() {
  const cartQtyEl = document.querySelector(".js-cart-quantity");
  if (cartQtyEl) {
    cartQtyEl.innerHTML = calculateCartQuantity();
  }
}

function getFilteredAndSortedProducts() {
  let list = [...allCatalogProducts];

  // 1. Search Filter
  if (currentFilterSearch) {
    const query = currentFilterSearch.toLowerCase();
    list = list.filter((p) => {
      const nameMatch = (p.name || "").toLowerCase().includes(query);
      const keywordsMatch = Array.isArray(p.keywords) && p.keywords.some((k) => k.toLowerCase().includes(query));
      return nameMatch || keywordsMatch;
    });
  }

  // 2. Sorting
  if (currentSort === "price-asc") {
    list.sort((a, b) => a.priceCents - b.priceCents);
  } else if (currentSort === "price-desc") {
    list.sort((a, b) => b.priceCents - a.priceCents);
  } else if (currentSort === "rating") {
    list.sort((a, b) => (b.rating?.stars || 0) - (a.rating?.stars || 0));
  }

  return list;
}

function renderProductsGrid() {
  const gridContainer = document.querySelector(".js-products-grid");
  const countContainer = document.querySelector(".js-results-count-wrap");
  if (!gridContainer) return;

  const displayList = getFilteredAndSortedProducts();

  // Update results bar info
  if (countContainer) {
    if (currentFilterSearch) {
      countContainer.innerHTML = `Showing <span class="results-count-bold">${displayList.length}</span> results for <span class="results-search-term">"${currentFilterSearch}"</span>`;
    } else {
      countContainer.innerHTML = `Showing <span class="results-count-bold">1–${displayList.length}</span> of <span class="results-count-bold">${allCatalogProducts.length}</span> products`;
    }
  }

  if (displayList.length === 0) {
    gridContainer.innerHTML = `
      <div class="no-products-message">
        <p>No products matched your search <strong>"${currentFilterSearch}"</strong>.</p>
        <a href="products.html" class="no-products-reset-btn">View All Products</a>
      </div>
    `;
    return;
  }

  let html = "";
  displayList.forEach((product) => {
    const extraInfo = typeof product.extraInfoHTML === "function" ? product.extraInfoHTML() : "";
    const starsUrl = typeof product.getStarsUrl === "function" ? product.getStarsUrl() : `images/ratings/rating-45.png`;
    const priceFormatted = typeof product.getPrice === "function" ? product.getPrice() : `$${formatCurrency(product.priceCents)}`;

    html += `
      <div class="product-container" data-product-id="${product.id}">
        <div class="product-image-container">
          <img class="product-image" src="${product.image}" alt="${product.name}" loading="lazy">
        </div>

        <div class="product-name" title="${product.name}">
          ${product.name}
        </div>

        <div class="product-rating-container">
          <img class="product-rating-stars" src="${starsUrl}" alt="Rating">
          <div class="product-rating-count">
            ${product.rating ? product.rating.count : 50}
          </div>
        </div>

        <div class="product-price">
          ${priceFormatted}
        </div>

        <div class="product-quantity-container">
          <select class="product-quantity-select js-quantity-selector-${product.id}">
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

        ${extraInfo ? `<div class="product-extra-info">${extraInfo}</div>` : ""}

        <div class="product-spacer"></div>

        <div class="added-to-cart js-added-to-cart-${product.id}">
          <img src="images/icons/checkmark.png" alt="Checked">
          Added
        </div>

        <button class="add-to-cart-button js-add-to-cart" data-product-id="${product.id}">
          Add to Cart
        </button>
      </div>
    `;
  });

  gridContainer.innerHTML = html;
  attachAddToCartEvents();
}

function attachAddToCartEvents() {
  document.querySelectorAll(".js-add-to-cart").forEach((button) => {
    button.addEventListener("click", () => {
      const { productId } = button.dataset;
      const quantity = selectorQunatityDropdown(productId);

      addToCart(productId, quantity);
      updateCartQuantity();
      addToCartAnimation(productId);
    });
  });
}

function setupEventListeners() {
  // Sort dropdown
  const sortSelect = document.querySelector(".js-sort-select");
  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      currentSort = e.target.value;
      renderProductsGrid();
    });
  }

  // Header Search Input & Button
  const searchInput = document.querySelector(".js-search-bar");
  const searchBtn = document.querySelector(".js-search-button");

  function handleSearchSubmit() {
    if (!searchInput) return;
    currentFilterSearch = searchInput.value.trim();
    // Update browser URL without reloading
    const newUrl = currentFilterSearch 
      ? `products.html?search=${encodeURIComponent(currentFilterSearch)}` 
      : 'products.html';
    window.history.replaceState({}, '', newUrl);
    renderProductsGrid();
  }

  if (searchBtn) {
    searchBtn.addEventListener("click", handleSearchSubmit);
  }

  if (searchInput) {
    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        handleSearchSubmit();
      }
    });
  }
}
