import React, { useEffect, useState } from "react";
import {
  PaymentElement,
  LinkAuthenticationElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!stripe) return;

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );
    if (!clientSecret) return;

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent.status) {
        case "succeeded":
          setMessage("✅ Payment succeeded!");
          break;
        case "processing":
          setMessage("⏳ Payment is processing...");
          break;
        case "requires_payment_method":
          setMessage("❌ Payment failed. Please try again.");
          break;
        default:
          setMessage("⚠️ Something went wrong.");
      }
    });
  }, [stripe]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${import.meta.env.VITE_FRONTEND_URL}/success`,
      },
    });

    if (error) {
      setMessage(error.message || "Unexpected error occurred.");
      console.error("Stripe error:", error);
    }

    setIsLoading(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <LinkAuthenticationElement
        id="link-authentication-element"
        onChange={(e) => setEmail(e.value.email)}
      />
      <PaymentElement id="payment-element" />
      <button disabled={isLoading || !stripe || !elements} id="submit">
        <span id="button-text">
          {isLoading ? <div className="spinner" /> : "Pay now"}
        </span>
      </button>
      {message && <div id="payment-message">{message}</div>}
    </form>
  );
};

export default CheckoutForm;
