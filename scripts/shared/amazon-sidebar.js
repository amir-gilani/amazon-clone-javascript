/**
 * AUTHENTIC AMAZON HAMBURGER SIDEBAR MENU (HMENU)
 * Provides slide-in customer drawer navigation matching the Amazon.com mobile & desktop experience.
 */

function initAmazonSidebar() {
  // Prevent duplicate initialization
  if (document.getElementById('hmenuBackdrop')) return;

  const sidebarHTML = `
    <!-- Dark Backdrop Overlay -->
    <div class="hmenu-backdrop" id="hmenuBackdrop"></div>

    <!-- External Close Button 'X' -->
    <button class="hmenu-close-btn" id="hmenuCloseBtn" aria-label="Close Menu">
      <svg viewBox="0 0 24 24">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>

    <!-- Slide-in Canvas -->
    <aside class="hmenu-canvas" id="hmenuCanvas" aria-label="Amazon Navigation Menu">
      <!-- Top Bar: "Hello, sign in" -->
      <a href="#" class="hmenu-header">
        <svg class="hmenu-user-avatar" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm0 14c-2.03 0-4.43-.82-6.14-2.88C7.55 15.8 9.68 15 12 15s4.45.8 6.14 2.12C16.43 19.18 14.03 20 12 20z"/>
        </svg>
        <span class="hmenu-header-title">Hello, sign in</span>
      </a>

      <!-- Scrollable Menu Content -->
      <div class="hmenu-content">
        <!-- 1. TRENDING -->
        <div class="hmenu-section">
          <h3 class="hmenu-title">Trending</h3>
          <a href="#" class="hmenu-item">
            <span class="hmenu-item-text">Best Sellers</span>
          </a>
          <a href="#" class="hmenu-item">
            <span class="hmenu-item-text">New Releases</span>
          </a>
          <a href="#" class="hmenu-item">
            <span class="hmenu-item-text">Movers & Shakers</span>
          </a>
        </div>

        <!-- 2. DIGITAL CONTENT & DEVICES -->
        <div class="hmenu-section">
          <h3 class="hmenu-title">Digital Content & Devices</h3>
          <a href="#" class="hmenu-item">
            <span class="hmenu-item-text">Prime Video</span>
            <span class="hmenu-chevron"></span>
          </a>
          <a href="#" class="hmenu-item">
            <span class="hmenu-item-text">Amazon Music</span>
            <span class="hmenu-chevron"></span>
          </a>
          <a href="#" class="hmenu-item">
            <span class="hmenu-item-text">Alexa</span>
            <span class="hmenu-chevron"></span>
          </a>
          <a href="#" class="hmenu-item">
            <span class="hmenu-item-text">Fire TV</span>
            <span class="hmenu-chevron"></span>
          </a>
          <a href="#" class="hmenu-item">
            <span class="hmenu-item-text">Amazon Luna</span>
            <span class="hmenu-chevron"></span>
          </a>
          <a href="#" class="hmenu-item">
            <span class="hmenu-item-text">Kindle</span>
            <span class="hmenu-chevron"></span>
          </a>
          <a href="#" class="hmenu-item">
            <span class="hmenu-item-text">Audible Books & Originals</span>
            <span class="hmenu-chevron"></span>
          </a>
          <a href="#" class="hmenu-item">
            <span class="hmenu-item-text">Amazon Photos</span>
            <span class="hmenu-chevron"></span>
          </a>
          <a href="#" class="hmenu-item">
            <span class="hmenu-item-text">Amazon Appstore</span>
            <span class="hmenu-chevron"></span>
          </a>
        </div>

        <!-- 3. SHOP BY DEPARTMENT -->
        <div class="hmenu-section">
          <h3 class="hmenu-title">Shop by Department</h3>
          <a href="#" class="hmenu-item">
            <span class="hmenu-item-text">Clothing, Shoes, Jewelry & Watches</span>
            <span class="hmenu-chevron"></span>
          </a>
          <a href="#" class="hmenu-item">
            <span class="hmenu-item-text">Whole Foods Market</span>
            <span class="hmenu-chevron"></span>
          </a>
          <a href="#" class="hmenu-item">
            <span class="hmenu-item-text">Books</span>
            <span class="hmenu-chevron"></span>
          </a>
          <a href="#" class="hmenu-item">
            <span class="hmenu-item-text">Movies, Music & Games</span>
            <span class="hmenu-chevron"></span>
          </a>

          <!-- Accordion Hidden Items -->
          <div class="hmenu-accordion-content" id="deptAccordion">
            <a href="#" class="hmenu-item">
              <span class="hmenu-item-text">Electronics</span>
              <span class="hmenu-chevron"></span>
            </a>
            <a href="#" class="hmenu-item">
              <span class="hmenu-item-text">Computers</span>
              <span class="hmenu-chevron"></span>
            </a>
            <a href="#" class="hmenu-item">
              <span class="hmenu-item-text">Smart Home</span>
              <span class="hmenu-chevron"></span>
            </a>
            <a href="#" class="hmenu-item">
              <span class="hmenu-item-text">Home, Garden & Tools</span>
              <span class="hmenu-chevron"></span>
            </a>
            <a href="#" class="hmenu-item">
              <span class="hmenu-item-text">Pet Supplies</span>
              <span class="hmenu-chevron"></span>
            </a>
            <a href="#" class="hmenu-item">
              <span class="hmenu-item-text">Beauty & Health</span>
              <span class="hmenu-chevron"></span>
            </a>
            <a href="#" class="hmenu-item">
              <span class="hmenu-item-text">Toys, Kids & Baby</span>
              <span class="hmenu-chevron"></span>
            </a>
          </div>

          <!-- See all trigger -->
          <div class="hmenu-see-all js-hmenu-see-all" data-target="deptAccordion">
            <span class="js-see-all-text">See all</span>
            <span class="hmenu-arrow-down"></span>
          </div>
        </div>

        <!-- 4. PROGRAMS & FEATURES -->
        <div class="hmenu-section">
          <h3 class="hmenu-title">Programs & Features</h3>
          <a href="#" class="hmenu-item">
            <span class="hmenu-item-text">Medical Care & Pharmacy</span>
            <span class="hmenu-chevron"></span>
          </a>
          <a href="#" class="hmenu-item">
            <span class="hmenu-item-text">Amazon Haul</span>
          </a>
          <a href="#" class="hmenu-item">
            <span class="hmenu-item-text">Amazon Business</span>
          </a>
          <a href="#" class="hmenu-item">
            <span class="hmenu-item-text">Sell on Amazon</span>
          </a>

          <!-- Accordion Hidden Items -->
          <div class="hmenu-accordion-content" id="featAccordion">
            <a href="#" class="hmenu-item">
              <span class="hmenu-item-text">Gift Cards</span>
            </a>
            <a href="#" class="hmenu-item">
              <span class="hmenu-item-text">Amazon Live</span>
            </a>
            <a href="#" class="hmenu-item">
              <span class="hmenu-item-text">International Shopping</span>
            </a>
          </div>

          <!-- See all trigger -->
          <div class="hmenu-see-all js-hmenu-see-all" data-target="featAccordion">
            <span class="js-see-all-text">See all</span>
            <span class="hmenu-arrow-down"></span>
          </div>
        </div>

        <!-- 5. HELP & SETTINGS -->
        <div class="hmenu-section">
          <h3 class="hmenu-title">Help & Settings</h3>
          <a href="#" class="hmenu-item">
            <span class="hmenu-item-text">Your Account</span>
          </a>
          <a href="#" class="hmenu-item">
            <span class="hmenu-item-text">
              <svg class="hmenu-globe-icon" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              </svg>
              English
            </span>
          </a>
          <a href="#" class="hmenu-item">
            <span class="hmenu-item-text">
              <span class="hmenu-flag">🇺🇸</span>
              United States
            </span>
          </a>
          <a href="#" class="hmenu-item">
            <span class="hmenu-item-text">Sign in</span>
          </a>
        </div>
      </div>
    </aside>
  `;

  // Append sidebar to body
  const wrapper = document.createElement('div');
  wrapper.id = 'amazonHmenuRoot';
  wrapper.innerHTML = sidebarHTML;
  document.body.appendChild(wrapper);

  const backdrop = document.getElementById('hmenuBackdrop');
  const closeBtn = document.getElementById('hmenuCloseBtn');
  const canvas = document.getElementById('hmenuCanvas');

  function openHmenu() {
    backdrop.classList.add('open');
    closeBtn.classList.add('open');
    canvas.classList.add('open');
    document.body.classList.add('hmenu-active');
  }

  function closeHmenu() {
    backdrop.classList.remove('open');
    closeBtn.classList.remove('open');
    canvas.classList.remove('open');
    document.body.classList.remove('hmenu-active');
  }

  // Bind close events
  backdrop.addEventListener('click', closeHmenu);
  closeBtn.addEventListener('click', closeHmenu);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && canvas.classList.contains('open')) {
      closeHmenu();
    }
  });

  // Global delegation for opening hamburger menu
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('.subnav-link-all, .subnav-hamburger-icon');
    if (trigger) {
      e.preventDefault();
      openHmenu();
    }
  });

  // Accordion "See all" / "See less" toggles
  document.querySelectorAll('.js-hmenu-see-all').forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const targetEl = document.getElementById(targetId);
      const textSpan = btn.querySelector('.js-see-all-text');
      if (!targetEl) return;

      const isExpanded = btn.classList.contains('expanded');
      if (isExpanded) {
        btn.classList.remove('expanded');
        targetEl.classList.remove('expanded');
        if (textSpan) textSpan.textContent = 'See all';
      } else {
        btn.classList.add('expanded');
        targetEl.classList.add('expanded');
        if (textSpan) textSpan.textContent = 'See less';
      }
    });
  });
}

/**
 * SMART SCROLLING HEADER (SHARED ACROSS ALL PAGES)
 * Scrolling Down: Both header 1 & header 2 hide smoothly.
 * Scrolling Up: Header 1 appears immediately; Header 2 appears when reaching banner/top section.
 */
function initSmartScrollHeader() {
  let lastScrollY = Math.max(0, window.scrollY);
  let ticking = false;

  function getBannerBottom() {
    const heroBanner = document.getElementById('gwm-Deck-cf');
    if (heroBanner) {
      const rect = heroBanner.getBoundingClientRect();
      return rect.bottom + window.scrollY;
    }

    const visaPromo = document.querySelector('.visa-promo-card');
    if (visaPromo) {
      const rect = visaPromo.getBoundingClientRect();
      return rect.bottom + window.scrollY;
    }

    return 400;
  }

  function handleScroll() {
    const currentScrollY = Math.max(0, window.scrollY);
    const bannerBottom = getBannerBottom();

    // 1. At or close to top of page (<= 20px): both headers always visible
    if (currentScrollY <= 20) {
      document.body.classList.remove('header-hidden');
      document.body.classList.remove('subnav-hidden');
      lastScrollY = currentScrollY;
      ticking = false;
      return;
    }

    const scrollDiff = currentScrollY - lastScrollY;

    if (Math.abs(scrollDiff) > 4) {
      if (scrollDiff > 0) {
        // SCROLLING DOWN: Hide both headers
        document.body.classList.add('header-hidden');
      } else {
        // SCROLLING UP: Header 1 always appears
        document.body.classList.remove('header-hidden');

        // Header 2 only visible at/above banner threshold
        if (currentScrollY <= bannerBottom) {
          document.body.classList.remove('subnav-hidden');
        } else {
          document.body.classList.add('subnav-hidden');
        }
      }
      lastScrollY = currentScrollY;
    }

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(handleScroll);
      ticking = true;
    }
  }, { passive: true });

  handleScroll();
}

function initAllSharedHeaderFeatures() {
  initAmazonSidebar();
  initSmartScrollHeader();
}

// Auto-run when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAllSharedHeaderFeatures);
} else {
  initAllSharedHeaderFeatures();
}

export { initAmazonSidebar, initSmartScrollHeader };
