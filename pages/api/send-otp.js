import db from "../../lib/db";
let otpStore = {};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false });
  }

  const { mobile } = req.body;

  if (!mobile) {
    return res.status(400).json({
      success: false,
      message: "Mobile number required",
    });
  }

  try {
    const [rows] = await db.query(
      "SELECT id FROM students WHERE mobile = ? OR alternate_mobile = ?",
      [mobile, mobile]
    );

    if (rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Number not registered",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    otpStore[mobile] = {
      otp,
      expires: Date.now() + 5 * 60 * 1000,
      resendCount: 0,
    };

    console.log("Generated OTP:", otp);

    return res.status(200).json({
      success: true,
      message: "OTP sent",
    });

  } catch (error) {
    console.error("DB Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}

export { otpStore };