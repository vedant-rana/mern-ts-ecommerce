import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { useCreateCouponMutation } from "../../../redux/api/couponApi";
import { UserReducerInitialState } from "../../../types/reducerTypes";
import { responseToast } from "../../../utils/features";

const NewCoupon = () => {
  // getting id of admin from user state of redux which is required to create new product
  const { user } = useSelector(
    (state: { userReducer: UserReducerInitialState }) => state.userReducer
  );

  // calling RTK QUERY API of creating new product
  const [newCoupon] = useCreateCouponMutation();

  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!couponCode || !amount) {
      return toast.error("All Fields are required!!!");
    }

    if (amount <= 0) {
      return toast.error("Amount should be greater than 0");
    }

    const couponData = {
      couponCode,
      amount,
    };

    const res = await newCoupon({ adminId: user?._id!, couponData });

    responseToast(res, navigate, "/admin/coupon");
  };

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
        <article>
          <form onSubmit={submitHandler}>
            <h2>New Coupon</h2>
            <div>
              <label>Cuopon Code Name</label>
              <input
                type="text"
                placeholder="Coupon Name"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Discount Amount</label>
              <input
                type="number"
                placeholder="Enter Discount Amount"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                required
              />
            </div>

            <button type="submit">Create</button>
          </form>
        </article>
      </main>
    </div>
  );
};

export default NewCoupon;
