export let cart = [];

export function addToCart(productId) {
  //check if the product is already in the cart
  let matchingItem;
  cart.forEach((cartItem) => {
    if (productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });

  //if found, increase quantity; if not, add to cart
  if (matchingItem) {
    matchingItem.quantity++;
  }
  else {
    cart.push({
      productId: productId,
      quantity: 1
    });
  }
}