const cart = {
    cartItems: undefined,

    init() {
        this.loadFromStorage();
    },
    loadFromStorage() {
        this.cartItems = JSON.parse(localStorage.getItem('cart-oop')) || [];
    },
    saveToStorage() {
        localStorage.setItem('cart-oop', JSON.stringify(this.cartItems));
    },
    addToCart(productId) {
        //check if the product is already in the cart
        let matchingItem;
        this.cartItems.forEach((cartItem) => {
            if (productId === cartItem.productId) {
                matchingItem = cartItem;
            }
        });

        //if found, increase quantity; if not, add to cart
        if (matchingItem) {
            matchingItem.quantity++;
        } else {
            this.cartItems.push({
                productId: productId,
                quantity: 1,
                deliveryOptionsId: '1'
            });
        }

        this.saveToStorage();
    },
    removeFromCart(productId) {
        const newCart = [];

        this.cartItems.forEach((cartItem) => {
            if (cartItem.productId !== productId) {
                newCart.push(cartItem);
            }
        })

        this.cartItems = newCart;

        this.saveToStorage();
    },
    updateDeliveryOption(productId, deliveryOptionId){
        let matchingItem;
        this.cartItems.forEach((cartItem) => {
          if (productId === cartItem.productId) {
            matchingItem = cartItem;
          }
        });
      
        matchingItem.deliveryOptionId = deliveryOptionId;

        this.saveToStorage();
      }
};

cart.init();