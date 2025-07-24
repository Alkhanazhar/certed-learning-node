/** @format */

const Razorpay = require("razorpay");
const crypto = require("crypto");

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_SECRET = process.env.RAZORPAY_SECRET;

const razorpayInstance = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_SECRET,
});

const verifyRazorpaySignature = (data, razorpaySignature) => {
  const signature = crypto
    .createHmac("sha256", RAZORPAY_SECRET)
    .update(data)
    .digest("hex");
  return signature === razorpaySignature;
};

module.exports = {razorpayInstance, verifyRazorpaySignature};
