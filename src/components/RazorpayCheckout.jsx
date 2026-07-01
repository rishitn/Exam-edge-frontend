import { useState } from "react";
import { Btn, Spinner } from "./ui";
import * as PaymentsApi from "../api/payments";

// Loads the Razorpay checkout script once and caches the promise so
// multiple checkout attempts on the same page don't re-inject the script.
let razorpayScriptPromise = null;
function loadRazorpayScript() {
  if (razorpayScriptPromise) return razorpayScriptPromise;
  razorpayScriptPromise = new Promise((resolve, reject) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error("Failed to load Razorpay checkout script"));
    document.body.appendChild(script);
  });
  return razorpayScriptPromise;
}

/**
 * RazorpayCheckout
 *
 * Drop-in buy button for either a test purchase or a subscription.
 * Pass exactly one of `testId` or `planId`.
 *
 * The flow matches the backend exactly (see src/modules/payments):
 *   1. POST /payments/orders/test|subscription  -> { orderId, razorpayOrderId, amount, keyId, ... }
 *   2. Open Razorpay Checkout with those values
 *   3. On success, Razorpay's handler gives us razorpay_order_id /
 *      razorpay_payment_id / razorpay_signature (snake_case — that's
 *      Razorpay's own SDK convention, NOT our API's).
 *   4. POST /payments/verify with our internal orderId + those three
 *      values renamed to the camelCase keys our schema expects.
 */
export function RazorpayCheckout({ testId, planId, couponCode, label = "Pay now", onSuccess, onError, studentName, studentEmail }) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      await loadRazorpayScript();

      const order = testId
        ? await PaymentsApi.createTestOrder({ testId, couponCode })
        : await PaymentsApi.createSubscriptionOrder({ planId, couponCode });

      const rzp = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "ExamEdge",
        description: testId ? "Test purchase" : "Subscription",
        order_id: order.razorpayOrderId,
        prefill: { name: studentName, email: studentEmail },
        theme: { color: "#4F62FF" },
        handler: async (response) => {
          try {
            const result = await PaymentsApi.verifyPayment({
              orderId: order.orderId,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            onSuccess?.(result);
          } catch (err) {
            onError?.(err);
          } finally {
            setLoading(false);
          }
        },
        modal: {
          // User closed the checkout modal without paying — not an error,
          // just stop the loading spinner so they can retry.
          ondismiss: () => setLoading(false),
        },
      });

      rzp.on("payment.failed", (resp) => {
        setLoading(false);
        onError?.(new Error(resp.error?.description || "Payment failed"));
      });

      rzp.open();
    } catch (err) {
      setLoading(false);
      onError?.(err);
    }
  };

  return (
    <Btn onClick={handleClick} disabled={loading} style={{ width: "100%", justifyContent: "center" }}>
      {loading ? <Spinner size={16} /> : label}
    </Btn>
  );
}
