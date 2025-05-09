import { useEffect, useState } from "react";
import { Product } from "../../types/product";
import { useNotification } from "../../hooks/useNotification";
import { productService } from "../../services/product";
import { Spinner } from "../ui/Spinner";
import ProductCard from "./ProductCard";

export const ProductList: React.FC<{
  userId: string;
  searchTerm: string;
  selectedCategory: string;
}> = ({ userId, searchTerm, selectedCategory }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { showNotification } = useNotification();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [internalSelectedCategory, setInternalSelectedCategory] =
    useState<string>(selectedCategory);
  const itemsPerPage = 8;

  // Sync internal category state with prop
  useEffect(() => {
    setInternalSelectedCategory(selectedCategory);
  }, [selectedCategory]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await productService.getProducts(userId);
        setProducts(
          data.sort(
            (a, b) =>
              new Date(b.createdAt ?? 0).getTime() -
              new Date(a.createdAt ?? 0).getTime()
          )
        );
      } catch (error) {
        showNotification("error", "Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [userId, showNotification]);

  const handleDelete = (productId: string) => {
    setProducts(products.filter((product) => product.id !== productId));
  };

  // Get unique categories from products
  const categories = [
    "All Categories",
    ...Array.from(new Set(products.map((product) => product.category))),
  ];

  // Filter products by search term and category
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      internalSelectedCategory === "All Categories" ||
      product.category === internalSelectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Pagination logic
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4 h-full overflow-y-auto max-h-[600px] custom-scroll">
      {/* Category Filter */}

      {/* Scrollable Product Grid */}
      <div className="scrollbar-none pr-1 custom-scroll">
        {currentProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {currentProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 text-lg">No products found</p>
        )}
      </div>

      {/* Pagination Controls */}
      {totalItems > itemsPerPage && (
        <div className="flex justify-center items-center space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded-md ${
              currentPage === 1
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 rounded-md ${
                  currentPage === page
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {page}
              </button>
            )
          )}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded-md ${
              currentPage === totalPages
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductList;
