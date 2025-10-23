"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useProducts } from "@/contexts/ProductContext";
import { IProduct } from "@/types/product";
import { 
  Eye, 
  Edit, 
  Trash2, 
  Star, 
  Heart, 
  ShoppingCart, 
  Sparkles,
  TrendingUp,
  Award,
  Zap,
  Plus,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  X
} from "lucide-react";
import ImageCarousel from "@/components/ImageCarousel";
import { ProductLoadingSpinner } from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/ErrorMessage";
import ConfirmationDialog from "@/components/ConfirmationDialog";

export default function HomePage() {
  const { 
    products, 
    loading, 
    error, 
    removeProduct, 
    optimisticRemoveProduct,
    refreshProducts,
    clearError,
    forceRefresh,
    lastUpdated
  } = useProducts();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  
  // Search and Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'date'>('name');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [category, setCategory] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Clear error when component mounts
  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [error, clearError]);

  // Force refresh when page becomes visible (e.g., returning from CRUD operations)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('🔄 Page became visible, force refreshing...');
        forceRefresh();
      }
    };

    const handleFocus = () => {
      console.log('🔄 Window focused, force refreshing...');
      forceRefresh();
    };

    // Also refresh when component mounts if data is stale (older than 10 seconds)
    const isDataStale = !lastUpdated || (Date.now() - lastUpdated) > 10000;
    if (isDataStale) {
      console.log('🔄 Data is stale, force refreshing...');
      forceRefresh();
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [forceRefresh, lastUpdated]);

  // Handle delete with optimistic updates
  async function handleDelete(id: string) {
    try {
      // Optimistic update - remove from UI immediately
      optimisticRemoveProduct(id);
      setShowDeleteConfirm(null);
      
      // Then actually delete from server
      const success = await removeProduct(id);
      
      if (!success) {
        // If delete failed, refresh products to restore the item
        await refreshProducts();
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      // Refresh products to restore the item
      await refreshProducts();
    }
  }

  // Filter and sort products
  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesPrice = (!priceRange.min || product.price >= Number(priceRange.min)) &&
                         (!priceRange.max || product.price <= Number(priceRange.max));
      
      const matchesCategory = !category || product.category === category;
      
      return matchesSearch && matchesPrice && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.price - b.price;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'date':
          return new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime();
        default:
          return 0;
      }
    });

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortBy, priceRange, category]);

  // Get unique categories
  const categories = [...new Set(products.map(p => p.category).filter(Boolean))];

  if (loading) {
    return <ProductLoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Error Message */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <ErrorMessage error={error} onDismiss={clearError} />
        </div>
      )}
      
      {/* Hero Section with Carousel Background */}
      <div className="relative overflow-hidden h-[70vh] min-h-[600px]">
        {/* Carousel Background */}
        <div className="absolute inset-0">
          <ImageCarousel />
        </div>
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        {/* Content */}
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Fashion
              <span className="block bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent">
                Collection
              </span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              Discover our curated selection of trendy clothing and accessories designed with style, 
              comfort, and elegance in mind.
            </p>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-16 h-16 bg-pink-300/20 rounded-full animate-bounce"></div>
        <div className="absolute top-1/2 left-20 w-12 h-12 bg-white/10 rounded-full animate-ping"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Fashion Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our Featured
            <span className="block bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Fashion
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our handpicked selection of trendy clothing and accessories that combine style, 
            comfort, and exceptional quality for the modern fashionista.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="group bg-white rounded-2xl p-6 shadow-lg border border-blue-100 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors duration-300">
                <Award className="w-8 h-8 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">{products.length}</p>
                <p className="text-gray-600">Fashion Items</p>
              </div>
            </div>
          </div>
          
          <div className="group bg-white rounded-2xl p-6 shadow-lg border border-green-100 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-xl group-hover:bg-green-200 transition-colors duration-300">
                <TrendingUp className="w-8 h-8 text-green-600 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900 group-hover:text-green-600 transition-colors duration-300">
                  ${products.reduce((sum, p) => sum + p.price, 0).toFixed(2)}
                </p>
                <p className="text-gray-600">Collection Value</p>
              </div>
            </div>
          </div>
          
          <div className="group bg-white rounded-2xl p-6 shadow-lg border border-purple-100 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-xl group-hover:bg-purple-200 transition-colors duration-300">
                <Zap className="w-8 h-8 text-purple-600 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors duration-300">
                  {products.length > 0 ? (products.reduce((sum, p) => sum + p.price, 0) / products.length).toFixed(2) : '0'}
                </p>
                <p className="text-gray-600">Average Price</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search fashion items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
            
            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-3 bg-pink-100 text-pink-600 rounded-xl hover:bg-pink-200 transition-colors"
            >
              <Filter className="w-5 h-5 mr-2" />
              Filters
            </button>
            
            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'price' | 'date')}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option value="name">Sort by Name</option>
              <option value="price">Sort by Price</option>
              <option value="date">Sort by Date</option>
            </select>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange({...priceRange, min: e.target.value})}
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({...priceRange, max: e.target.value})}
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Clear Filters */}
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setPriceRange({ min: '', max: '' });
                      setCategory('');
                      setSortBy('name');
                    }}
                    className="w-full px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Info */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            Showing {startIndex + 1}-{Math.min(endIndex, filteredProducts.length)} of {filteredProducts.length} items
          </p>
          <p className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </p>
        </div>

        {/* Products Section */}
        {currentProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="relative">
              <div className="w-40 h-40 mx-auto mb-8 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full flex items-center justify-center">
                  <Sparkles className="w-12 h-12 text-blue-500" />
                </div>
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full animate-bounce"></div>
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-4">
              {filteredProducts.length === 0 ? 'No items found' : 'Your fashion collection is empty'}
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {filteredProducts.length === 0 
                ? 'Try adjusting your search criteria or filters to find what you\'re looking for.'
                : 'Start building your amazing fashion collection by adding your first clothing item.'
              }
            </p>
            <Link
              href="/main/products/create"
              className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            >
              <Plus className="w-6 h-6 mr-3 group-hover:rotate-90 transition-transform duration-300" />
              Add Your First Fashion Item
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {currentProducts.map((product, index) => (
              <div
                key={product._id}
                className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 overflow-hidden border border-gray-100 animate-fade-in-up"
                style={{ 
                  animationDelay: `${index * 150}ms`,
                  animationFillMode: 'both'
                }}
              >
                {/* Product Image */}
                <div className="relative h-64 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 overflow-hidden">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-20 h-20 mx-auto mb-4 bg-white/50 rounded-2xl flex items-center justify-center">
                          <Sparkles className="w-10 h-10 text-blue-500" />
                        </div>
                        <p className="text-gray-500 font-medium">No Image</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Overlay Badges */}
                  <div className="absolute top-4 left-4">
                    <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      Available
                    </span>
                  </div>
                  
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <button className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
                      <Heart className="w-4 h-4 text-red-500" />
                    </button>
                    <button className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
                      <ShoppingCart className="w-4 h-4 text-blue-500" />
                    </button>
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center text-white">
                        <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                        <span className="text-sm font-medium">4.8 (124 reviews)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Product Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                  
                  {/* Price */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <span className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        ${product.price}
                      </span>
                      <span className="text-sm text-gray-500 ml-2">USD</span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Product ID</p>
                      <p className="text-sm font-mono text-gray-700">#{product._id?.slice(-6)}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      href={`/main/products/${product._id}`}
                      className="group/btn bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-3 px-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl"
                    >
                      <Eye className="w-4 h-4 mr-2 group-hover/btn:animate-pulse" />
                      View
                    </Link>
                    
                    <Link
                      href={`/main/products/edit/${product._id}`}
                      className="group/btn bg-gradient-to-r from-amber-500 to-orange-500 text-white text-center py-3 px-4 rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transform hover:scale-105 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl"
                    >
                      <Edit className="w-4 h-4 mr-2 group-hover/btn:animate-pulse" />
                      Edit
                    </Link>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => setShowDeleteConfirm(product._id!)}
                    className="w-full mt-3 bg-red-50 text-red-600 py-3 px-4 rounded-xl font-semibold hover:bg-red-100 transform hover:scale-105 transition-all duration-300 flex items-center justify-center border border-red-200 hover:border-red-300"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Product
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-12 space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </button>
            
            <div className="flex space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 rounded-lg transition-colors ${
                    currentPage === page
                      ? 'bg-pink-600 text-white'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationDialog
        isOpen={!!showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(null)}
        onConfirm={() => showDeleteConfirm && handleDelete(showDeleteConfirm)}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
}
