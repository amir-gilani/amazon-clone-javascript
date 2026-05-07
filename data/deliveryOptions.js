import dayjs from "http://unpkg.com/dayjs@1.11.10/esm/index.js"; //ESM external library && defult import
// ═══════════════════════════════════════════════════════════════════════════════════════
// DELIVERY OPTIONS CONFIGURATION
// Defines available delivery options with ID, delivery days, and pricing
// Used in cart summary for shipping date calculations and cost display
// ═══════════════════════════════════════════════════════════════════════════════════════
export function isWeekend(date) {
  const dayName = date.format("dddd");
  return dayName === "Saturday" || dayName === "Sunday";
}

export function calculateDeliveryDate(deliveryDays) {
  // Fixed typo!
  const today = dayjs();
  let deliveryDate = today.clone();
  let remainingDays = deliveryDays;

  while (remainingDays > 0) {
    deliveryDate = deliveryDate.add(1, "day");
    if (!isWeekend(deliveryDate)) {
      remainingDays--;
    }
  }

  return deliveryDate.format("dddd, MMMM D");
}

export function getDeliveryOption(deliveryOptionId) {
  let deliveryOption;
  deliveryOptions.forEach((option) => {
    if (deliveryOptionId === option.id) {
      deliveryOption = option;
    }
  });
  return deliveryOption;
}
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
