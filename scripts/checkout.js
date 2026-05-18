import { renderOrderSummarry } from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";
import { loadProducts, loadProductsFetch } from "../data/products.js";
import { loadCart } from "../data/cart.js";

// import '../data/backend-practice.js';
// INITIAL RENDER

async function loadPage() {
  await loadProductsFetch();
  const value = await new Promise((resolve) => {
    loadCart(() => {
      resolve('value3');
    });
  });

  renderOrderSummarry();
  renderPaymentSummary();
}
loadPage()

/*
Promise.all([
  loadProductsFetch(),
  new Promise((resolve) => {
    loadCart(() => {
      resolve();
    });
  }),
]).then(() => {
  renderOrderSummarry();
  renderPaymentSummary();
});
*/

/*
new Promise((resolve) => {
  loadProducts(() => {
    resolve();
  });
})
  .then(() => {
    return new Promise((resolve) => {
      loadCart(() => {
        resolve();
      });
    });
  })
  .then(() => {
    renderOrderSummarry();
    renderPaymentSummary();
  });
*/

/*
loadProducts(() => {
  loadCart(() => {
    renderOrderSummarry();
    renderPaymentSummary();   
  })
});
*/
