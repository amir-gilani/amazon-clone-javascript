import {
  addToCart,
  addToCartAnimation,
  calculateCartQuantity,
} from "../data/cart.js";
import { products, loadProducts } from "../data/products.js";

// ═══════════════════════════════════════════════════════════════════════════════════════
// CATEGORIES DATA DEFINITION (4-QUADRANT CARDS WITH MULTI-PAGE SLIDES)
// ═══════════════════════════════════════════════════════════════════════════════════════
const categoriesData = [
  {
    id: "fall-picks",
    title: "Shop fall premium picks",
    linkText: "See all fall deals",
    currentPage: 0,
    pages: [
      [
        { id: "8c9c52b5-5a19-4bcb-a5d1-158a74287c53", label: "Hosting essentials", image: "images/products/6-piece-non-stick-baking-set.webp", price: "$35.00" },
        { id: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6", label: "Seasonal styles", image: "images/products/backpack.jpg", price: "$32.99" },
        { id: "54e0eccd-8f36-462b-b68a-8182611d9add", label: "Top 100+", image: "images/products/black-2-slot-toaster.jpg", price: "$18.99" },
        { id: "a93a101d-79ef-4cf3-a6cf-6dbe532a1b4a", label: "Cozy finds", image: "images/products/bathroom-rug.jpg", price: "$15.50" }
      ],
      [
        { id: "0d7f9afa-2efe-4fd9-b0fd-ba5663e0a524", label: "Coffee bar", image: "images/products/coffeemaker-with-glass-carafe-black.jpg", price: "$22.50" },
        { id: "77a845b1-16ed-4eac-bdf9-5b591882113d", label: "High speed", image: "images/products/countertop-blender-64-oz.jpg", price: "$107.47" },
        { id: "d37a651a-d501-483b-aae6-a9659b0757a0", label: "Food prep", image: "images/products/round-airtight-food-storage-containers.jpg", price: "$28.99" },
        { id: "3ebe75dc-64d2-4137-8860-1f5a963e534b", label: "Dining sets", image: "images/products/6-piece-white-dinner-plate-set.jpg", price: "$20.67" }
      ]
    ]
  },
  {
    id: "boots-kicks",
    title: "Boots and kicks for the whole crew",
    linkText: "Explore all footwear",
    currentPage: 0,
    pages: [
      [
        { id: "58b4fc92-e98c-42aa-8c55-b6b79996769a", label: "Women's", image: "images/products/knit-athletic-sneakers-gray.jpg", price: "$33.90" },
        { id: "ee1f7c56-f977-40a4-9642-12ba5072e2b0", label: "Men's", image: "images/products/men-chino-pants-beige.jpg", price: "$22.90" },
        { id: "4f4fbcc2-4e72-45cc-935c-9e13d79cc57f", label: "Girls'", image: "images/products/women-knit-ballet-flat-black.jpg", price: "$26.40" },
        { id: "1c079479-8586-494f-ab53-219325432536", label: "Boys'", image: "images/products/men-athletic-shoes-green.jpg", price: "$38.90" }
      ],
      [
        { id: "83d4ca15-0f35-48f5-b7a3-1ea210004f2e", label: "Casual tees", image: "images/products/adults-plain-cotton-tshirt-2-pack-teal.jpg", price: "$7.99" },
        { id: "dd82ca78-a18b-4e2a-9250-31e67412f98d", label: "Warm hoodies", image: "images/products/plain-hooded-fleece-sweatshirt-yellow.jpg", price: "$24.00" },
        { id: "82bb68d7-ebc9-476a-989c-c78a40ee5cd9", label: "Summer shorts", image: "images/products/men-slim-fit-summer-shorts-gray.jpg", price: "$16.99" },
        { id: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6", label: "Cotton socks", image: "images/products/athletic-cotton-socks-6-pairs.jpg", price: "$10.90" }
      ]
    ]
  },
  {
    id: "gift-cards",
    title: "Shop 450+ gift card brands",
    linkText: "Shop all cards & reload",
    currentPage: 0,
    pages: [
      [
        { id: "c2a82c5e-aff4-435f-9975-517cfaba2ece", label: "Best sellers", image: "images/products/electric-glass-and-steel-hot-water-kettle.webp", price: "$30.74" },
        { id: "4e37dd03-3b23-4bc6-9ff8-44e112a92c64", label: "eGift cards", image: "images/products/non-stick-cooking-set-15-pieces.webp", price: "$67.97" },
        { id: "6b07d4e7-f540-454e-8a1e-363f25dbae7d", label: "Physical gift card", image: "images/products/facial-tissue-2-ply-18-boxes.jpg", price: "$23.74" },
        { id: "901eb2ca-386d-432e-82f0-6fb1ee7bf969", label: "Reload balance", image: "images/products/blackout-curtain-set-beige.webp", price: "$45.99" }
      ],
      [
        { id: "36c64692-677f-4f58-b5ec-0dc2cf109e27", label: "Kitchen finds", image: "images/products/floral-mixing-bowl-set.jpg", price: "$38.99" },
        { id: "aaa65ef3-8d6f-4eb3-bc9b-a6ea49047d8f", label: "Daily household", image: "images/products/kitchen-paper-towels-30-pack.jpg", price: "$57.99" },
        { id: "b86ddc8b-3501-4b17-9889-a3bad6fb585f", label: "Home utility", image: "images/products/trash-can-with-foot-pedal-50-liter.jpg", price: "$83.00" },
        { id: "77919bbe-0e56-475b-adde-4f24dfed3a04", label: "Bath luxury", image: "images/products/luxury-tower-set-6-piece.jpg", price: "$35.99" }
      ]
    ]
  },
  {
    id: "shopbop-markdowns",
    title: "Shop markdowns from Shopbop",
    linkText: "See all markdowns",
    currentPage: 0,
    pages: [
      [
        { id: "b0f17cc5-8b40-4ca5-9142-b61fe3d98c85", label: "New Markdowns", image: "images/products/women-stretch-popover-hoodie-black.jpg", price: "$13.74" },
        { id: "8b5a2ee1-6055-422a-a666-b34ba28b76d4", label: "Accessories", image: "images/products/men-golf-polo-t-shirt-blue.jpg", price: "$15.99" },
        { id: "04701903-bc79-49c6-bc11-1af7e3651358", label: "Shoes", image: "images/products/women-beach-sandals.jpg", price: "$24.99" },
        { id: "5968897c-4d27-4872-89f6-5bcb052746d7", label: "Men's & Women", image: "images/products/women-chiffon-beachwear-coverup-black.jpg", price: "$20.70" }
      ],
      [
        { id: "aad29d11-ea98-41ee-9285-b916638cac4a", label: "Designer frames", image: "images/products/round-sunglasses-black.jpg", price: "$15.60" },
        { id: "a82c6bac-3067-4e68-a5ba-d827ac0be010", label: "Summer hats", image: "images/products/straw-sunhat.webp", price: "$22.00" },
        { id: "e4f64a65-1377-42bc-89a5-e572d19252e2", label: "Silver studs", image: "images/products/sky-flower-stud-earrings.webp", price: "$17.99" },
        { id: "d2785924-743d-49b3-8f03-ec258e640503", label: "Warm beanies", image: "images/products/women-chunky-beanie-gray.webp", price: "$12.50" }
      ]
    ]
  },
  {
    id: "fall-styles",
    title: "Fall styles for all",
    linkText: "Shop the collection",
    currentPage: 0,
    pages: [
      [
        { id: "02e3a47e-dd68-467e-9f71-8bf6f723fdae", label: "Window panels", image: "images/products/blackout-curtains-black.jpg", price: "$45.99" },
        { id: "8a53b080-6d40-4a65-ab26-b24ecf700bce", label: "Bath linens", image: "images/products/cotton-bath-towels-teal.webp", price: "$21.10" },
        { id: "19c6a64a-5463-4d45-9af8-e41140a4100c", label: "Bedding comfort", image: "images/products/duvet-cover-set-blue-twin.jpg", price: "$65.00" },
        { id: "4df68c27-fd59-4a6a-bbd1-e754ddb6d53c", label: "Eyewear", image: "images/products/men-navigator-sunglasses-brown.jpg", price: "$16.90" }
      ],
      [
        { id: "15b6fc6f-327a-4ec4-896f-486349e85a3d", label: "Recreation", image: "images/products/intermediate-composite-basketball.jpg", price: "$20.95" },
        { id: "a434b69f-1bc1-482d-9ce7-cd7f4a66ce8d", label: "Beauty mirror", image: "images/products/vanity-mirror-silver.jpg", price: "$16.49" },
        { id: "3fdfe8d6-9a15-4979-b459-585b0d0545b9", label: "Laundry care", image: "images/products/liquid-laundry-detergent-plain.jpg", price: "$28.99" },
        { id: "58b4fc92-e98c-42aa-8c55-b6b79996769a", label: "Athletic wear", image: "images/products/knit-athletic-sneakers-gray.jpg", price: "$33.90" }
      ]
    ]
  },
  {
    id: "beauty-event",
    title: "Save up to 30% on Holiday Beauty Event",
    linkText: "Shop beauty deals",
    currentPage: 0,
    pages: [
      [
        { id: "a434b69f-1bc1-482d-9ce7-cd7f4a66ce8d", label: "Mirrors & tools", image: "images/products/vanity-mirror-silver.jpg", price: "$16.49" },
        { id: "6b07d4e7-f540-454e-8a1e-363f25dbae7d", label: "Skin tissues", image: "images/products/facial-tissue-2-ply-18-boxes.jpg", price: "$23.74" },
        { id: "e4f64a65-1377-42bc-89a5-e572d19252e2", label: "Jewelry essentials", image: "images/products/sky-flower-stud-earrings.webp", price: "$17.99" },
        { id: "77919bbe-0e56-475b-adde-4f24dfed3a04", label: "Luxury towels", image: "images/products/luxury-tower-set-6-piece.jpg", price: "$35.99" }
      ],
      [
        { id: "8a53b080-6d40-4a65-ab26-b24ecf700bce", label: "Plush cotton", image: "images/products/cotton-bath-towels-teal.webp", price: "$21.10" },
        { id: "a93a101d-79ef-4cf3-a6cf-6dbe532a1b4a", label: "Spa bath mats", image: "images/products/bathroom-rug.jpg", price: "$15.50" },
        { id: "d2785924-743d-49b3-8f03-ec258e640503", label: "Winter beanies", image: "images/products/women-chunky-beanie-gray.webp", price: "$12.50" },
        { id: "4f4fbcc2-4e72-45cc-935c-9e13d79cc57f", label: "Comfort flats", image: "images/products/women-knit-ballet-flat-black.jpg", price: "$26.40" }
      ]
    ]
  },
  {
    id: "fall-flavors",
    title: "Fall's favorite flavors",
    linkText: "Explore groceries",
    currentPage: 0,
    pages: [
      [
        { id: "c2a82c5e-aff4-435f-9975-517cfaba2ece", label: "Hot beverages", image: "images/products/electric-glass-and-steel-hot-water-kettle.webp", price: "$30.74" },
        { id: "0d7f9afa-2efe-4fd9-b0fd-ba5663e0a524", label: "Morning brew", image: "images/products/coffeemaker-with-glass-carafe-black.jpg", price: "$22.50" },
        { id: "36c64692-677f-4f58-b5ec-0dc2cf109e27", label: "Baking bowls", image: "images/products/floral-mixing-bowl-set.jpg", price: "$38.99" },
        { id: "d37a651a-d501-483b-aae6-a9659b0757a0", label: "Fresh pantry", image: "images/products/round-airtight-food-storage-containers.jpg", price: "$28.99" }
      ],
      [
        { id: "8c9c52b5-5a19-4bcb-a5d1-158a74287c53", label: "Oven bakeware", image: "images/products/6-piece-non-stick-baking-set.webp", price: "$35.00" },
        { id: "4e37dd03-3b23-4bc6-9ff8-44e112a92c64", label: "Cookware sets", image: "images/products/non-stick-cooking-set-15-pieces.webp", price: "$67.97" },
        { id: "54e0eccd-8f36-462b-b68a-8182611d9add", label: "Breakfast toast", image: "images/products/black-2-slot-toaster.jpg", price: "$18.99" },
        { id: "77a845b1-16ed-4eac-bdf9-5b591882113d", label: "Smoothies", image: "images/products/countertop-blender-64-oz.jpg", price: "$107.47" }
      ]
    ]
  },
  {
    id: "pet-wellness",
    title: "Pet wellness must-haves",
    linkText: "Shop all pet supplies",
    currentPage: 0,
    pages: [
      [
        { id: "b86ddc8b-3501-4b17-9889-a3bad6fb585f", label: "Clean home", image: "images/products/trash-can-with-foot-pedal-50-liter.jpg", price: "$83.00" },
        { id: "a93a101d-79ef-4cf3-a6cf-6dbe532a1b4a", label: "Washable rugs", image: "images/products/bathroom-rug.jpg", price: "$15.50" },
        { id: "15b6fc6f-327a-4ec4-896f-486349e85a3d", label: "Pet playtime", image: "images/products/intermediate-composite-basketball.jpg", price: "$20.95" },
        { id: "aaa65ef3-8d6f-4eb3-bc9b-a6ea49047d8f", label: "Paper cleanup", image: "images/products/kitchen-paper-towels-30-pack.jpg", price: "$57.99" }
      ],
      [
        { id: "3fdfe8d6-9a15-4979-b459-585b0d0545b9", label: "Pet safe wash", image: "images/products/liquid-laundry-detergent-plain.jpg", price: "$28.99" },
        { id: "77919bbe-0e56-475b-adde-4f24dfed3a04", label: "Grooming towels", image: "images/products/luxury-tower-set-6-piece.jpg", price: "$35.99" },
        { id: "d37a651a-d501-483b-aae6-a9659b0757a0", label: "Kibble storage", image: "images/products/round-airtight-food-storage-containers.jpg", price: "$28.99" },
        { id: "6b07d4e7-f540-454e-8a1e-363f25dbae7d", label: "Gentle wipes", image: "images/products/facial-tissue-2-ply-18-boxes.jpg", price: "$23.74" }
      ]
    ]
  }
];

// Initialize on products load
renderQuadCategories();
loadProducts(() => {});

function updateCartQuantity() {
  const cartQtyEl = document.querySelector(".js-cart-quantity");
  if (cartQtyEl) {
    cartQtyEl.innerHTML = calculateCartQuantity();
  }
}

function renderQuadCardItemsHTML(category) {
  const pageItems = category.pages[category.currentPage] || category.pages[0];
  let itemsHTML = "";

  pageItems.forEach((item) => {
    itemsHTML += `
      <div class="quad-item js-quad-product" data-product-id="${item.id}" title="${item.label} - Click to add to cart">
        <div class="quad-item-img-box">
          <img class="quad-item-img" src="${item.image}" alt="${item.label}">
        </div>
        <div class="quad-item-label">${item.label}</div>
        <div class="quad-item-price">${item.price}</div>
        <button class="quad-item-add-btn js-quad-add-to-cart" data-product-id="${item.id}">+ Add</button>
      </div>
    `;
  });

  return itemsHTML;
}

function renderQuadCategories() {
  const container = document.querySelector(".js-quad-categories-grid");
  if (!container) return;

  let allCardsHTML = "";

  categoriesData.forEach((category) => {
    const totalPages = category.pages.length;
    const isNext = category.currentPage < totalPages - 1;
    const arrowSymbol = isNext ? "›" : "‹";

    allCardsHTML += `
      <div class="quad-category-card" id="quad-card-${category.id}">
        <!-- HEADER: Title & Top-Right Arrow -->
        <div class="quad-card-header">
          <h2 class="quad-card-title">${category.title}</h2>
          <button class="quad-card-arrow-btn js-quad-arrow" 
                  data-category-id="${category.id}" 
                  title="${isNext ? 'Show remaining products' : 'Go back to first products'}" 
                  aria-label="Toggle products">
            ${arrowSymbol}
          </button>
        </div>

        <!-- 2x2 GRID (4 PRODUCTS) -->
        <div class="quad-grid js-quad-grid-${category.id}">
          ${renderQuadCardItemsHTML(category)}
        </div>

        <!-- FOOTER: Link & Page Indicator -->
        <div class="quad-card-footer">
          <a href="#" class="quad-card-link">${category.linkText}</a>
          <span class="quad-page-badge js-quad-badge-${category.id}">
            ${category.currentPage + 1} of ${totalPages}
          </span>
        </div>
      </div>
    `;
  });

  container.innerHTML = allCardsHTML;
  updateCartQuantity();
  attachEventListeners();
}

function attachEventListeners() {
  // Arrow click handler: Cycles/pages through the products in that card
  document.querySelectorAll(".js-quad-arrow").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const categoryId = btn.dataset.categoryId;
      const category = categoriesData.find((c) => c.id === categoryId);
      if (!category) return;

      const gridEl = document.querySelector(`.js-quad-grid-${categoryId}`);
      const badgeEl = document.querySelector(`.js-quad-badge-${categoryId}`);

      // Smooth fade transition
      if (gridEl) {
        gridEl.classList.add("fade-out");
      }

      setTimeout(() => {
        // Toggle/Advance page
        category.currentPage = (category.currentPage + 1) % category.pages.length;

        if (gridEl) {
          gridEl.innerHTML = renderQuadCardItemsHTML(category);
          gridEl.classList.remove("fade-out");
        }

        // Update arrow symbol: › if page 0, ‹ if page 1
        const isNext = category.currentPage < category.pages.length - 1;
        btn.innerHTML = isNext ? "›" : "‹";
        btn.title = isNext ? "Show remaining products" : "Go back to first products";

        if (badgeEl) {
          badgeEl.textContent = `${category.currentPage + 1} of ${category.pages.length}`;
        }

        // Re-attach add to cart listeners for new items
        attachAddToCartListeners();
      }, 150);
    });
  });

  attachAddToCartListeners();
}

function attachAddToCartListeners() {
  document.querySelectorAll(".js-quad-add-to-cart").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const productId = btn.dataset.productId;
      addToCart(productId, 1);
      updateCartQuantity();

      // Feedback animation on the button
      const originalText = btn.textContent;
      btn.textContent = "✓ Added";
      btn.style.backgroundColor = "#2ecc71";
      btn.style.color = "#ffffff";
      btn.style.borderColor = "#27ae60";

      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.backgroundColor = "";
        btn.style.color = "";
        btn.style.borderColor = "";
      }, 1200);
    });
  });

  // Clicking anywhere on the item box also triggers add
  document.querySelectorAll(".js-quad-product").forEach((item) => {
    item.addEventListener("click", (e) => {
      if (e.target.classList.contains("js-quad-add-to-cart")) return;
      const addBtn = item.querySelector(".js-quad-add-to-cart");
      if (addBtn) addBtn.click();
    });
  });
}
