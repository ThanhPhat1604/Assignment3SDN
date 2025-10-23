"use client";
import { useState, useEffect, useRef } from "react";
import { IProduct } from "@/types/product";
import { 
  Upload, 
  X, 
  DollarSign, 
  Package, 
  Image as ImageIcon, 
  FileText,
  Tag,
  Star,
  TrendingUp,
  Eye,
  Save,
  Plus,
  AlertCircle,
  CheckCircle,
  Sparkles
} from "lucide-react";

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

interface Props {
  initialData?: IProduct;
  onSubmit: (data: ProductFormData) => void;
  isSubmitting?: boolean;
}

export default function ProductForm({ initialData, onSubmit, isSubmitting = false }: Props) {
  const [form, setForm] = useState<ProductFormData>({
    name: "",
    description: "",
    price: 0,
    image: "",
    category: "",
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [previewImage, setPreviewImage] = useState<string>("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        description: initialData.description || "",
        price: initialData.price || 0,
        image: initialData.image || "",
        category: initialData.category || "",
      });
      setPreviewImage(initialData.image || "");
    }
  }, [initialData]);

  useEffect(() => {
    if (form.image) {
      setPreviewImage(form.image);
    }
  }, [form.image]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  }

  function validateForm(): boolean {
    const newErrors: Record<string, string> = {};

    if (!form.name.trim()) {
      newErrors.name = "Product name is required";
    } else if (form.name.length < 3) {
      newErrors.name = "Product name must be at least 3 characters";
    }

    if (!form.description.trim()) {
      newErrors.description = "Description is required";
    } else if (form.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    if (!form.price || form.price <= 0) {
      newErrors.price = "Price must be greater than 0";
    }

    if (!form.category) {
      newErrors.category = "Please select a category";
    }

    if (form.image && !isValidUrl(form.image)) {
      newErrors.image = "Please enter a valid image URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function isValidUrl(string: string): boolean {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      onSubmit(form);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsLoading(false);
    }
  }

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setForm({ ...form, image: result });
      };
      reader.readAsDataURL(file);
    }
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setForm({ ...form, image: result });
      };
      reader.readAsDataURL(file);
    }
  }

  function removeImage() {
    setForm({ ...form, image: "" });
    setPreviewImage("");
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-700 rounded-full mb-4">
          <Package className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {initialData ? "Edit Product" : "Create New Product"}
        </h1>
        <p className="text-gray-600">
          {initialData ? "Update your product information" : "Add a new product to your store"}
        </p>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
          <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
          <span className="text-green-800 font-medium">
            Product {initialData ? "updated" : "created"} successfully!
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Main Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Column - Basic Information */}
          <div className="space-y-6">
            {/* Product Name */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-semibold text-gray-700">
                <Tag className="w-4 h-4 mr-2 text-blue-600" />
                Product Name *
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  placeholder="Enter product name..."
                  value={form.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-all duration-200 ${
                    errors.name 
                      ? "border-red-300 focus:border-red-500 bg-red-50" 
                      : "border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  }`}
                  required
                />
                {form.name && !errors.name && (
                  <CheckCircle className="absolute right-3 top-3.5 w-5 h-5 text-green-500" />
                )}
              </div>
              {errors.name && (
                <div className="flex items-center text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.name}
                </div>
              )}
            </div>

            {/* Price */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-semibold text-gray-700">
                <DollarSign className="w-4 h-4 mr-2 text-green-600" />
                Price *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-500 font-semibold">$</span>
                <input
                  type="number"
                  name="price"
                  placeholder="0.00"
                  value={form.price || ""}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className={`w-full pl-8 pr-4 py-3 border-2 rounded-lg focus:outline-none transition-all duration-200 ${
                    errors.price 
                      ? "border-red-300 focus:border-red-500 bg-red-50" 
                      : "border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  }`}
                  required
                />
                {form.price && !errors.price && (
                  <CheckCircle className="absolute right-3 top-3.5 w-5 h-5 text-green-500" />
                )}
              </div>
              {errors.price && (
                <div className="flex items-center text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.price}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-semibold text-gray-700">
                <FileText className="w-4 h-4 mr-2 text-purple-600" />
                Description *
              </label>
              <div className="relative">
                <textarea
                  name="description"
                  placeholder="Describe your product in detail..."
                  value={form.description}
                  onChange={handleChange}
                  rows={6}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-all duration-200 resize-none ${
                    errors.description 
                      ? "border-red-300 focus:border-red-500 bg-red-50" 
                      : "border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  }`}
                  required
                />
                {form.description && !errors.description && (
                  <CheckCircle className="absolute right-3 top-3 w-5 h-5 text-green-500" />
                )}
              </div>
              <div className="flex justify-between items-center">
                {errors.description && (
                  <div className="flex items-center text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.description}
                  </div>
                )}
                <span className={`text-xs ml-auto ${
                  form.description.length < 10 ? "text-red-500" : "text-gray-500"
                }`}>
                  {form.description.length}/10 minimum
                </span>
              </div>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-semibold text-gray-700">
                <Tag className="w-4 h-4 mr-2 text-pink-600" />
                Category *
              </label>
              <div className="relative">
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-all duration-200 ${
                    errors.category 
                      ? "border-red-300 focus:border-red-500 bg-red-50" 
                      : "border-gray-200 focus:border-pink-500 focus:ring-4 focus:ring-pink-100"
                  }`}
                  required
                >
                  <option value="">Select a category</option>
                  <option value="Dresses">Dresses</option>
                  <option value="Tops & Blouses">Tops & Blouses</option>
                  <option value="Bottoms">Bottoms</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Shoes">Shoes</option>
                  <option value="Outerwear">Outerwear</option>
                  <option value="Activewear">Activewear</option>
                  <option value="Lingerie">Lingerie</option>
                </select>
                {form.category && !errors.category && (
                  <CheckCircle className="absolute right-3 top-3.5 w-5 h-5 text-green-500" />
                )}
              </div>
              {errors.category && (
                <div className="flex items-center text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.category}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Image Upload */}
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="flex items-center text-sm font-semibold text-gray-700">
                <ImageIcon className="w-4 h-4 mr-2 text-pink-600" />
                Product Image
              </label>
              
              {/* Image Upload Area */}
              <div
                className={`relative border-2 border-dashed rounded-lg p-6 transition-all duration-200 ${
                  isDragOver 
                    ? "border-blue-400 bg-blue-50" 
                    : errors.image 
                      ? "border-red-300 bg-red-50" 
                      : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {previewImage ? (
                  <div className="relative">
                    <img
                      src={previewImage}
                      alt="Product preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">
                      Drag & drop an image here, or{" "}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        browse
                      </button>
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                )}
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              {/* Image URL Input */}
              <div className="mt-4">
                <label className="block text-sm text-gray-600 mb-2">
                  Or enter image URL:
                </label>
                <input
                  type="url"
                  name="image"
                  placeholder="https://example.com/image.jpg"
                  value={form.image || ""}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none transition-all duration-200 ${
                    errors.image 
                      ? "border-red-300 focus:border-red-500 bg-red-50" 
                      : "border-gray-200 focus:border-blue-500"
                  }`}
                />
                {errors.image && (
                  <div className="flex items-center text-red-600 text-sm mt-1">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.image}
                  </div>
                )}
              </div>
            </div>

            {/* Product Stats Preview */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-100">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                Product Preview
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium text-gray-800 truncate max-w-32">
                    {form.name || "Product Name"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-bold text-green-600">
                    ${form.price || "0.00"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Description:</span>
                  <span className="text-gray-800 text-sm">
                    {form.description ? `${form.description.length} chars` : "0 chars"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Category:</span>
                  <span className="text-gray-800 text-sm">
                    {form.category || "Not selected"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Image:</span>
                  <span className={`text-sm ${previewImage ? "text-green-600" : "text-gray-400"}`}>
                    {previewImage ? "✓ Uploaded" : "No image"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center pt-6">
          <button
            type="submit"
            disabled={isLoading || isSubmitting}
            className={`group relative px-8 py-4 rounded-lg font-semibold text-white transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-pink-200 ${
              isLoading || isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-pink-600 to-purple-700 hover:from-pink-700 hover:to-purple-800 shadow-lg hover:shadow-xl"
            }`}
          >
            {isLoading || isSubmitting ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                {initialData ? "Updating..." : "Creating..."}
              </div>
            ) : (
              <div className="flex items-center">
                {initialData ? (
                  <>
                    <Save className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                    Update Product
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                    Create Product
                  </>
                )}
                <Sparkles className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
