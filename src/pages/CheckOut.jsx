import React, { useState, useEffect, useCallback } from "react";
import { FaLock, FaMapMarkerAlt, FaPhone, FaStickyNote } from "react-icons/fa";
import { api } from "../utils/api";
import { useNavigate } from "react-router-dom";

function CheckOut() {
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    province: "",
    note: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      setError("Your cart is empty");
      return;
    }

    setIsSubmitting(true);
    try {
      // Format the order data to match backend structure
      const orderData = {
        shippingAddress: [
          {
            name: formData.name,
            phone: formData.phone,
            address: formData.address,
            province: formData.province,
            note: formData.note || "",
          },
        ],
        items: cartItems.map((item) => ({
          product: item.productId,
          quantity: item.quantity,
          amount: products[item.productId]?.price || 0,
        })),
      };

      const response = await api.post("/api/order", orderData);
      localStorage.setItem("phone", formData.phone);
      localStorage.removeItem("cart");
      window.dispatchEvent(new Event("cartUpdated"));

    //   navigate("/order-success", { state: { orderId: response.data._id } });
    alert("Order placed successfully");
    } catch (err) {
      console.error("Order submission failed:", err);
      setError(
        err.response?.data?.message ||
          "Failed to place order. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const provinces = [
    { id: 1, name: "Phnom Penh", value: "phnompenh" },
    { id: 2, name: "Siem Reap", value: "siemreap" },
    { id: 3, name: "Sihanoukville", value: "sihanoukville" },
    { id: 4, name: "Battambang", value: "battambang" },
    { id: 5, name: "Kampong Cham", value: "kampongcham" },
    { id: 6, name: "Kampong Chhnang", value: "kampongchhnang" },
    { id: 7, name: "Kampong Speu", value: "kampongspeu" },
    { id: 8, name: "Kampong Thom", value: "kampongthom" },
    { id: 9, name: "Kampot", value: "kampot" },
    { id: 10, name: "Kandal", value: "kandal" },
    { id: 11, name: "Kep", value: "kep" },
    { id: 12, name: "Koh Kong", value: "kohkong" },
    { id: 13, name: "Kratie", value: "kratie" },
    { id: 14, name: "Mondulkiri", value: "mondulkiri" },
    { id: 15, name: "Oddar Meanchey", value: "oddarmeanchey" },
    { id: 16, name: "Pailin", value: "pailin" },
    { id: 17, name: "Preah Sihanouk", value: "preahsihanouk" },
    { id: 18, name: "Preah Vihear", value: "preahvihear" },
    { id: 19, name: "Pursat", value: "pursat" },
    { id: 20, name: "Prey Veng", value: "preyveng" },
    { id: 21, name: "Ratanakiri", value: "ratanakiri" },
    { id: 22, name: "Stung Treng", value: "stungtreng" },
    { id: 23, name: "Svay Rieng", value: "svayrieng" },
    { id: 24, name: "Takeo", value: "takeo" },
    { id: 25, name: "Tbong Khmum", value: "tbongkhmum" },
  ];

  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateCartFromStorage = useCallback(async () => {
    try {
      const items = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartItems(items);

      // Only fetch product details for new items
      const existingProductIds = Object.keys(products);
      const newItems = items.filter(
        (item) => !existingProductIds.includes(item.productId)
      );

      if (newItems.length > 0) {
        const productPromises = newItems.map((item) =>
          api
            .get(`/api/product/${item.productId}`)
            .then((res) => res.data.data)
            .catch((err) => {
              console.error(`Error fetching product ${item.productId}:`, err);
              return null;
            })
        );

        const productData = await Promise.all(productPromises);
        const newProducts = { ...products };

        productData.forEach((product, index) => {
          if (product) {
            newProducts[newItems[index].productId] = product;
          }
        });

        setProducts(newProducts);
      }
    } catch (err) {
      console.error("Error updating cart:", err);
    } finally {
      setLoading(false);
    }
  }, [products]);

  useEffect(() => {
    updateCartFromStorage();
  }, []);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "cart") {
        updateCartFromStorage();
      }
    };

    const handleCartUpdate = () => updateCartFromStorage();

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("cartUpdated", handleCartUpdate);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, [updateCartFromStorage]);

  const subtotal = cartItems.reduce((sum, item) => {
    const product = products[item.productId];
    return sum + (product?.price || 0) * item.quantity;
  }, 0);
  const shipping = 0.0;
  const total = subtotal + shipping;

  return (
    <div className="max-w-6xl mx-auto px-4 py-24 min-h-screen">
      <div className="mb-8 text-center group">
        <h1 className="text-3xl font-bold inline-block relative">
          Checkout
          <span className="absolute left-0 -bottom-1 w-0 h-1 bg-rose-600 transition-all duration-300 group-hover:w-full"></span>
        </h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <FaMapMarkerAlt className="mr-2 text-rose-600" />
              Shipping Information
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  placeholder="Enter your full name"
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Phone Number (Telegram)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaPhone className="text-gray-400" />
                    </div>
                    <input
                      placeholder="Enter your phone number(Telegram)"
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="province"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Province/State
                  </label>
                  <select
                    id="province"
                    name="province"
                    value={formData.province}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Province/State</option>
                    {provinces.map((province) => (
                      <option key={province.id} value={province.value}>
                        {province.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Full Address
                </label>
                <textarea
                  id="address"
                  name="address"
                  placeholder="Enter your full address example: Toul Kork, Phnom Penh, Cambodia"
                  rows="3"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  required
                ></textarea>
              </div>

              <div>
                <label
                  htmlFor="note"
                  className="text-sm font-medium text-gray-700 mb-1 flex items-center"
                >
                  <FaStickyNote className="mr-2 text-rose-600" />
                  Order Notes (Optional)
                </label>
                <textarea
                  id="note"
                  name="note"
                  rows="2"
                  value={formData.note}
                  onChange={handleChange}
                  placeholder="Notes about your order, e.g. special delivery instructions"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                ></textarea>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting || cartItems.length === 0}
                  className={`w-full ${
                    isSubmitting || cartItems.length === 0
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-rose-600 hover:bg-rose-700"
                  } text-white py-3 px-6 rounded-md transition-colors flex items-center justify-center`}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <FaLock className="mr-2" />
                      {cartItems.length > 0 ? "Place Order" : "Cart is Empty"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

            {loading ? (
              <div className="text-center py-4">Loading cart items...</div>
            ) : error ? (
              <div className="text-red-500 text-center py-4">{error}</div>
            ) : cartItems.length === 0 ? (
              <div className="text-center py-4">Your cart is empty</div>
            ) : (
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => {
                  const product = products[item.productId];
                  if (!product) return null;

                  return (
                    <div
                      key={`${item.productId}-${item.quantity}`}
                      className="flex justify-between items-center"
                    >
                      <div className="flex items-center">
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-gray-500">
                            {item.quantity} × ${product.price.toFixed(2)}
                          </div>
                        </div>
                      </div>
                      <span className="font-medium">
                        ${(product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="border-t border-gray-200 pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200 mt-4">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-6 text-sm text-gray-500">
              <p className="flex items-center">
                <FaLock className="mr-2" />
                Your payment is secure and encrypted.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckOut;
