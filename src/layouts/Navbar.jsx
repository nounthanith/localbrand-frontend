import React, { useState } from "react";
import { CiShoppingCart } from "react-icons/ci";
import { FaBars, FaShoppingCart, FaUser } from "react-icons/fa";
import { Link, Outlet } from "react-router-dom";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const navItems = [
    { name: "Home", link: "/" },
    // { name: "My Order", link: "/order-success" },
  ];

  React.useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartCount(cart.reduce((total, item) => total + item.quantity, 0));
    };

    // Initial update
    updateCartCount();

    // Listen for both storage events (from other tabs) and custom cartUpdated event
    const handleCartUpdate = () => updateCartCount();

    window.addEventListener("storage", handleCartUpdate);
    window.addEventListener("cartUpdated", handleCartUpdate);

    return () => {
      window.removeEventListener("storage", handleCartUpdate);
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, []);

  return (
    <div className="">
      <nav className="bg-white fixed top-0 left-0 right-0 z-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between h-16">
            {/* Left side - Logo */}
            <div className="flex items-center">
              <Link to="/" className="text-xl font-bold text-rose-600">
                Pich Shop
              </Link>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.link}
                  className="relative text-red-700 transition-colors duration-300 hover:text-rose-600 group"
                >
                  {item.name}
                  <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-rose-600 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ))}
            </div>

            {/* Right side - Icons */}
            <div className="flex items-center space-x-4">
              <Link
                to="/cart"
                className="relative p-2 text-rose-700 hover:text-rose-600 transition-colors"
              >
                <CiShoppingCart size={24} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </Link>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-2 text-rose-700 focus:outline-none"
              >
                <FaBars />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.link}
                  className="block px-3 py-2 text-rose-700 hover:bg-gray-100"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
      <Outlet className="" />
    </div>
  );
}

export default Navbar;
