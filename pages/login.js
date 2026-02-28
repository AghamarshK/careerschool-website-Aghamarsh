import { useState } from "react";
import { useRouter } from "next/router";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Login() {
  const router = useRouter();

  const [role, setRole] = useState("student");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1 = mobile, 2 = OTP
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [forgotMessage, setForgotMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const validateMobile = () => {
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      setMessage("Enter valid 10-digit mobile number");
      return false;
    }
    return true;
  };

  const handleSendOtp = async () => {
    if (!validateMobile()) return;

    const res = await fetch("/api/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mobile }),
    });

    const data = await res.json();

    if (data.success) {
      setStep(2);
      setMessage("OTP sent successfully");
    } else {
      setMessage(data.message);
    }
  };

  const handleVerifyOtp = async () => {
    const res = await fetch("/api/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mobile, otp }),
    });

    const data = await res.json();

    if (data.success) {
      localStorage.setItem("isLoggedIn", "true");
      router.push("/");
    } else {
      setMessage("Invalid OTP");
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!validateLogin()) return;

    setLoading(true);

    setTimeout(() => {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("role", role);
      setLoading(false);
      router.push("/");
    }, 2000);
  };

  const handleForgotPassword = () => {
    setForgotMessage("Contact your admin");
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-lg">

        {/* ROLE SWITCH */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-yellow-400 p-1 rounded-full shadow-md">

            {["student", "employee", "employer"].map((item) => (
              <button
                key={item}
                onClick={() => {
                  setRole(item);
                  setForgotMessage("");
                }}
                className={`px-6 py-2 rounded-full font-semibold transition ${
                  role === item
                    ? "bg-blue-600 text-yellow-300 shadow-md"
                    : "text-blue-800 hover:bg-yellow-300"
                }`}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </button>
            ))}

          </div>
        </div>

        {/* LOGIN FORM */}
        {step === 1 && (
          <>
            <input
              type="tel"
              placeholder="Enter Mobile Number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="w-full border border-gray-300 p-4 rounded-lg focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="button"
              onClick={handleSendOtp}
              className="w-full py-4 mt-5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
            >
              Send OTP
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full border border-gray-300 p-4 rounded-lg focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="button"
              onClick={handleVerifyOtp}
              className="w-full py-4 mt-5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
            >
              Verify & Login
            </button>
          </>
        )}

        {message && (
          <p className="text-center text-sm mt-2 text-red-600">{message}</p>
        )}

          

          {/* NEW USER + FORGOT */}
          <div className="text-center mt-6 space-y-2">
            <p className="text-gray-600 text-sm">
              New User?{" "}
              <span
                onClick={() => router.push("/signup")}
                className="text-blue-600 font-semibold cursor-pointer hover:underline"
              >
                Create an Account
              </span>
            </p>

            {role === "student" && (
              <>
                <p
                  onClick={handleForgotPassword}
                  className="text-blue-600 font-semibold cursor-pointer hover:underline"
                >
                  Forgot Password?
                </p>

                {forgotMessage && (
                  <p className="text-red-600 text-sm font-bold mt-2">
                    {forgotMessage}
                  </p>
                )}
              </>
            )}
          </div>

        
      </div>
    </div>
  );
}