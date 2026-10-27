export const orders = typeof localStorage !== 'undefined'
  ? (JSON.parse(localStorage.getItem('orders')) || [])
  : [];

export function addOrder(order) {
  orders.unshift(order);
  saveToStorage();
}

function saveToStorage() {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('orders', JSON.stringify(orders));
  }
}
