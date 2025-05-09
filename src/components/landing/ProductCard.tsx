import React, { useState } from "react";
import { Product } from "../../types/product";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="max-w-[300px] h-[360px] rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-transform duration-300 transform hover:-translate-y-1 border border-gray-200"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative w-full h-48 overflow-hidden bg-gray-100">
        <img
          src={product.imageUri || "https://via.placeholder.com/300"}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-500"
          style={{
            transform: isHovered ? "scale(1.08)" : "scale(1)",
          }}
        />
        <div
          className={`absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent transition-opacity duration-300 ${
            isHovered ? "opacity-80" : "opacity-60"
          }`}
        />
      </div>

      {/* Content Container */}
      <div className="p-4 space-y-2">
        <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
          {product.title}
        </h3>
        <p className="text-gray-600 text-sm line-clamp-3">
          {product.detail || "No details provided"}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;
