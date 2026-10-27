// ═══════════════════════════════════════════════════════════════════════════════════════
// ORDERS DATA & LOCALSTORAGE MANAGEMENT
// Only contains orders that the user has actually placed. Starts empty.
// ═══════════════════════════════════════════════════════════════════════════════════════

// One-time reset to clear previous mock/dummy orders
if (typeof localStorage !== "undefined" && !localStorage.getItem("orders_fresh_reset_v4")) {
  localStorage.setItem("orders", JSON.stringify([]));
  localStorage.setItem("orders_fresh_reset_v4", "true");
}

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

export function addOrder(newOrder) {
  if (!orders) orders = [];

  let mergedAny = false;
  if (Array.isArray(newOrder.products)) {
    newOrder.products.forEach((newProd) => {
      for (const order of orders) {
        if (!Array.isArray(order.products)) continue;
        const match = order.products.find((p) => p.productId === newProd.productId);
        if (match) {
          match.quantity = (Number(match.quantity) || 0) + (Number(newProd.quantity) || 1);
          match.estimatedDeliveryTime = newProd.estimatedDeliveryTime || match.estimatedDeliveryTime;
          order.totalCostCents = (Number(order.totalCostCents) || 0) + (Number(newOrder.totalCostCents) || 0);
          order.orderTime = newOrder.orderTime || new Date().toISOString();
          mergedAny = true;
          break;
        }
      }
    });
  }

  if (!mergedAny) {
    orders.unshift(newOrder);
  }

  saveToStorage();
}

export function removeProductFromOrders(productId) {
  if (!orders || orders.length === 0) return;

  orders.forEach((order) => {
    if (Array.isArray(order.products)) {
      order.products = order.products.filter((p) => p.productId !== productId);
    }
  });

  orders = orders.filter((order) => Array.isArray(order.products) && order.products.length > 0);
  saveToStorage();
}

export function cancelOrder(orderId) {
  if (!orders || orders.length === 0) return;
  orders = orders.filter((order) => order.id !== orderId);
  saveToStorage();
}

export function getOrder(orderId) {
  return orders.find((order) => order.id === orderId);
}

export function clearOrders() {
  orders = [];
  saveToStorage();
}

function saveToStorage() {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('orders', JSON.stringify(orders));
  }
}
