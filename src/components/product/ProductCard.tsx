import React, { useState } from "react";
import { Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Product } from "../../types/product";

interface ProductCardProps {
  product: Product;
  onDelete: (id: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`edit-product/${product.id}`);
  };

  return (
    <div
      className="max-w-[300px] rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-transform duration-300 transform hover:-translate-y-1 border border-gray-200 flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative w-full h-48 overflow-hidden bg-gray-100">
        <img
          src={product.imageUri || "https://via.placeholder.com/150"}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-500 ease-in-out"
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
      <div className="p-4 flex flex-col gap-2 flex-grow">
        <h3 className="text-lg font-semibold text-gray-800 leading-snug line-clamp-2">
          {product.title}
        </h3>

        <p className="text-gray-600 text-sm leading-relaxed">
          {product.detail || "No details provided"}
        </p>

        {/* Spacer to push the button down */}
        <div className="flex-grow" />

        {/* Edit Button */}
        <div className="flex justify-end mt-2">
          <button
            onClick={handleEdit}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 transition"
          >
            <Edit size={16} />
            <span>Edit</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
