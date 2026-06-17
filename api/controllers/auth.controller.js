import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { generateOTP } from "../services/otp.service.js";
import { sendEmail } from "../services/email.service.js";

export const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password required",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "Account created successfully",
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/* =========================
   LOGIN WITH PASSWORD
========================= */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("LOGIN REQUEST:");
    console.log("Email:", email);
    console.log("Password:", password);
    if (!email || !password)
      return res.status(400).json({ message: "All fields required" });

    const user = await User.findOne({ email });
    console.log("USER FOUND:", user);
    if (!user || !user.password)
      return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("PASSWORD MATCH:", isMatch);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   FORGOT PASSWORD
========================= */
export const verifyResetOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (
      !user ||
      !user.resetOTP ||
      !user.otpExpiry ||
      user.resetOTP !== otp ||
      user.otpExpiry < Date.now()
    ) {
      return res.status(400).json({
        message: "Invalid or expired OTP",
      });
    }

    return res.json({
      message: "OTP verified",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    const user = await User.findOne({ email });

    if (
      !user ||
      !user.resetOTP ||
      !user.otpExpiry ||
      user.resetOTP !== otp ||
      user.otpExpiry < Date.now()
    ) {
      return res.status(400).json({
        message: "Invalid or expired OTP",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetOTP = null;
    user.otpExpiry = null;

    await user.save();

    return res.json({
      message: "Password reset successful",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


/* =========================
   EMAIL LOGIN OTP
========================= */
export const emailLogin = async (req, res) => {
  try {
    console.log("BODY RECEIVED:", req.body);

    const { email } = req.body;

    // ✅ FIX: prevent crash
    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({ email });
    }

    const otp = generateOTP();

    user.loginOTP = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;

    await user.save();

    await sendEmail({
      to: email,
      subject: "Login OTP",
      html: `<h2>Your OTP is: ${otp}</h2>`,
    });

    return res.json({
      message: "OTP sent for login",
    });

  } catch (error) {
    console.error("EMAIL LOGIN ERROR:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
/* =========================
   VERIFY OTP
========================= */
export const verifyEmailOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (
      !user ||
      !user.loginOTP ||
      !user.otpExpiry ||
      user.loginOTP !== otp ||
      user.otpExpiry < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.loginOTP = null;
    user.otpExpiry = null;

    await user.save();

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* =========================
   FORGOT PASSWORD
========================= */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const otp = generateOTP();

    user.resetOTP = otp;
user.otpExpiry = Date.now() + 2 * 60 * 1000;

    await user.save();

    await sendEmail({
      to: email,
      subject: "Password Reset OTP",
      html: `<h2>Your OTP is ${otp}</h2>`,
    });

    return res.json({
      message: "OTP sent to email",
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
