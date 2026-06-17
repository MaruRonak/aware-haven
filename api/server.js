import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/database.js";
import authRoutes from "./routes/auth.routes.js";

const result = dotenv.config();

console.log("DOTENV RESULT =", result);
console.log("CURRENT DIR =", process.cwd());
console.log("EMAIL =", process.env.EMAIL);
console.log("EMAIL_PASS =", process.env.EMAIL_PASS);

connectDB();
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("🚀 Backend API is running");
});

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 API running on port ${PORT}`);
});