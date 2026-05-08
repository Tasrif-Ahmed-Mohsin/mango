"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { categories as initialCategories, products as initialProducts } from '../data/mockData';

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
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedCats = localStorage.getItem('agri_categories');
    const savedProds = localStorage.getItem('agri_products');
    if (savedCats) setCategories(JSON.parse(savedCats));
    if (savedProds) setProducts(JSON.parse(savedProds));
    setMounted(true);
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

  const addCategory = (c: Category) => setCategories(prev => [...prev, c]);
  const addProduct = (p: Product) => setProducts(prev => [...prev, p]);
  const removeCategory = (id: string) => setCategories(prev => prev.filter(c => c.id !== id));
  const removeProduct = (id: string) => setProducts(prev => prev.filter(p => p.id !== id));
  const updateCategory = (id: string, updates: Partial<Category>) => setCategories(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  const updateProduct = (id: string, updates: Partial<Product>) => setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));

  return (
    <DataContext.Provider value={{ categories, products, addCategory, addProduct, removeCategory, removeProduct, updateCategory, updateProduct }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}