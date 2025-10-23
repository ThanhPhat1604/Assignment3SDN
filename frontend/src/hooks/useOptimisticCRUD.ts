"use client";
import { useCallback, useRef } from 'react';
import { useProducts } from '@/contexts/ProductContext';
import { IProduct } from '@/types/product';

interface OptimisticOperation {
  id: string;
  type: 'create' | 'update' | 'delete';
  originalData?: IProduct;
  optimisticData?: Partial<IProduct>;
}

export function useOptimisticCRUD() {
  const { 
    products, 
    addProduct, 
    editProduct, 
    removeProduct,
    optimisticAddProduct,
    optimisticUpdateProduct,
    optimisticRemoveProduct,
    refreshProducts
  } = useProducts();
  
  const operationsRef = useRef<OptimisticOperation[]>([]);

  const executeWithOptimistic = useCallback(async <T>(
    operation: () => Promise<T>,
    optimisticAction: () => void,
    revertAction: () => void
  ): Promise<T | null> => {
    try {
      // Execute optimistic update
      optimisticAction();
      
      // Execute real operation
      const result = await operation();
      
      return result;
    } catch (error) {
      // Revert optimistic update on error
      revertAction();
      throw error;
    }
  }, []);

  const createProductOptimistic = useCallback(async (productData: Omit<IProduct, '_id' | 'createdAt' | 'updatedAt'>) => {
    const tempId = `temp_${Date.now()}`;
    const optimisticProduct: IProduct = {
      ...productData,
      _id: tempId,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as IProduct;

    return executeWithOptimistic(
      () => addProduct(productData),
      () => optimisticAddProduct(productData),
      () => {
        // Revert by refreshing products
        refreshProducts();
      }
    );
  }, [addProduct, optimisticAddProduct, refreshProducts, executeWithOptimistic]);

  const updateProductOptimistic = useCallback(async (id: string, updates: Partial<IProduct>) => {
    const originalProduct = products.find(p => p._id === id);
    if (!originalProduct) {
      throw new Error('Product not found');
    }

    return executeWithOptimistic(
      () => editProduct(id, updates),
      () => optimisticUpdateProduct(id, updates),
      () => {
        // Revert by refreshing products
        refreshProducts();
      }
    );
  }, [products, editProduct, optimisticUpdateProduct, refreshProducts, executeWithOptimistic]);

  const deleteProductOptimistic = useCallback(async (id: string) => {
    const originalProduct = products.find(p => p._id === id);
    if (!originalProduct) {
      throw new Error('Product not found');
    }

    return executeWithOptimistic(
      () => removeProduct(id),
      () => optimisticRemoveProduct(id),
      () => {
        // Revert by refreshing products
        refreshProducts();
      }
    );
  }, [products, removeProduct, optimisticRemoveProduct, refreshProducts, executeWithOptimistic]);

  return {
    createProductOptimistic,
    updateProductOptimistic,
    deleteProductOptimistic,
    products
  };
}
