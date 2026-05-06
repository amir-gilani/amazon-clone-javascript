// ═══════════════════════════════════════════════════════════════════════════════════════
// DELIVERY OPTIONS CONFIGURATION
// Defines available delivery options with ID, delivery days, and pricing
// Used in cart summary for shipping date calculations and cost display
// ═══════════════════════════════════════════════════════════════════════════════════════
export const deliveryOptions = [
  {
    // STANDARD SHIPPING (FREE)
    // 7-day delivery window, no additional cost
    id: "1",
    deliveryDays: 7,
    priceCents: 0,
  },
  {
    // EXPRESS SHIPPING
    // 3-day delivery window, $4.99 fee
    id: "2",
    deliveryDays: 3,
    priceCents: 499,
  },
  {
    // NEXT DAY DELIVERY
    // 1-day delivery window, $9.99 premium fee
    id: "3",
    deliveryDays: 1,
    priceCents: 999,
  },
];
