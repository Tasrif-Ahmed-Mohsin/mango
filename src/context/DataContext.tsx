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

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [mounted, setMounted] = useState(false);

  const loadData = async () => {
    try {
      const savedCats = localStorage.getItem('agri_categories');
      const savedProds = localStorage.getItem('agri_products');

      if (savedCats) setCategories(JSON.parse(savedCats));
      if (savedProds) setProducts(JSON.parse(savedProds));

      const [catsResponse, prodsResponse] = await Promise.all([
        fetch('/api/categories'),
        fetch('/api/products'),
      ]);

      if (catsResponse?.ok) {
        const catsData = await catsResponse.json();
        if (Array.isArray(catsData.categories) && catsData.categories.length > 0) {
          setCategories(catsData.categories);
          localStorage.setItem('agri_categories', JSON.stringify(catsData.categories));
        }
      }

      if (prodsResponse?.ok) {
        const prodsData = await prodsResponse.json();
        if (Array.isArray(prodsData.products) && prodsData.products.length > 0) {
          setProducts(prodsData.products);
          localStorage.setItem('agri_products', JSON.stringify(prodsData.products));
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

  useEffect(() => {
    if (mounted) {
        localStorage.setItem('agri_categories', JSON.stringify(categories));
    }
  }, [categories, mounted]);

  useEffect(() => {
    if (mounted) {
        localStorage.setItem('agri_products', JSON.stringify(products));
    }
  }, [products, mounted]);

  const addCategory = async (c: Category) => {
    setCategories(prev => [...prev, c]);
    try {
      await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(c),
      });
    } catch (err) {
      console.error("Failed to sync category to server", err);
    }
  };

  const addProduct = async (p: Product) => {
    setProducts(prev => [...prev, p]);
    try {
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(p),
      });
    } catch (err) {
      console.error("Failed to sync product to server", err);
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
      console.error("Failed to remove category from server", err);
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
      console.error("Failed to remove product from server", err);
    }
  };

  const updateCategory = (id: string, updates: Partial<Category>) => setCategories(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  const updateProduct = (id: string, updates: Partial<Product>) => setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));

  const syncLocalStorageToServer = async () => {
    const localCats = JSON.parse(localStorage.getItem('agri_categories') || '[]');
    const localProds = JSON.parse(localStorage.getItem('agri_products') || '[]');

    for (const c of localCats) {
      await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(c),
      });
    }

    for (const p of localProds) {
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(p),
      });
    }
    
    await loadData();
  };

  return (
    <DataContext.Provider value={{ 
      categories, 
      products, 
      addCategory, 
      addProduct, 
      removeCategory, 
      removeProduct, 
      updateCategory, 
      updateProduct,
      syncLocalStorageToServer 
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