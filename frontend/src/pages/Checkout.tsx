import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { RootState } from "../redux/store";
import { useNewOrderMutation } from "../redux/api/orderApi";
import { resetCart } from "../redux/reducer/cartReducer";
import { NewOrderRequest } from "../types/apiTypes";
import { responseToast } from "../utils/features";
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY);

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state: RootState) => state.userReducer);

  const {
    shippingInfo,
    cartItems,
    subtotal,
    tax,
    discount,
    shippingCharges,
    total,
  } = useSelector((state: RootState) => state.cartReducer);

  const [newOrder] = useNewOrderMutation();

  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) return;
    setIsProcessing(true);

    const order: NewOrderRequest = {
      shippingInfo,
      orderItems: cartItems,
      subtotal,
      tax,
      discount,
      shippingCharges,
      total,
      user: user?._id!,
    };

    const { paymentIntent, error } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.origin },
      redirect: "if_required",
    });

    if (error) {
      setIsProcessing(false);
      return toast.error(error.message || "Something Went Wrong");
    }

    if (paymentIntent.status === "succeeded") {
      const res = await newOrder(order);
      dispatch(resetCart());
      responseToast(res, navigate, "/orders");
    }
    setIsProcessing(false);
  };

  return (
    <div className="checkout-container">
      <form onSubmit={submitHandler}>
        <PaymentElement />
        <button type="submit" disabled={isProcessing}>
          {isProcessing ? "Processing..." : "Pay"}
        </button>
      </form>
    </div>
  );
};

const Checkout = () => {
  const location = useLocation();
  const clientSecret: string | undefined = location.state;

  if (!clientSecret) return <Navigate to={"/shipping"} />;
  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
      }}
    >
      <CheckoutForm />
    </Elements>
  );
};

export default Checkout;

// import {
//   Elements,
//   PaymentElement,
//   useElements,
//   useStripe,
// } from "@stripe/react-stripe-js";
// import { loadStripe } from "@stripe/stripe-js";
// import { FormEvent, useState } from "react";
// import toast from "react-hot-toast";
// import { useNavigate } from "react-router-dom";

// const stripePromise = loadStripe(
//   "pk_test_51PKanxSAEfQVn1z1FMQAoUbKHGGGjXLMRZztzmGoZRpQtjN2Ouf7rjVoo6VGei1652oNt457OqmqCtadWpnHaL4i00OqubTf5r"
// );

// const CheckoutForm = () => {
//   const stripe = useStripe();
//   const elements = useElements();
//   const navigate = useNavigate();
//   const [isProcessing, setIsProcessing] = useState<boolean>(false);

//   const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     if (!stripe || !elements) return;
//     setIsProcessing(true);

//     try {
//       const { error, paymentIntent } = await stripe.confirmPayment({
//         elements,
//         confirmParams: {
//           return_url: window.location.origin,
//         },
//         redirect: "if_required",
//       });

//       if (error) {
//         console.error("Error confirming payment:", error);
//         toast.error(error.message || "Something Went Wrong");
//       } else if (paymentIntent && paymentIntent.status === "succeeded") {
//         console.log("Payment succeeded:", paymentIntent);
//         navigate("/orders");
//       } else {
//         console.log("Payment intent status:", paymentIntent.status);
//       }
//     } catch (err) {
//       console.error("Error processing payment:", err);
//       toast.error("Something Went Wrong");
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   return (
//     <div className="checkout-container">
//       <form onSubmit={submitHandler}>
//         <PaymentElement />
//         <button type="submit" disabled={isProcessing}>
//           {isProcessing ? "Processing..." : "Pay"}
//         </button>
//       </form>
//     </div>
//   );
// };

// const Checkout = () => {
//   return (
//     <Elements
//       stripe={stripePromise}
//       options={{
//         clientSecret:
//           "pi_3PQ83TSAEfQVn1z11Ddcu0Qt_secret_vSPzSGzV17fztNwW2QnlEAbwt",
//       }}
//     >
//       <CheckoutForm />
//     </Elements>
//   );
// };

// export default Checkout;
