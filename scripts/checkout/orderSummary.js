import { cart } from '../../data/cart-instance.js';
import { products, getProduct } from '../../data/products.js';
import { formatCurrency } from '../utils/money.js';
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';
import { deliveryOptions, getDeliveryOption } from '../../data/deliveryOptions.js';
import { renderPaymentSummary } from './paymentSummary.js';

export function renderOrderSummary() {
  let cartSummaryHTML = '';

  cart.cartItems.forEach((cartItem) => {
    const productId = cartItem.productId;

    //find the product in products.js by ID
    const matchingProduct = getProduct(productId);

    if (!matchingProduct) {
      console.warn(`No product found for ID: ${productId}`);
      return;
    }

    //find the delivery option in deliveryOptions.js 
    const deliveryOptionId = cartItem.deliveryOptionId;

    const deliveryOption = getDeliveryOption(deliveryOptionId);

    if (!deliveryOption) {
      deliveryOption = { deliveryDays: 7 };
    }

    const today = dayjs();
    const deliveryDate = today.add(
      deliveryOption.deliveryDays, 'days'
    );
    const dateString = deliveryDate.format(
      'dddd, MMMM, D'
    );

    //Generate the HTML code for every product
    cartSummaryHTML +=
      `
    <div class="cart-item-container
    js-cart-item-container-${matchingProduct.id}">
      <div class="delivery-date">
        Delivery date: ${dateString}
      </div>

        <div class="cart-item-details-grid">
          <img class="product-image"
            src="${matchingProduct.image}">

        <div class="cart-item-details">
          <div class="product-name">
            ${matchingProduct.name}
          </div>
          <div class="product-price">
            $${formatCurrency(matchingProduct.priceCents)}
          </div>
          <div class="product-quantity">
            <span>
              Quantity: <span class="quantity-label">${cartItem.quantity}</span>
            </span>
            <span class="update-quantity-link link-primary js-update-link"
            data-product-id="${matchingProduct.id}">
              Update
            </span>
            <input class="quantity-input js-quantity-input">
            <span class="save-quantity-link link-primary js-save-link"
            data-product-id="${matchingProduct.id}">
              Save
            </span>
            <span class="delete-quantity-link link-primary js-delete-link"
            data-product-id="${matchingProduct.id}">
              Delete
            </span>
          </div>
        </div>

        <div class="delivery-options">
          <div class="delivery-options-title">
            Choose a delivery option:
          </div>
          ${deliveryOptionsHTML(matchingProduct, cartItem)}
        </div>
      </div>
    </div>
  `
  });

  function deliveryOptionsHTML(matchingProduct, cartItem) {
    let html = '';

    deliveryOptions.forEach((deliveryOption) => {
      const today = dayjs();
      const deliveryDate = today.add(
        deliveryOption.deliveryDays, 'days'
      );
      const dateString = deliveryDate.format(
        'dddd, MMMM, D'
      );
      const priceString = deliveryOption.priceCents === 0
        ? 'FREE'
        : `$${formatCurrency(deliveryOption.priceCents)} -`

      const isChecked = (
        deliveryOption.id === cartItem.deliveryOptionId ||
        (!cartItem.deliveryOptionId && deliveryOption.priceCents === 0)
      );


      html +=
        `
      <div class="delivery-option js-delivery-option"
        data-product-id="${matchingProduct.id}"
        data-delivery-option-id="${deliveryOption.id}">
        <input type="radio"
          class="delivery-option-input"
          ${isChecked ? 'checked' : ''}
          name="delivery-option-${matchingProduct.id}">
        <div>
          <div class="delivery-option-date">
            ${dateString}
          </div>
          <div class="delivery-option-price">
            ${priceString} Shipping
          </div>
        </div>
      </div>
    `
    });

    return html;
  }

  document.querySelector('.js-order-summary')
    .innerHTML = cartSummaryHTML;

  document.querySelectorAll('.js-delete-link')
    .forEach((link) => {
      link.addEventListener('click', () => {
        const productId = link.dataset.productId
        cart.removeFromCart(productId);

        renderOrderSummary();
        renderPaymentSummary();
      });
    });

  document.querySelectorAll('.js-delivery-option')
    .forEach((elem) => {
      elem.addEventListener('click', () => {
        const { productId, deliveryOptionId } = elem.dataset;
        cart.updateDeliveryOption(productId, deliveryOptionId);
        renderOrderSummary();
        renderPaymentSummary();
      });
    });


  // Handle "Update" link click
  document.querySelectorAll('.js-update-link')
    .forEach((link) => {
      link.addEventListener('click', () => {
        const productId = link.dataset.productId;
        console.log('Update clicked for product ID:', productId);

        const container = document.querySelector(`.js-cart-item-container-${productId}`);
        container.classList.add('is-editing-quantity');
      });
    });

  // Handle "Save" link click
  document.querySelectorAll('.save-quantity-link')
    .forEach((link) => {
      link.addEventListener('click', () => {
        const productId = link.dataset.productId;
        console.log('Save clicked for product ID:', productId);

        const container = document.querySelector(`.js-cart-item-container-${productId}`);
        container.classList.remove('is-editing-quantity');

        const quantityInput = container.querySelector('.js-quantity-input');
        const newQuantity = Number(quantityInput.value);

        if (isNaN(newQuantity) || newQuantity < 1 || newQuantity > 99) {
          // Show an error message or alert if the quantity is invalid
          alert('Please select a valid quantity.');
          return;
        }

        // Update the quantity in the cart
        cart.updateQuantity(productId, newQuantity);
        renderOrderSummary();
        renderPaymentSummary();
      });
    });

    // Handle Total Items in Cart
    document.querySelector('.js-cart-total-items')
    .innerHTML = `${cart.getCartQuantity()} items`;
}