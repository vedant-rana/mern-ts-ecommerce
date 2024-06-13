import mongoose from "mongoose";
const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter the Category Name"],
        unique: true,
    },
    createdBy: {
        type: String,
        ref: "User",
        required: true,
    },
}, {
    timestamps: true,
});
export const Category = mongoose.model("Category", categorySchema);
