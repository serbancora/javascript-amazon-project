import { cart } from '../data/cart-instance.js';
import { products } from '../data/products.js';

// Load the cart quantity on page load
updateCartQuantity();

let productsHTML = '';

products.forEach((product) => {
  productsHTML +=
    `
    <div class="product-container">
      <div class="product-image-container">
        <img class="product-image"
          src="${product.image}">
      </div>

      <div class="product-name limit-text-to-2-lines">
        ${product.name}
      </div>

      <div class="product-rating-container">
        <img class="product-rating-stars"
          src="${product.getStarsUrl()}">
        <div class="product-rating-count link-primary">
          ${product.rating.count}
        </div>
      </div>

      <div class="product-price">
        ${product.getPrice()}
      </div>

      <div class="product-quantity-container js-product-quantity-selector-${product.id}">
        <select>
          <option selected value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
        </select>
      </div>

      ${product.extraInfoHTML()}

      <div class="product-spacer"></div>

      <div class="added-to-cart js-added-to-cart-${product.id}">
        <img src="images/icons/checkmark.png">
        Added
      </div>

      <button class="add-to-cart-button button-primary js-add-to-cart"
      data-product-id="${product.id}">
        Add to Cart
      </button>
    </div>
  `
});

document.querySelector('.js-products-grid')
  .innerHTML = productsHTML;

function updateCartQuantity() {
  // update cart total quantity on the webpage
  const cartQuantity = cart.getCartQuantity();

  // if cart is empty, dont show the cart quantity
  if(cartQuantity === 0) {
    return;
  }

  document.querySelector('.js-cart-quantity')
    .innerHTML = cartQuantity
}

const timeoutIds = {}; // to store timeout IDs for each product

document.querySelectorAll('.js-add-to-cart')
  .forEach((button) => {
    button.addEventListener('click', () => {
      const productId = button.dataset.productId;
      const quantitySelector = document.querySelector(`.js-product-quantity-selector-${productId} select`);
      const quantity = Number(quantitySelector.value);

      // check if quantity is valid
      if (isNaN(quantity) || quantity < 1) {
        alert('Please select a valid quantity.');
        return;
      }

      cart.addToCart(productId,quantity);
      addToCartMessage(productId);
      
      updateCartQuantity();
    });
  });

function addToCartMessage(productId) {
  // Show the added to cart message
  const addedToCart = document.querySelector(`.js-added-to-cart-${productId}`);
  addedToCart.classList.add('added-to-cart-visible');

  // Clear any existing timeout for this product
  if (timeoutIds[productId]) {
    clearTimeout(timeoutIds[productId]);
  }

  // Set a new timeout to hide the message after 2 seconds

  timeoutIds[productId] = setTimeout(() => {
    addedToCart.classList.remove('added-to-cart-visible');
  }, 2000);
}