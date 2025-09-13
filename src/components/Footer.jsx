import React from "react";
import { FaTelegram } from "react-icons/fa6";

function Footer({ children }) {
  return (
    <>
      {children}
      <footer className="mt-10 mb-4">
        <div className="flex flex-col items-center text-center space-y-3">
          {/* Phone contact */}
          <div className="flex items-center text-blue-400">
            <FaTelegram size={24} />
            <span className="ml-2 text-lg font-medium">093 939 290</span>
          </div>

          {/* Copyright */}
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Pich Shop. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}

export default Footer;
