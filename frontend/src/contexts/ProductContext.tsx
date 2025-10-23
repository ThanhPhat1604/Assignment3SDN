"use client";
import React, { createContext, useContext, useReducer, useEffect, useRef, ReactNode } from 'react';
import { IProduct } from '@/types/product';
import { getProducts, createProduct, updateProduct, deleteProduct } from '@/lib/api';
import toast from 'react-hot-toast';

// ✅ Plain Product type (without Mongoose Document methods)
type PlainProduct = {
  _id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  category?: string;
  inStock: boolean;
  createdBy: any;
  createdAt: Date;
  updatedAt: Date;
};

// Types
interface ProductState {
  products: PlainProduct[];
  loading: boolean;
  error: string | null;
  lastUpdated: number | null;
}

interface ProductContextType extends ProductState {
  // Actions
  refreshProducts: (forceRefresh?: boolean) => Promise<void>;
  addProduct: (product: Omit<PlainProduct, '_id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => Promise<PlainProduct | null>;
  editProduct: (id: string, updates: Partial<PlainProduct>) => Promise<PlainProduct | null>;
  removeProduct: (id: string) => Promise<boolean>;
  
  // Optimistic updates
  optimisticAddProduct: (product: Omit<PlainProduct, '_id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => PlainProduct;
  optimisticUpdateProduct: (id: string, updates: Partial<PlainProduct>) => void;
  optimisticRemoveProduct: (id: string) => void;
  
  // Utilities
  getProductById: (id: string) => PlainProduct | null;
  clearError: () => void;
  forceRefresh: () => Promise<void>;
}

// Action Types
type ProductAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_PRODUCTS'; payload: PlainProduct[] }
  | { type: 'ADD_PRODUCT'; payload: PlainProduct }
  | { type: 'UPDATE_PRODUCT'; payload: { id: string; updates: Partial<PlainProduct> } }
  | { type: 'REMOVE_PRODUCT'; payload: string }
  | { type: 'OPTIMISTIC_ADD'; payload: PlainProduct }
  | { type: 'OPTIMISTIC_UPDATE'; payload: { id: string; updates: Partial<PlainProduct> } }
  | { type: 'OPTIMISTIC_REMOVE'; payload: string }
  | { type: 'REVERT_OPTIMISTIC'; payload: PlainProduct[] };

// Initial State
const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
  lastUpdated: null,
};

// Reducer
function productReducer(state: ProductState, action: ProductAction): ProductState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    
    case 'SET_PRODUCTS':
      return { 
        ...state, 
        products: action.payload, 
        loading: false, 
        error: null,
        lastUpdated: Date.now()
      };
    
    case 'ADD_PRODUCT':
      return { 
        ...state, 
        products: [action.payload, ...state.products],
        lastUpdated: Date.now()
      };
    
    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: state.products.map(product =>
          product._id === action.payload.id
            ? { ...product, ...action.payload.updates }
            : product
        ),
        lastUpdated: Date.now()
      };
    
    case 'REMOVE_PRODUCT':
      return {
        ...state,
        products: state.products.filter(product => product._id !== action.payload),
        lastUpdated: Date.now()
      };
    
    case 'OPTIMISTIC_ADD':
      return {
        ...state,
        products: [action.payload, ...state.products]
      };
    
    case 'OPTIMISTIC_UPDATE':
      return {
        ...state,
        products: state.products.map(product =>
          product._id === action.payload.id
            ? { ...product, ...action.payload.updates }
            : product
        )
      };
    
    case 'OPTIMISTIC_REMOVE':
      return {
        ...state,
        products: state.products.filter(product => product._id !== action.payload)
      };
    
    case 'REVERT_OPTIMISTIC':
      return {
        ...state,
        products: action.payload
      };
    
    default:
      return state;
  }
}

// Context
const ProductContext = createContext<ProductContextType | undefined>(undefined);

// Provider Component
interface ProductProviderProps {
  children: ReactNode;
}

export function ProductProvider({ children }: ProductProviderProps) {
  const [state, dispatch] = useReducer(productReducer, initialState);
  const isInitialMount = useRef(true);

  // ✅ FIX: Chỉ load products lần đầu, không có periodic refresh
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      refreshProducts();
    }
  }, []);

  // Actions
  const refreshProducts = async (forceRefresh: boolean = false) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const products = await getProducts(forceRefresh);
      // ✅ Convert Mongoose Documents to plain objects
      const plainProducts = JSON.parse(JSON.stringify(products)) as PlainProduct[];
      dispatch({ type: 'SET_PRODUCTS', payload: plainProducts });
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to load products';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      toast.error(errorMessage);
    }
  };

  const addProduct = async (productData: Omit<PlainProduct, '_id' | 'createdAt' | 'updatedAt' | 'createdBy'>): Promise<PlainProduct | null> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await createProduct(productData as any);
      
      console.log('📦 Add Product Response:', response);
      
      if (response?.product) {
        // ✅ Convert Mongoose Document to plain object
        const plainProduct = JSON.parse(JSON.stringify(response.product)) as PlainProduct;
        dispatch({ type: 'ADD_PRODUCT', payload: plainProduct });
        toast.success('Product created successfully!');
        return plainProduct;
      }
      
      throw new Error('Invalid response from server');
    } catch (error: any) {
      console.error('❌ Add Product Error:', error);
      const errorMessage = error.message || 'Failed to create product';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      toast.error(errorMessage);
      return null;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const editProduct = async (id: string, updates: Partial<PlainProduct>) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await updateProduct(id, updates as any);
      
      console.log('📦 Edit Product Response:', response);
      
      if (response?.product) {
        // ✅ Convert Mongoose Document to plain object
        const plainProduct = JSON.parse(JSON.stringify(response.product)) as PlainProduct;
        dispatch({ type: 'UPDATE_PRODUCT', payload: { id, updates: plainProduct } });
        toast.success('Product updated successfully!');
        return plainProduct;
      }
      
      throw new Error('Invalid response from server');
    } catch (error: any) {
      console.error('❌ Edit Product Error:', error);
      const errorMessage = error.message || 'Failed to update product';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      toast.error(errorMessage);
      return null;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const removeProduct = async (id: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const success = await deleteProduct(id);
      
      if (success) {
        dispatch({ type: 'REMOVE_PRODUCT', payload: id });
        toast.success('Product deleted successfully!');
        return true;
      }
      
      throw new Error('Failed to delete product');
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to delete product';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      toast.error(errorMessage);
      return false;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Optimistic Updates
  const optimisticAddProduct = (productData: Omit<PlainProduct, '_id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => {
    const tempId = `temp_${Date.now()}`;
    const optimisticProduct: PlainProduct = {
      ...productData,
      _id: tempId,
      createdBy: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    dispatch({ type: 'OPTIMISTIC_ADD', payload: optimisticProduct });
    return optimisticProduct;
  };

  const optimisticUpdateProduct = (id: string, updates: Partial<PlainProduct>) => {
    dispatch({ type: 'OPTIMISTIC_UPDATE', payload: { id, updates } });
  };

  const optimisticRemoveProduct = (id: string) => {
    dispatch({ type: 'OPTIMISTIC_REMOVE', payload: id });
  };

  // Utilities
  const getProductById = (id: string) => {
    return state.products.find(product => product._id === id) || null;
  };

  const clearError = () => {
    dispatch({ type: 'SET_ERROR', payload: null });
  };

  // Force refresh when navigating back to main page
  const forceRefresh = async () => {
    console.log('🔄 Force refreshing products...');
    await refreshProducts(true);
  };

  const contextValue: ProductContextType = {
    ...state,
    refreshProducts,
    addProduct: addProduct as any, // Type compatibility bridge
    editProduct: editProduct as any, // Type compatibility bridge
    removeProduct,
    optimisticAddProduct,
    optimisticUpdateProduct,
    optimisticRemoveProduct,
    getProductById,
    clearError,
    forceRefresh,
  };

  return (
    <ProductContext.Provider value={contextValue}>
      {children}
    </ProductContext.Provider>
  );
}

// Hook
export function useProducts() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}

// Export types
export type { ProductContextType, ProductState };