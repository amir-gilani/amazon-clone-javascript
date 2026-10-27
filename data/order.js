// ═══════════════════════════════════════════════════════════════════════════════════════
// ORDERS DATA & LOCALSTORAGE MANAGEMENT
// Only contains orders that the user has actually placed. Starts empty.
// ═══════════════════════════════════════════════════════════════════════════════════════

export let orders = loadOrders();

export function loadOrders() {
  if (typeof localStorage === 'undefined') return [];
  const stored = localStorage.getItem('orders');
  if (!stored) return [];
  try {
    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch (e) {
    return [];
  }
}

export function addOrder(order) {
  orders.unshift(order);
  saveToStorage();
}

export function getOrder(orderId) {
  return orders.find((order) => order.id === orderId);
}

export function clearOrders() {
  orders = [];
  saveToStorage();
}

export function saveOrders() {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('orders', JSON.stringify(orders));
  }
}

function saveToStorage() {
  saveOrders();
}
