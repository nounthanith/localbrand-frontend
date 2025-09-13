import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaShoppingCart,
  FaStar,
  FaStarHalfAlt,
} from "react-icons/fa";
import { api } from "../utils/api";
import Footer from "../components/Footer";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = React.useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = React.useState(true);

  const getProduct = async () => {
    try {
      const response = await api.get(`/api/product/${id}`);
      setProduct(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch product:", error);
    }
  };

  const saveCartToLocalStorage = (productId) => {
    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");

    const existingItemIndex = existingCart.findIndex(
      (item) => item.productId === productId
    );

    if (existingItemIndex >= 0) {
      existingCart[existingItemIndex].quantity += quantity;
    } else {
      existingCart.push({
        productId: productId,
        quantity: quantity,
      });
    }

    localStorage.setItem("cart", JSON.stringify(existingCart));
    window.dispatchEvent(new Event("cartUpdated"));
    navigate("/cart");
  };

  React.useEffect(() => {
    getProduct();
  }, [id]);

  const renderRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-orange-400" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="text-orange-400" />);
      } else {
        stars.push(<FaStar key={i} className="text-gray-300" />);
      }
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
        <p className="text-rose-500">Please wait...</p>
      </div>
    );
  }

  return (
    <>
      <div className="container max-w-6xl mx-auto p-4 pt-24">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-rose-600 mb-8 transition-colors"
        >
          <FaArrowLeft className="mr-2" /> Back to Products
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg overflow-hidden border p-4">
              <img
                src={`http://localhost:3000/${
                  product.images?.[selectedImage] || product.images?.[0]
                }`}
                alt={product.name}
                className="w-full h-96 object-contain"
              />
            </div>

            <div className="grid grid-cols-5 gap-2">
              {product.images?.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`border rounded-md overflow-hidden transition-all ${
                    selectedImage === index
                      ? "ring-2 ring-rose-500"
                      : "opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={`http://localhost:3000/${img}`}
                    alt={`${product.name} - ${index + 1}`}
                    className="w-full h-20 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <span className="text-rose-600 font-medium">
                {product.brand?.name}
              </span>
              <h1 className="text-3xl font-bold text-gray-900 mt-1">
                {product.name}
              </h1>
              <div className="flex items-center mt-2 space-x-1">
                {renderRating(product.rating || 0)}
                <span className="text-gray-500 text-sm ml-2">
                  ({Math.floor(Math.random() * 100)} reviews)
                </span>
              </div>
            </div>

            <p className="text-3xl font-bold text-rose-600">${product.price}</p>

            <p className="text-gray-700 leading-relaxed">
              {product.description || "No description available."}
            </p>

            <div className="border-t border-b border-gray-200 py-4">
              <div className="flex items-center space-x-8">
                <div>
                  <span className="text-gray-600">Category:</span>
                  <span className="ml-2 font-medium">
                    {product.category?.name || "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Availability:</span>
                  <span className="ml-2 font-medium text-green-600">
                    In Stock
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center border rounded-md">
                <button
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  className="px-3 py-2 text-lg hover:bg-gray-100"
                >
                  -
                </button>
                <span className="w-10 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity((prev) => prev + 1)}
                  className="px-3 py-2 text-lg hover:bg-gray-100"
                >
                  +
                </button>
              </div>
              <button
                onClick={() => saveCartToLocalStorage(product._id)}
                className="flex-1 bg-rose-600 text-white py-3 px-6 rounded-md hover:bg-rose-700 transition-colors flex items-center justify-center space-x-2"
              >
                <FaShoppingCart />
                <span>Add to Bag</span>
              </button>
            </div>

            <div className="pt-4 space-y-2 text-sm text-gray-600">
              <div className="flex items-center">
                <span className="w-32 font-medium">Brand:</span>
                <span className="flex-1">
                  {product.brand?.name || "N/A"}{" "}
                  <span className="text-red-500">
                    ({product.brand?.country})
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ProductDetail;
