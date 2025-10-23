"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useProducts } from "@/contexts/ProductContext";
import { IProduct } from "@/types/product";
import ProductForm from "@/components/ProductForm";
import { ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";




export default function CreateProductPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { addProduct, optimisticAddProduct, forceRefresh } = useProducts();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      
      // Optimistic update - add to UI immediately
      const optimisticProduct = optimisticAddProduct(data);
      
      // Then actually create on server
      const newProduct = await addProduct(data);
      
      if (newProduct) {
        // Success - force refresh data and redirect to main page
        await forceRefresh();
        router.push("/main");
      } else {
        // Failed - the context will handle error display
        // The optimistic product will be reverted automatically
      }
    } catch (error) {
      console.error("Error creating product:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/main"
                className="flex items-center text-gray-600 hover:text-pink-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Collection
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl flex items-center justify-center mr-3">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Add New Fashion Item</h1>
                  <p className="text-gray-600">Create a new product for your collection</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 px-8 py-6">
            <h2 className="text-2xl font-bold text-white mb-2">Product Information</h2>
            <p className="text-pink-100">
              Fill in the details below to add a new fashion item to your collection
            </p>
          </div>
          
          <div className="p-8">
            <ProductForm 
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
