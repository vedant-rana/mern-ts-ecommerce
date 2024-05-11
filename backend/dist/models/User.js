import mongoose from "mongoose";
import validator from "validator";
;
const userSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: [true, "Please Enter Id"],
    },
    name: {
        type: String,
        required: [true, "Please enter name"],
    },
    email: {
        type: String,
        required: [true, "Please enter Email"],
        unique: [true, "EMail alreday Exist"],
        validate: validator.default.isEmail,
    },
    photo: {
        type: String,
        required: [true, "Please add Photo"],
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user",
    },
    gender: {
        type: String,
        enum: ["male", "female"],
        required: [true, "Please enter Gender"],
    },
    dob: {
        type: Date,
        required: [true, "Please Enter DOB"],
    },
}, {
    timestamps: true,
});
/**
 * Virtual prperty for User scehma which will calculated by differnce of
 * current and dob date
 */
userSchema.virtual("age").get(function () {
    const today = new Date();
    const dob = this.dob;
    let age = today.getFullYear() - dob.getFullYear();
    // condition which checks if user's birth month is greater than current month 
    // then user is not completed his age for this year and if both current and 
    // DOB month is same than same will be checked for days for current month  
    if (today.getMonth() < dob.getMonth() || (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())) {
        age--;
    }
    return age;
});
export const User = mongoose.model('User', userSchema);
