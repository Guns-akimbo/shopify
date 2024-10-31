import express from "express";
import {
  forgotPassword,
  getAllUser,
  loginUser,
  logout,
  registerUser,
  verifyUser,
  checkAuth,
  resetPassword,
} from "../controller/auth-controller.js";
import  validateToken  from "../middleware/validate-token.js";

const router = express();

// create a new user
router.post("/register", registerUser);

// login a user
router.post("/login", loginUser);

// logout user
router.post("/logout", logout);

// get all users
router.get("/", getAllUser);

// verify user
router.post("/verify", verifyUser);

// forgot password
router.post("/forgotPassword", forgotPassword);

// reset password
router.post("/resetPassword/:token", resetPassword);

router.get("/checkAuth", validateToken, checkAuth);

export default router;
