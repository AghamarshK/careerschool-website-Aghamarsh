"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useRouter } from "next/router";

export default function Header() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const [showSignupModal, setShowSignupModal] = useState(false);

  const hireStudentsLink = "https://wa.me/7305014818";
  const contactLink = "https://wa.me/7708938866";
  const takeTestFormLink = "/online-assessment";

  const handleTakeTest = () => {
    const user = localStorage.getItem("user");

    if (!user) {
      setShowSignupModal(true);
    } else {
      router.push("/online-assessment");
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;

      setScrolled(currentY > 10);

      if (window.innerWidth >= 768) {
        if (currentY > lastScrollY && currentY > 120) {
          setShowHeader(false);
        } else {
          setShowHeader(true);
        }
      }

      setLastScrollY(currentY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) section.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={`
        w-full sticky top-0 z-50
        transition-all duration-500 ease-in-out
        ${scrolled ? "bg-white/80 backdrop-blur-md shadow-md" : "bg-white"}
        ${showHeader ? "translate-y-0" : "-translate-y-full"}
      `}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">

        {/* LOGO */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => router.push("/")}
        >
          <img src="/Nav Logo/CSHR - Nav Logo.png" className="h-8 sm:h-10" />
          <img src="/Nav Logo/CSIT - Nav Logo.png" className="h-8 sm:h-10" />
        </div>

        {/* DESKTOP MENU */}
        <nav className="hidden md:flex items-center gap-3 ml-auto mr-4">
          <button
            onClick={() => scrollToSection("courses")}
            className="bg-blue-100 text-blue-700 px-4 py-2 rounded font-semibold text-sm"
          >
            Courses
          </button>

          <button
            onClick={() => scrollToSection("meet-our-stars")}
            className="bg-blue-100 text-blue-700 px-4 py-2 rounded font-semibold text-sm"
          >
            Success Story
          </button>

          <button
            onClick={handleTakeTest}
            className="bg-blue-100 text-blue-700 px-4 py-2 rounded font-semibold text-sm"
          >
            Take Test
          </button>

          <a
            href={hireStudentsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-100 text-blue-700 px-4 py-2 rounded font-semibold text-sm"
          >
            Hire Students
          </a>
        </nav>

        {/* DESKTOP CONTACT + LOGIN */}
        <div className="hidden md:flex items-center gap-3">
          <a href={contactLink} target="_blank" rel="noopener noreferrer">
            <button className="bg-blue-600 text-white px-5 py-2 rounded font-semibold text-sm">
              Contact Us
            </button>
          </a>

          <button
            onClick={() => router.push("/login")}
            className="bg-blue-600 text-white px-5 py-2 rounded font-semibold text-sm"
          >
            Login
          </button>
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          className="md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-md flex flex-col items-center gap-4 py-6">
          <button
            onClick={() => {
              scrollToSection("courses");
              setMenuOpen(false);
            }}
            className="bg-blue-100 text-blue-700 px-6 py-2 rounded"
          >
            Courses
          </button>

          <button
            onClick={() => {
              scrollToSection("meet-our-stars");
              setMenuOpen(false);
            }}
            className="bg-blue-100 text-blue-700 px-6 py-2 rounded"
          >
            Success Story
          </button>

          <button
            onClick={() => {
              handleTakeTest();
              setMenuOpen(false);
            }}
            className="bg-blue-100 text-blue-700 px-6 py-2 rounded"
          >
            Take Test
          </button>

          <a
            href={hireStudentsLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMenuOpen(false)}
          >
            <button className="bg-blue-100 text-blue-700 px-6 py-2 rounded">
              Hire Students
            </button>
          </a>

          <a
            href={contactLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMenuOpen(false)}
          >
            <button className="bg-blue-600 text-white px-6 py-2 rounded font-bold">
              Contact Us
            </button>
          </a>

          {/* MOBILE LOGIN */}
          <button
            onClick={() => {
              router.push("/login");
              setMenuOpen(false);
            }}
            className="bg-blue-600 text-white px-6 font-bold rounded"
          >
            Login
          </button>
        </div>
      )}

      {showSignupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-xl max-w-md text-center">
            <h2 className="text-xl font-bold mb-4">
              Kindly Signup to take the test
            </h2>

            <p className="text-gray-600 mb-6">
              Please complete your signup process before attempting the assessment.
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowSignupModal(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>

              <button
                onClick={() => router.push("/signup")}
                className="px-6 py-2 bg-blue-600 text-white rounded font-semibold"
              >
                Signup Now
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}