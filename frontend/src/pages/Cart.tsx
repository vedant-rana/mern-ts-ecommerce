import { useEffect, useState } from "react";
import { VscError } from "react-icons/vsc";
import CartItem from "../components/cart/CartItem";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CartReducerInitialState } from "../types/reducerTypes";
import { ICartItem } from "../types/types";
import {
  addToCart,
  applyDiscount,
  calculatePrice,
  removeCartItem,
} from "../redux/reducer/cartReducer";
import toast from "react-hot-toast";
import axios from "axios";
import { server } from "../redux/store";

// const cartItems: any[] = [
//   {
//     productId: "temp1",
//     photo: "https://c.media-amazon.com/images/I/71jG+e7roXL._SX522_.jpg",
//     name: "Puma Shoes",
//     price: 4000,
//     quantity: 1,
//     stock: 10,
//   },
// ];
// const subtotal = 4000;
// const tax = Math.round(subtotal * 0.18);
// const shippingCharges = 200;
// const total = subtotal + tax + shippingCharges;
// const discount = 400;

const Cart = () => {
  const { cartItems, subtotal, total, discount, shippingCharges, tax } =
    useSelector(
      (state: { cartReducer: CartReducerInitialState }) => state.cartReducer
    );

  const [couponCode, setCouponCode] = useState<string>("");
  const [isValidCouponCode, setIsValidCouponCode] = useState<boolean>(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const { token: cancelToken, cancel } = axios.CancelToken.source();
    const timeOutId = setTimeout(() => {
      axios
        .get(`${server}/api/v1/payments/discount?couponCode=${couponCode}`, {
          cancelToken,
        })
        .then((res) => {
          dispatch(applyDiscount(res.data.discount));
          setIsValidCouponCode(true);
          dispatch(calculatePrice());
        })
        .catch((err) => {
          dispatch(applyDiscount(0));
          setIsValidCouponCode(false);
          dispatch(calculatePrice());
        });
    }, 1000);

    return () => {
      clearTimeout(timeOutId);
      cancel();
      setIsValidCouponCode(false);
    };
  }, [couponCode]);

  useEffect(() => {
    dispatch(calculatePrice());
  }, [cartItems, dispatch]);

  const incrementHandler = (cartItem: ICartItem) => {
    if (cartItem.quantity >= cartItem.stock)
      return toast.error("Max Quantity Reached");
    dispatch(addToCart({ ...cartItem, quantity: cartItem.quantity + 1 }));
  };

  const decrementHandler = (cartItem: ICartItem) => {
    if (cartItem.quantity <= 1) return;
    dispatch(addToCart({ ...cartItem, quantity: cartItem.quantity - 1 }));
  };

  const removeHandler = (productId: string) => {
    dispatch(removeCartItem(productId));
  };

  return (
    <div className="cart">
      <main>
        {cartItems.length > 0 ? (
          cartItems.map((item, i) => (
            <CartItem
              key={i}
              cartItem={item}
              incrementHandler={incrementHandler}
              decrementHandler={decrementHandler}
              removeHandler={removeHandler}
            />
          ))
        ) : (
          <h1>No Items Added</h1>
        )}
      </main>
      <aside>
        <p>Subtotal : ₹{subtotal}</p>
        <p>Shipping Charges : ₹{shippingCharges}</p>
        <p>Tax : ₹{tax}</p>
        <p>
          Discount : <em className="red"> - ₹{discount}</em>
        </p>
        <p>
          Total : <b>₹{total}</b>
        </p>
        <input
          type="text"
          placeholder="Coupon Code"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
        />

        {couponCode &&
          (isValidCouponCode ? (
            <span className="green">
              ₹{discount} off using <code>{couponCode}</code>
            </span>
          ) : (
            <span className="red">
              Invalid Coupon <VscError />
            </span>
          ))}
        {cartItems.length > 0 && <Link to="/shipping">Checkout</Link>}
      </aside>
    </div>
  );
};

export default Cart;
