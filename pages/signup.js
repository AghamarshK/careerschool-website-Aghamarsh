import { useState } from "react";
import { useRouter } from "next/router";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Signup() {
  const router = useRouter();
  const [role, setRole] = useState("student");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [alternate, setAlternate] = useState("");
  const [experience, setExperience] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");

  const [collegeSearch, setCollegeSearch] = useState("");
  const [collegeSuggestions, setCollegeSuggestions] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState(null);

  const [citySearch, setCitySearch] = useState("");
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedState, setSelectedState] = useState("");

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleCollegeSearch = async (value) => {
    setCollegeSearch(value);
    setSelectedCollege(null);
    setErrors((prev) => ({ ...prev, college: "" }));

    if (value.length < 3) {
      setCollegeSuggestions([]);
      return;
    }

    const res = await fetch(`/api/colleges?search=${value}`);
    const data = await res.json();
    setCollegeSuggestions(data);
  };

  const handleCitySearch = async (value) => {
    setCitySearch(value);
    setSelectedCity(null);
    setSelectedState("");

    if (value.length < 2) {
      setCitySuggestions([]);
      return;
    }

    const res = await fetch(`/api/cities?search=${value}`);
    const data = await res.json();
    setCitySuggestions(data);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    let newErrors = {};

    if (!name) newErrors.name = "This field is required";
    if (!email) newErrors.email = "This field is required";
    else if (!emailRegex.test(email))
      newErrors.email = "Enter a valid email";

    if (!whatsapp) newErrors.whatsapp = "This field is required";
    else if (whatsapp.length !== 10)
      newErrors.whatsapp = "Enter a valid 10-digit number";

    if (!alternate) newErrors.alternate = "This field is required";
    else if (alternate.length !== 10)
      newErrors.alternate = "Enter a valid 10-digit number";
    else if (alternate === whatsapp)
      newErrors.alternate = "Alternate number cannot be the same as WhatsApp number";

    if (!citySearch) newErrors.city = "This field is required";
    else if (!selectedCity)
      newErrors.city = "Please select a valid city from suggestions";

    if (!collegeSearch) newErrors.college = "This field is required";
    else if (!selectedCollege)
      newErrors.college =
        "Please select a valid college from suggestions";

    if (!experience) newErrors.experience = "This field is required";
    if (!dob) newErrors.dob = "This field is required";
    if (!gender) newErrors.gender = "This field is required";

   

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);

    const response = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        whatsapp,
        alternate,
        selectedCollege,
        selectedCity,
        selectedState,
        experience,
        dob,
        gender,
        role
      }),
    }
  );

  const data = await response.json();

  if (data.success) {
    setLoading(false);
    router.push("/login");
  } else {
    setLoading(false);
    alert(data.message);
  }
  };

  const inputStyle = (field) =>
    `w-full border p-4 rounded-lg focus:outline-none focus:ring-2 ${
      errors[field]
        ? "border-red-500 focus:ring-red-400"
        : "border-gray-300 focus:ring-blue-500"
    }`;

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-lg">

        <div className="flex justify-center mb-8">
          <div className="flex bg-yellow-400 p-1 rounded-full shadow-md">
            {["student", "employee", "employer"].map((item) => (
              <button
                key={item}
                onClick={() => setRole(item)}
                className={`px-6 py-2 rounded-full font-semibold transition ${
                  role === item
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-blue-800 hover:bg-yellow-300"
                }`}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSignup} className="space-y-5">

          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setErrors((prev) => ({ ...prev, name: "" }));
            }}
            className={inputStyle("name")}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors((prev) => ({ ...prev, email: "" }));
            }}
            className={inputStyle("email")}
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

          <input
            type="tel"
            placeholder="WhatsApp Number"
            value={whatsapp}
            maxLength={10}
            onChange={(e) => {
              setWhatsapp(e.target.value.replace(/\D/g, ""));
              setErrors((prev) => ({ ...prev, whatsapp: "" }));
            }}
            className={inputStyle("whatsapp")}
          />
          <p className="text-xs text-gray-500 pb-5 mt-0 pt-0">
            This number will be used for contact and future OTP verification.
          </p>
          {errors.whatsapp && (
            <p className="text-red-500 text-sm">{errors.whatsapp}</p>
          )}

          <input
            type="tel"
            placeholder="Alternate Number"
            value={alternate}
            maxLength={10}
            onChange={(e) => {
              setAlternate(e.target.value.replace(/\D/g, ""));
              setErrors((prev) => ({ ...prev, alternate: "" }));
            }}
            className={inputStyle("alternate")}
          />
          {errors.alternate && (
            <p className="text-red-500 text-sm">{errors.alternate}</p>
          )}

          <div className="relative">
  
            <input
              type="text"
              placeholder="Enter City"
              value={citySearch}
              onChange={(e) => handleCitySearch(e.target.value)}
              className={inputStyle("city")}
            />

            {citySuggestions.length > 0 && (
              <div className="absolute bg-white border w-full max-h-60 overflow-y-auto shadow-md z-10">
                {citySuggestions.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      setSelectedCity(item.city);
                      setSelectedState(item.state);
                      setCitySearch(item.city);
                      setCitySuggestions([]);
                      setErrors(prev => ({ ...prev, city: "" }));
                    }}
                    className="p-3 hover:bg-gray-100 cursor-pointer"
                  >
                    {item.city}, {item.state}
                  </div>
                ))}
              </div>
            )}
          </div>

          {errors.city && (
            <p className="text-red-500 text-sm">{errors.city}</p>
          )}

        <input
          type="text"
          placeholder="State"
          value={selectedState}
          disabled
          className="w-full border border-gray-300 p-4 rounded-lg bg-gray-100"
        />

          <div className="relative">
            <input
              type="text"
              placeholder="College / University"
              value={collegeSearch}
              onChange={(e) => handleCollegeSearch(e.target.value)}
              className={inputStyle("college")}
            />

            {collegeSuggestions.length > 0 && (
              <div className="absolute bg-white border w-full max-h-60 overflow-y-auto shadow-md z-10">
                {collegeSuggestions.map((college, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      setSelectedCollege(college.name);
                      setCollegeSearch(college.name);
                      setCollegeSuggestions([]);
                      setErrors((prev) => ({ ...prev, college: "" }));
                    }}
                    className="p-3 hover:bg-gray-100 cursor-pointer"
                  >
                    {college.name}
                  </div>
                ))}
              </div>
            )}
          </div>
          {errors.college && (
            <p className="text-red-500 text-sm">{errors.college}</p>
          )}

          <select
            value={experience}
            onChange={(e) => {
              setExperience(e.target.value);
              setErrors((prev) => ({ ...prev, experience: "" }));
            }}
            className={inputStyle("experience")}
          >
            <option value="">Select Experience</option>
            <option>Fresher</option>
            <option>&lt; 1 year</option>
            <option>1 - 3 years</option>
            <option>3 - 5 years</option>
            <option>5+ years</option>
          </select>
          {errors.experience && (
            <p className="text-red-500 text-sm">{errors.experience}</p>
          )}

          <div>
            <label className="block text-sm font-medium mb-1 pt-2">
              DOB <span className="text-gray-500 text-xs">(MM/DD/YYYY)</span>
            </label>

            <input
              type="date"
              value={dob}
              onChange={(e) => {
                setDob(e.target.value);
                setErrors((prev) => ({ ...prev, dob: "" }));
              }}
              className={inputStyle("dob")}
            />

            {errors.dob && (
              <p className="text-red-500 text-sm">{errors.dob}</p>
            )}
          </div>

          <select
            value={gender}
            onChange={(e) => {
              setGender(e.target.value);
              setErrors((prev) => ({ ...prev, gender: "" }));
            }}
            className={inputStyle("gender")}
          >
            <option value="">Select Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Prefer not to say</option>
          </select>
          {errors.gender && (
            <p className="text-red-500 text-sm">{errors.gender}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-lg text-white font-semibold transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}