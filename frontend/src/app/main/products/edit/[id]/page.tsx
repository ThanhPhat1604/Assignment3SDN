"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import ProductForm from "@/components/ProductForm";
import { useProducts } from "@/contexts/ProductContext";
import { IProduct } from "@/types/product";

export default function EditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const { getProductById, editProduct, optimisticUpdateProduct, forceRefresh } = useProducts();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      const productData = getProductById(id);
      if (productData) {
        setProduct(productData as unknown as IProduct);
      } else {
        // If not in context, try to fetch from API
        // This could be improved with a fetchProductById method in context
        router.push("/main");
      }
    }
  }, [id, getProductById, router]);

  async function handleUpdate(data: any) {
    try {
      setIsSubmitting(true);
      
      // Optimistic update - update UI immediately
      optimisticUpdateProduct(id, data);
      
      // Then actually update on server
      const updatedProduct = await editProduct(id, data);
      
      if (updatedProduct) {
        // Success - force refresh data and redirect to main page
        await forceRefresh();
        router.push("/main");
      } else {
        // Failed - the context will handle error display
        // The optimistic update will be reverted automatically
      }
    } catch (error) {
      console.error("Error updating product:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-pink-200 border-t-pink-600 mx-auto mb-6"></div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Loading Product</h3>
          <p className="text-gray-600">Please wait while we fetch the product information...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Edit Product</h1>
      <ProductForm 
        initialData={product} 
        onSubmit={handleUpdate} 
        isSubmitting={isSubmitting}
      />
    </div>
  );
}