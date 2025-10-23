"use client";
import { useRouter } from "next/navigation";
import { createProduct } from "@/lib/api";
import ProductForm from "@/components/ProductForm";
import { IProduct } from "@/types/product";

export default function CreateProductPage() {
  const router = useRouter();

  async function handleCreate(data: any) {
    try {
      await createProduct(data);
      router.push("/"); // chuyển về trang chủ sau khi tạo xong
    } catch (error) {
      console.error("Error creating product:", error);
    }
  }

  return (
    <div className="max-w-5xl mx-auto mt-8">
      <ProductForm onSubmit={handleCreate} />
    </div>
  );
}
