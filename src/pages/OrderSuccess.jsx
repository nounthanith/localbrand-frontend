import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../utils/api";
import {
  FaCheckCircle,
  FaBox,
  FaExclamationTriangle,
  FaShoppingBag,
} from "react-icons/fa";
import Footer from "../components/Footer";

function OrderSuccess() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const navigate = useNavigate();
  const phone = localStorage.getItem("phone");

  useEffect(() => {
    const fetchOrders = async () => {
      if (!phone) {
        setError(
          "No phone number found. Please complete the checkout process."
        );
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await api.get(`/api/order/${phone}`);
        if (
          response.data &&
          response.data.data &&
          response.data.data.length > 0
        ) {
          setOrders(response.data.data);
          setSelectedOrder(response.data.data[0]); // Select the first order by default
        } else {
          setError("No orders found for this phone number.");
        }
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setError("Failed to load order details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [phone]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const calculateOrderTotal = (items) => {
    return items.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-600 mx-auto"></div>
          <p className="mt-4">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
          <FaExclamationTriangle className="text-yellow-500 text-4xl mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Orders Found</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="bg-rose-600 text-white px-6 py-2 rounded-md hover:bg-rose-700 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 mt-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Orders</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order List */}
            <div className="lg:col-span-1">
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 bg-gray-50">
                  <h2 className="text-lg font-medium text-gray-900">
                    Order History
                  </h2>
                </div>
                <div className="border-t border-gray-200">
                  {orders.map((order) => (
                    <div
                      key={order._id}
                      onClick={() => setSelectedOrder(order)}
                      className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${
                        selectedOrder?._id === order._id
                          ? "bg-rose-50 border-l-4 border-l-rose-500"
                          : ""
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">
                            Order #{order._id.slice(-6).toUpperCase()}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span className="font-semibold">
                          ${calculateOrderTotal(order.items).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Details */}
            {selectedOrder && (
              <div className="lg:col-span-2">
                <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
                  <div className="px-4 py-5 sm:px-6 bg-gray-50 flex justify-between items-center">
                    <h2 className="text-lg font-medium text-gray-900">
                      Order #{selectedOrder._id.slice(-6).toUpperCase()}
                    </h2>
                    <span className="text-sm text-gray-500">
                      {formatDate(selectedOrder.createdAt)}
                    </span>
                  </div>

                  <div className="border-t border-gray-200">
                    {selectedOrder.items.map((item, index) => (
                      <div
                        key={index}
                        className="px-4 py-5 sm:px-6 border-b border-gray-200"
                      >
                        <div className="flex items-start">
                          {item.product.images && item.product.images[0] && (
                            <img
                              src={`${import.meta.env.VITE_API_URL}${item.product.images[0]}`}
                              alt={item.product.name}
                              className="w-20 h-20 object-cover rounded-md"
                            />
                          )}
                          <div className="ml-6 flex-1">
                            <h3 className="text-lg font-medium text-gray-900">
                              {item.product.name}
                            </h3>
                            <p className="mt-1 text-gray-600">
                              Quantity: {item.quantity}
                            </p>
                            <p className="mt-1 text-gray-600">
                              ${item.product.price} × {item.quantity} = $
                              {(item.product.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="px-4 py-5 sm:px-6 bg-gray-50">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-medium">Total Amount</span>
                      <span className="text-xl font-semibold text-rose-600">
                        ${calculateOrderTotal(selectedOrder.items).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Shipping Information */}
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                  <div className="px-4 py-5 sm:px-6 bg-gray-50">
                    <h2 className="text-lg font-medium text-gray-900">
                      Shipping Information
                    </h2>
                  </div>
                  <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">
                          Shipping Address
                        </h3>
                        <address className="mt-1 text-sm not-italic text-gray-900">
                          {selectedOrder.shippingAddress[0].name}
                          <br />
                          {selectedOrder.shippingAddress[0].address
                            .split("\\n")
                            .map((line, i) => (
                              <span key={i}>
                                {line}
                                <br />
                              </span>
                            ))}
                          {selectedOrder.shippingAddress[0].province}
                        </address>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">
                          Contact Information
                        </h3>
                        <div className="mt-1 text-sm text-gray-900">
                          <p>{selectedOrder.shippingAddress[0].phone}</p>
                        </div>
                        {selectedOrder.shippingAddress[0].note && (
                          <div className="mt-4">
                            <h4 className="text-sm font-medium text-gray-500">
                              Delivery Note
                            </h4>
                            <p className="mt-1 text-sm text-gray-900">
                              {selectedOrder.shippingAddress[0].note}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Continue Shopping Button */}
          <div className="mt-10 text-center">
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default OrderSuccess;
