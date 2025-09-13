import React from "react";
import { api } from "../utils/api";
import Carousel from "../components/Carousel";
import Footer from "../components/Footer";
import { CiShoppingCart } from "react-icons/ci";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const [products, setProducts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [quantity, setQuantity] = React.useState(1);
  const getProducts = async () => {
    const response = await api.get("/api/product");
    setProducts(response.data.data);
    setLoading(false);
  };
  React.useEffect(() => {
    getProducts();
  }, []);

  const handleDetail = (id) => {
    navigate(`/product/${id}`);
  };

  const saveCartToLocalStorage = (productId, e) => {
    e.stopPropagation();

    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItemIndex = existingCart.findIndex(
      (item) => item.productId === productId
    );

    if (existingItemIndex >= 0) {
      existingCart[existingItemIndex].quantity += 1;
    } else {
      existingCart.push({
        productId: productId,
        quantity: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(existingCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="min-h-screen flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
          <p className="text-rose-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="container max-w-6xl mx-auto p-4 pt-18">
      <Carousel />

      <div className="mb-8 mt-8 text-center group">
        <h1 className="text-3xl font-bold inline-block relative">
          Products
          <span className="absolute left-0 -bottom-1 w-0 h-1 bg-rose-600 transition-all duration-300 group-hover:w-full"></span>
        </h1>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <div
            onClick={() => navigate(`/product/${product._id}`)}
            key={product._id}
            className="border-1 border-gray-300 p-4 cursor-pointer"
          >
            <img
              src={`${import.meta.env.VITE_API_URL}/${product.images[0]}`}
              alt={product.name}
              className="w-sm h-64 object-contain"
            />
            <div className="flex justify-between items-center mt-4">
              <h1 className="mt-2 text-lg font-semibold">{product.name}</h1>
              <h1 className="mt-2 text-lg text-rose-600 font-semibold">
                {product.price}$
              </h1>
            </div>
            <button
              onClick={(e) => saveCartToLocalStorage(product._id, e)}
              className="mt-4 flex items-center justify-center gap-2 py-2 bg-rose-600 z-10 text-white w-full rounded-lg hover:bg-rose-700 transition-colors cursor-pointer"
            >
              <CiShoppingCart size={20} />
              <span>Add to Bag</span>
            </button>
          </div>
        ))}
      </div>
      <Footer />
    </section>
  );
}

export default Home;
