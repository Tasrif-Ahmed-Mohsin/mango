"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

export type Category = { id: string, name: string, description?: string, icon: string, image?: string, bgColor?: string };
export type Product = { id: string, categoryId: string, name: string, price: number, description?: string, stock?: number, unit?: string, farmer?: string, image?: string, emoji?: string, tag?: string, tagColor?: string };

type DataContextType = {
  categories: Category[];
  products: Product[];
  addCategory: (c: Category) => void;
  addProduct: (p: Product) => void;
  removeCategory: (id: string) => void;
  removeProduct: (id: string) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

// Simple SWR-like cache with TTL
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const getCachedData = (key: string) => {
  if (typeof window === 'undefined') return null;
  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp > CACHE_TTL) {
      localStorage.removeItem(key);
      return null;
    }
    return data;
  } catch {
    return null;
  }
};

const setCachedData = (key: string, data: any) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
  } catch {
    // Silently fail if storage is full
  }
};

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [mounted, setMounted] = useState(false);

  const loadData = async () => {
    try {
      // Try to load from cache first
      const cachedCats = getCachedData('categories');
      const cachedProds = getCachedData('products');

      if (cachedCats) setCategories(cachedCats);
      if (cachedProds) setProducts(cachedProds);

      // Fetch fresh data in background
      const [catsResponse, prodsResponse] = await Promise.all([
        fetch('/api/categories'),
        fetch('/api/products?limit=200'),
      ]);

      if (catsResponse?.ok) {
        const catsData = await catsResponse.json();
        if (Array.isArray(catsData.categories)) {
          setCategories(catsData.categories);
          setCachedData('categories', catsData.categories);
        }
      }

      if (prodsResponse?.ok) {
        const prodsData = await prodsResponse.json();
        if (Array.isArray(prodsData.products)) {
          setProducts(prodsData.products);
          setCachedData('products', prodsData.products);
        }
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setMounted(true);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const addCategory = async (c: Category) => {
    setCategories(prev => [...prev, c]);
    try {
      await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(c),
      });
    } catch (err) {
      console.error("Failed to save category to MongoDB", err);
    }
  };

  const addProduct = async (p: Product) => {
    setProducts(prev => [...prev, p]);
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(p),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        console.error("Failed to save product to MongoDB", data);
        throw new Error(data?.error || 'Failed to save product');
      }
      return res;
    } catch (err) {
      console.error("Failed to save product to MongoDB", err);
      throw err;
    }
  };

  const removeCategory = async (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
    try {
      await fetch('/api/categories', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
    } catch (err) {
      console.error("Failed to remove category from MongoDB", err);
    }
  };

  const removeProduct = async (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    try {
      await fetch('/api/products', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
    } catch (err) {
      console.error("Failed to remove product from MongoDB", err);
    }
  };

  const updateCategory = (id: string, updates: Partial<Category>) => setCategories(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  const updateProduct = (id: string, updates: Partial<Product>) => setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));

  return (
    <DataContext.Provider value={{ 
      categories, 
      products, 
      addCategory, 
      addProduct, 
      removeCategory, 
      removeProduct, 
      updateCategory, 
      updateProduct
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}