import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";
import { cart } from "../data/cart-instance.js";
import '../data/cart-class.js';

renderOrderSummary();
renderPaymentSummary();