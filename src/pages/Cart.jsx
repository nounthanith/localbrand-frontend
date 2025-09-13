import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaTrash,
  FaArrowLeft,
  FaShoppingCart,
  FaPlus,
  FaMinus,
} from "react-icons/fa";
import { api } from "../utils/api";
import CheckOut from "./CheckOut";

function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const items = JSON.parse(localStorage.getItem("cart") || "[]");
        setCartItems(items);

        // Fetch details for each product in cart
        const productPromises = items.map((item) =>
          api
            .get(`/api/product/${item.productId}`)
            .then((res) => res.data.data)
            .catch((err) => {
              console.error(`Error fetching product ${item.productId}:`, err);
              return null;
            })
        );

        const productData = await Promise.all(productPromises);
        const productsMap = {};
        productData.forEach((product, index) => {
          if (product) {
            productsMap[items[index].productId] = product;
          }
        });

        setProducts(productsMap);
      } catch (err) {
        console.error("Error loading cart:", err);
        setError("Failed to load cart. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCartData();
  }, []);

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;

    const updatedCart = cartItems.map((item) =>
      item.productId === productId ? { ...item, quantity: newQuantity } : item
    );

    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const removeItem = (productId) => {
    const updatedCart = cartItems.filter(
      (item) => item.productId !== productId
    );
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));

    const newProducts = { ...products };
    delete newProducts[productId];
    setProducts(newProducts);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 pt-24 text-center">
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4"
          role="alert"
        >
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container max-w-6xl mx-auto p-4 pt-24 min-h-screen text-center">
        <div className="bg-white rounded-lg shadow-sm p-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FaShoppingCart className="text-gray-400 text-4xl" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
          <p className="text-gray-600 mb-6">
            Looks like you haven't added any products yet
          </p>
          <Link
            to="/"
            className="inline-block bg-rose-600 text-white px-6 py-2 rounded-md hover:bg-rose-700 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container max-w-6xl mx-auto p-4 pt-24 min-h-screen">
        <Link
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-rose-600 mb-8 transition-colors"
        >
          <FaArrowLeft className="mr-2" /> Continue Shopping
        </Link>

        <div className="mb-8 text-center group">
          <h1 className="text-3xl font-bold inline-block relative">
            Your Shopping Cart
            <span className="absolute left-0 -bottom-1 w-0 h-1 bg-rose-600 transition-all duration-300 group-hover:w-full"></span>
          </h1>
        </div>

        <div className="w-full">
          <div className="bg-white">
            {cartItems.map((item) => {
              const product = products[item.productId];
              if (!product) return null;

              return (
                <div
                  key={item.productId}
                  className="flex flex-col sm:flex-row items-start sm:items-center py-6 border-b"
                >
                  {/* Product Image */}
                  <div className="w-full sm:w-32 h-32 bg-gray-50 rounded-lg overflow-hidden mb-4 sm:mb-0 sm:mr-6 flex-shrink-0">
                    <img
                      src={`https://localbran-backend.onrender.com/${product.images?.[0]}`}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Details and Actions */}
                  <div className="flex-1 w-full">
                    <div className="flex justify-center items-center">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">
                          {product.name}
                        </h3>
                        <p className="text-lg font-bold text-rose-600 my-2">
                          ${(product.price * item.quantity).toFixed(2)}
                        </p>
                        <div className="flex items-center border rounded-none overflow-hidden w-fit">
                          <button
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity - 1)
                            }
                            className="px-3 py-1 hover:bg-gray-100 transition-colors"
                            disabled={item.quantity <= 1}
                          >
                            <FaMinus size={12} />
                          </button>
                          <span className="w-10 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity + 1)
                            }
                            className="px-3 py-1 hover:bg-gray-100 transition-colors"
                          >
                            <FaPlus size={12} />
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="relative text-lg font-semibold text-rose-600 hover:text-rose-800 transition-colors group"
                      >
                        Remove
                        <span className="absolute left-0 -bottom-0.5 w-0 h-[2px] bg-rose-600 transition-all duration-300 group-hover:w-full"></span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <CheckOut />
      </div>
    </>
  );
}

export default Cart;
