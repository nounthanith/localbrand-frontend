import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./layouts/Navbar";
import Footer from "./components/Footer";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import OrderSuccess from "./pages/OrderSuccess";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Navbar />}>
          <Route path="/" element={<Home />} />

          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order-success" element={<OrderSuccess />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
