const defaultOrders = [
  {
    id: "27cba69d-4c3d-4098-b42d-ac7fa62b7664",
    orderTime: "2026-08-12T10:30:00.000Z",
    totalCostCents: 3506,
    products: [
      {
        productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
        quantity: 1,
        estimatedDeliveryTime: "2026-08-15T15:00:00.000Z",
        variation: null
      },
      {
        productId: "83d4ca15-0f35-48f5-b7a3-1ea210004f2e",
        quantity: 2,
        estimatedDeliveryTime: "2026-08-19T15:00:00.000Z",
        variation: null
      }
    ]
  },
  {
    id: "b6b6c212-d30e-4d4a-805d-90b52ce6b37d",
    orderTime: "2026-06-10T14:15:00.000Z",
    totalCostCents: 4190,
    products: [
      {
        productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
        quantity: 2,
        estimatedDeliveryTime: "2026-06-17T18:00:00.000Z",
        variation: null
      }
    ]
  }
];

export let orders = loadOrders();

function loadOrders() {
  if (typeof localStorage === 'undefined') return defaultOrders;
  const stored = localStorage.getItem('orders');
  if (!stored) {
    localStorage.setItem('orders', JSON.stringify(defaultOrders));
    return defaultOrders;
  }
  try {
    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    return defaultOrders;
  } catch (e) {
    return defaultOrders;
  }
}

export function addOrder(order) {
  orders.unshift(order);
  saveToStorage();
}

export function getOrder(orderId) {
  return orders.find((order) => order.id === orderId);
}

function saveToStorage() {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('orders', JSON.stringify(orders));
  }
}
