import mongoose from "mongoose";

const UserSchema = mongoose.Schema(
  {
    firstname: {
      type: String,
      required: [true, "Firstname is Required "],
    },
    lastname: {
      type: String,
      required: [true, "Lasttname is Required "],
    },
    email: {
      type: String,
      required: [true, "email is Required "],
      unique: [true, "Email already exists "],
    },
    phonenumber: {
      type: String,
      required: [true, "Phone number is Required "],
    },
    password: {
      type: String,
      required: [true, "Please input Password "],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken:String,
    resetPasswordExpiresAt:Date,
    verificationToken:String,
    verificationTokenExpiresAt:Date,
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", UserSchema);

export default User;
