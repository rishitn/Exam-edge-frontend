import { api } from "./client";

// Matches src/modules/payments/payment.routes.ts.
// The webhook route is server-to-server only (Razorpay -> backend) and has
// no frontend counterpart here.

export async function createTestOrder(input) {
  // input: { testId, couponCode? }
  return (await api.post("/payments/orders/test", input)).data;
}

export async function createSubscriptionOrder(input) {
  // input: { planId, couponCode? }
  return (await api.post("/payments/orders/subscription", input)).data;
}

export async function verifyPayment(input) {
  // input: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
  // Call this from the Razorpay Checkout `handler` callback after a
  // successful payment — see components/RazorpayCheckout.jsx.
  return (await api.post("/payments/verify", input)).data;
}

export async function getOrderHistory(page = 1, pageSize = 20) {
  const res = await api.get(`/payments/orders?page=${page}&pageSize=${pageSize}`);
  return { orders: res.data, pagination: res.meta?.pagination };
}

export async function getOrder(orderId) {
  return (await api.get(`/payments/orders/${orderId}`)).data;
}
