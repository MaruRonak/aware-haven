import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

console.log("EMAIL SERVICE EMAIL =", process.env.EMAIL);
console.log("EMAIL SERVICE PASS =", process.env.EMAIL_PASS);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});
export const sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: `"Aware Haven" <${process.env.EMAIL}>`,
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error("FULL EMAIL ERROR:");
    console.log(error);
    throw new Error("Email failed");
  }
};
