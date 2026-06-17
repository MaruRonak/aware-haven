import express from "express";
import {
  register,
  login,
  forgotPassword,
  verifyResetOTP,
  resetPassword,
  emailLogin,
  verifyEmailOTP,
} from "../controllers/auth.controller.js";

const router = express.Router();
router.post("/register", register);
router.post("/login", login);

router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-otp", verifyResetOTP);
router.post("/reset-password", resetPassword);

router.post("/email-login", emailLogin);
router.post("/verify-email-otp", verifyEmailOTP);
export default router;
