import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    couponCode: {
      type: String,
      required: [true, "Please enter the Coupon Code"],
      unique: true,
    },
    amount: {
      type: Number,
      required: [true, "Please enter the Discount Amount"],
    },
  },
  {
    timestamps: true,
  }
);

export const Coupon = mongoose.model("Coupon", couponSchema);
