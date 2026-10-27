import { calculateCartQuantity } from "../data/cart.js";
import { loadProducts } from "../data/products.js";

// ═══════════════════════════════════════════════════════════════════════════════════════
// CATEGORIES DATA DEFINITION (EXACTLY 4 ITEMS PER CARD - MATCHING REAL AMAZON)
// ═══════════════════════════════════════════════════════════════════════════════════════
const categoriesData = [
  {
    id: "boots-kicks",
    title: "Boots and kicks for the whole crew",
    items: [
      { id: "58b4fc92-e98c-42aa-8c55-b6b79996769a", label: "Women's", image: "images/products/knit-athletic-sneakers-gray.jpg" },
      { id: "ee1f7c56-f977-40a4-9642-12ba5072e2b0", label: "Men's", image: "images/products/men-chino-pants-beige.jpg" },
      { id: "4f4fbcc2-4e72-45cc-935c-9e13d79cc57f", label: "Girls'", image: "images/products/women-knit-ballet-flat-black.jpg" },
      { id: "1c079479-8586-494f-ab53-219325432536", label: "Boys'", image: "images/products/men-athletic-shoes-green.jpg" }
    ]
  },
  {
    id: "fall-picks",
    title: "Shop fall premium picks",
    items: [
      { id: "8c9c52b5-5a19-4bcb-a5d1-158a74287c53", label: "Hosting essentials", image: "images/products/6-piece-non-stick-baking-set.webp" },
      { id: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6", label: "Seasonal styles", image: "images/products/backpack.jpg" },
      { id: "54e0eccd-8f36-462b-b68a-8182611d9add", label: "Top 100+", image: "images/products/black-2-slot-toaster.jpg" },
      { id: "a93a101d-79ef-4cf3-a6cf-6dbe532a1b4a", label: "Cozy finds", image: "images/products/bathroom-rug.jpg" }
    ]
  },
  {
    id: "shopbop-markdowns",
    title: "Shop markdowns from Shopbop",
    items: [
      { id: "b0f17cc5-8b40-4ca5-9142-b61fe3d98c85", label: "New Markdowns", image: "images/products/women-stretch-popover-hoodie-black.jpg" },
      { id: "8b5a2ee1-6055-422a-a666-b34ba28b76d4", label: "Accessories", image: "images/products/sky-flower-stud-earrings.webp" },
      { id: "04701903-bc79-49c6-bc11-1af7e3651358", label: "Shoes", image: "images/products/women-beach-sandals.jpg" },
      { id: "5968897c-4d27-4872-89f6-5bcb052746d7", label: "Men's", image: "images/products/men-golf-polo-t-shirt-blue.jpg" }
    ]
  },
  {
    id: "fall-styles",
    title: "Fall styles for all",
    items: [
      { id: "83d4ca15-0f35-48f5-b7a3-1ea210004f2e", label: "Men's", image: "images/products/adults-plain-cotton-tshirt-2-pack-teal.jpg" },
      { id: "dd82ca78-a18b-4e2a-9250-31e67412f98d", label: "Women's", image: "images/products/plain-hooded-fleece-sweatshirt-yellow.jpg" },
      { id: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6", label: "Kids'", image: "images/products/athletic-cotton-socks-6-pairs.jpg" },
      { id: "4df68c27-fd59-4a6a-bbd1-e754ddb6d53c", label: "Accessories", image: "images/products/men-navigator-sunglasses-brown.jpg" }
    ]
  },
  {
    id: "gift-cards",
    title: "Shop 450+ gift card brands",
    items: [
      { id: "c2a82c5e-aff4-435f-9975-517cfaba2ece", label: "Best sellers", image: "images/products/electric-glass-and-steel-hot-water-kettle.webp" },
      { id: "4e37dd03-3b23-4bc6-9ff8-44e112a92c64", label: "eGift cards", image: "images/products/non-stick-cooking-set-15-pieces.webp" },
      { id: "6b07d4e7-f540-454e-8a1e-363f25dbae7d", label: "Physical gift card", image: "images/products/facial-tissue-2-ply-18-boxes.jpg" },
      { id: "901eb2ca-386d-432e-82f0-6fb1ee7bf969", label: "Reload balance", image: "images/products/blackout-curtain-set-beige.webp" }
    ]
  },
  {
    id: "beauty-event",
    title: "Save up to 30% on Holiday Beauty Event",
    items: [
      { id: "a434b69f-1bc1-482d-9ce7-cd7f4a66ce8d", label: "Mirrors & tools", image: "images/products/vanity-mirror-silver.jpg" },
      { id: "6b07d4e7-f540-454e-8a1e-363f25dbae7d", label: "Skin tissues", image: "images/products/facial-tissue-2-ply-18-boxes.jpg" },
      { id: "e4f64a65-1377-42bc-89a5-e572d19252e2", label: "Jewelry essentials", image: "images/products/double-elongated-twist-french-wire-earrings.webp" },
      { id: "77919bbe-0e56-475b-adde-4f24dfed3a04", label: "Luxury towels", image: "images/products/luxury-tower-set-6-piece.jpg" }
    ]
  },
  {
    id: "fall-flavors",
    title: "Fall's favorite flavors",
    items: [
      { id: "0d7f9afa-2efe-4fd9-b0fd-ba5663e0a524", label: "Morning brew", image: "images/products/coffeemaker-with-glass-carafe-black.jpg" },
      { id: "77a845b1-16ed-4eac-bdf9-5b591882113d", label: "High speed", image: "images/products/countertop-blender-64-oz.jpg" },
      { id: "36c64692-677f-4f58-b5ec-0dc2cf109e27", label: "Baking bowls", image: "images/products/floral-mixing-bowl-set.jpg" },
      { id: "d37a651a-d501-483b-aae6-a9659b0757a0", label: "Fresh pantry", image: "images/products/round-airtight-food-storage-containers.jpg" }
    ]
  },
  {
    id: "pet-wellness",
    title: "Pet wellness must-haves",
    items: [
      { id: "b86ddc8b-3501-4b17-9889-a3bad6fb585f", label: "Clean home", image: "images/products/trash-can-with-foot-pedal-50-liter.jpg" },
      { id: "a93a101d-79ef-4cf3-a6cf-6dbe532a1b4a", label: "Washable rugs", image: "images/products/bathroom-rug.jpg" },
      { id: "15b6fc6f-327a-4ec4-896f-486349e85a3d", label: "Pet playtime", image: "images/products/intermediate-composite-basketball.jpg" },
      { id: "aaa65ef3-8d6f-4eb3-bc9b-a6ea49047d8f", label: "Paper cleanup", image: "images/products/kitchen-paper-towels-30-pack.jpg" }
    ]
  }
];

// Initialize on DOM load
renderQuadCategories();
loadProducts(() => {});
setupSearchRedirect();

function updateCartQuantity() {
  const cartQtyEl = document.querySelector(".js-cart-quantity");
  if (cartQtyEl) {
    cartQtyEl.innerHTML = calculateCartQuantity();
  }
}

function renderQuadCategories() {
  const container = document.querySelector(".js-quad-categories-grid");
  if (!container) return;

  let allCardsHTML = "";

  categoriesData.forEach((category) => {
    allCardsHTML += `
      <div class="quad-category-card" id="quad-card-${category.id}">
        <!-- HEADER: Title & Sleek Arrow Linking to products.html -->
        <a href="products.html" class="quad-card-header" title="Explore ${category.title}">
          <h2 class="quad-card-title">${category.title}</h2>
          <span class="quad-card-arrow" aria-label="Explore products">
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" fill="currentColor"/>
            </svg>
          </span>
        </a>

        <!-- 2x2 GRID (EXACTLY 4 ITEMS) -->
        <div class="quad-grid">
          ${category.items.map((item) => `
            <a href="products.html" class="quad-item" title="${item.label} - View Products">
              <div class="quad-item-img-box">
                <img class="quad-item-img" src="${item.image}" alt="${item.label}" loading="lazy">
              </div>
              <div class="quad-item-label">${item.label}</div>
            </a>
          `).join("")}
        </div>
      </div>
    `;
  });

  container.innerHTML = allCardsHTML;
  updateCartQuantity();
}

function setupSearchRedirect() {
  const searchInput = document.querySelector(".js-search-bar");
  const searchBtn = document.querySelector(".js-search-button");

  function goToProductsSearch() {
    if (!searchInput) return;
    const query = searchInput.value.trim();
    if (query) {
      window.location.href = `products.html?search=${encodeURIComponent(query)}`;
    } else {
      window.location.href = `products.html`;
    }
  }

  if (searchBtn) {
    searchBtn.addEventListener("click", goToProductsSearch);
  }

  if (searchInput) {
    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        goToProductsSearch();
      }
    });
  }
}
