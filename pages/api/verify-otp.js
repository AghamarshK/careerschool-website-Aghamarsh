import { otpStore } from "./send-otp";

export default function handler(req, res) {
  const { mobile, otp } = req.body;

  if (!otpStore[mobile]) {
    return res.json({ success: false });
  }

  const storedOtp = otpStore[mobile];

  if (Date.now() > storedOtp.expires) {
    delete otpStore[mobile];
    return res.json({ success: false, message: "OTP expired" });
  }

  if (parseInt(otp) === storedOtp.otp) {
    delete otpStore[mobile];
    return res.json({ success: true });
  }

  return res.json({ success: false });
}