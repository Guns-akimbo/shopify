import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  generateTokenAndSetCookie,
  generateVerificationToken,
} from "../utils/utils.js";
import {
  sendPasswordResetEmail,
  sendSuceesResetMail,
  sendVerificationEmail,
  sendWelcomeEmail,
} from "../mailtrap/emails.js";
import crypto from "crypto";

// @ desc get all User
// @ route GET /api/v1/user
// @ private
export const getAllUser = async (req, res, next) => {
  try {
    console.log(res.status);
    const users = await User.find({});
    res.status(200).json({
      message: `All Users`,
      data: users,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// @ desc Create a User
// @ route POST /api/v1/user/register
// @ public
export const registerUser = async (req, res, next) => {
  const { firstname, lastname, email, phonenumber, password } = req.body;

  if (!firstname || !lastname || !email || !phonenumber || !password) {
    const missingUser = [];
    if (!firstname) missingUser.push("firstname");
    if (!lastname) missingUser.push("lastname");
    if (!email) missingUser.push("email");
    if (!phonenumber) missingUser.push("phonenumber");
    if (!password) missingUser.push("password");

    const error = new Error(`Please include ${missingUser.join(" and ")}.`);
    error.status = 400;
    return next(error);
  }

  const userAlreadyExists = await User.findOne({ email });
  if (userAlreadyExists) {
    const error = new Error(`User with ${email} already exists`);
    error.status = 400;
    return next(error);
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const verificationToken = generateVerificationToken();

  const user = new User({
    firstname,
    lastname,
    email,
    phonenumber,
    password: hashPassword,
    verificationToken,
    verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, //24 hours
  });

  // save user to the database
  await user.save();

  generateTokenAndSetCookie(res, user._id);
  await sendVerificationEmail(
    user.email,
    verificationToken,
    user.verificationTokenExpiresAt
  );

  res.status(201).json({
    success: true,
    message: `User Created Sucessfully `,
    user: {
      ...user._doc,
      password: undefined,
      // verificationToken: undefined,
      // verificationTokenExpiresAt: undefined,
    },
  });
};

// @ desc Verify a User
// @ route POST /api/v1/user/verify
// @ public

export const verifyUser = async (req, res, next) => {
  const { code } = req.body;
  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      const error = new Error(`Invalid token or token oo`);
      error.status = 400;
      return next(error);
    }
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;

    await user.save();

    await sendWelcomeEmail(user.email, user.firstname);

    res.status(200).json({
      success: true,
      message: "Email Verified Sucessfully",
    });
  } catch (error) {
    res.status(500).json({ sucesss: false, message: error.message });
  }
};

// @ desc Login a User
// @ route POST /api/v1/user/login
// @ public
export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      const error = new Error(`Invalid Credentials `);
      error.status = 400;
      return next(error);
    }

    // compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      const error = new Error(`Incorrect Password`);
      error.status = 400;
      return next(error);
    }

    generateTokenAndSetCookie(res, user._id);

    await user.save();

    res.status(200).json({
      success: true,
      message: `Login Sucessfully `,
      user: { ...user._doc, password: undefined },
    });
  } catch (error) {
    res.status(500).json({ sucesss: false, message: error.message });
  }

  // if (user && (await bcrypt.compare(password, user.password))) {
  //   let accessToken = jwt.sign(
  //     {
  //       user: {
  //         _id: user.id,
  //         firstname: user.firstname,
  //         lastname: user.lastname,
  //         email: user.email,
  //         phonenumber: user.phonenumber,
  //       },
  //     },
  //     process.env.ACCESS_TOKEN_SECRET,
  //     { expiresIn: "1h" }
  //   );
  //   const userInfo = {
  //     firstname: user.firstname,
  //     lastname: user.lastname,
  //     email: user.email,
  //     phonenumber: user.phonenumber,
  //   };

  //   res.status(200).json({
  //     accessToken,
  //     user: userInfo,
  //   });
  // } else {
  //   const error = new Error(`Email or Password not valid `);
  //   error.status = 401;
  //   return next(error);
  // }
};

export const logout = async (req, res) => {
  res.clearCookie("authToken");
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

export const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      const error = new Error(`Invalid Email `);
      error.status = 400;
      return next(error);
    }

    // generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;

    await user.save();

    // send reset password email
    await sendPasswordResetEmail(
      user.email,
      `${process.env.CLIENT_URL}/reset-password/${resetToken}`,
      user.firstname
    );

    res.status(200).json({
      success: true,
      message: "Password Reset sent to your mail",
    });
  } catch (error) {
    res.status(500).json({ sucesss: false, message: error.message });
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      const error = new Error(`Invalid Token`);
      error.status = 400;
      return next(error);
    }

    const hashPassword = await bcrypt.hash(password, 10);
    user.password = hashPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;

    await user.save();

    await sendSuceesResetMail(user.email, user.firstname);
    res.status(200).json({
      success: true,
      message: "Password Reset Sucessful",
    });
  } catch (error) {
    res.status(500).json({ sucesss: false, message: error.message });
  }
};

export const checkAuth = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      const error = new Error(`User not found`);
      error.status = 400;
      return next(error);
    }
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({ sucesss: false, message: error.message });
  }
};
