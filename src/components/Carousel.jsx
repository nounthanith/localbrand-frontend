import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

import image1 from "./../assets/images/image1.png";
import image2 from "./../assets/images/image2.jpeg";
import image3 from "./../assets/images/image3.jpeg";
import image4 from "./../assets/images/image4.jpeg";

const images = [image1, image2, image3, image4];

function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  // Auto-advance slides every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-48 sm:h-64 md:h-96 overflow-hidden rounded-lg mb-4">
      <button
        onClick={prevSlide}
        className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 z-10 bg-black/30 text-white p-1 sm:p-2 rounded-full hover:bg-black/50 transition-colors"
        aria-label="Previous slide"
      >
        <FaChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
      </button>

      {/* Slides */}
      <div className="relative w-full h-full">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={image}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Indicators */}
      <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 flex space-x-1 sm:space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? "bg-white scale-125" 
                : "bg-red-600/50 hover:bg-red-600/70"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      <button
        onClick={nextSlide}
        className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 z-10 bg-black/30 text-white p-1 sm:p-2 rounded-full hover:bg-black/50 transition-colors"
        aria-label="Next slide"
      >
        <FaChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
      </button>
    </div>
  );
}

export default Carousel;
