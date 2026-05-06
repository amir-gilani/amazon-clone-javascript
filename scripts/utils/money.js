// ═══════════════════════════════════════════════════════════════════════════════════════
// CURRENCY FORMATTING UTILITY
// Converts price in cents (e.g., 1090) to formatted dollars (e.g., "10.90")
// Used throughout: product-grid.js, cart.js, order-summary.js for price display
// Exported as default for easy import: import formatCurrency from "./utils/money.js"
// ═══════════════════════════════════════════════════════════════════════════════════════

/**
 * Formats price from cents to USD with 2 decimal places
 * @param {number} priceCents - Price in cents (e.g., 1090 = $10.90)
 * @returns {string} Formatted price string (e.g., "10.90")
 * @example
 * formatCurrency(1090)  // "10.90"
 * formatCurrency(2095)  // "20.95"
 */
export function formatCurrency(priceCents) {
  return (priceCents / 100).toFixed(2);
}

// Default export for named import convenience
export default formatCurrency;