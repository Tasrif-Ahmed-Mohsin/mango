"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useData } from "../../context/DataContext";

type DeleteConfirm = { type: "cat" | "prod"; id: string; name: string } | null;

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/check");
        if (!res.ok) {
          router.push("/login");
          return;
        }
        setIsAuthenticated(true);
      } catch {
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-4xl">🌾</div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <AdminContent onLogout={handleLogout} />;
}

function AdminContent({ onLogout }: { onLogout: () => void }) {
  const { categories, products, addCategory, addProduct, removeCategory, removeProduct, refreshData } = useData();

  const [catName, setCatName] = useState("");
  const [catImage, setCatImage] = useState<File | null>(null);
  const [catImageUrl, setCatImageUrl] = useState("");
  const [catUploading, setCatUploading] = useState(false);
  const catFileRef = useRef<HTMLInputElement>(null);

  const [prodName, setProdName] = useState("");
  const [prodCat, setProdCat] = useState("");
  const [prodPrice, setProdPrice] = useState("");
  const [prodDesc, setProdDesc] = useState("");
  const [prodStock, setProdStock] = useState("");
  const [prodUnit, setProdUnit] = useState("kg");
  const [prodFarmer, setProdFarmer] = useState("");
  const [prodImage, setProdImage] = useState<File | null>(null);
  const [prodImageUrl, setProdImageUrl] = useState("");
  const [prodUploading, setProdUploading] = useState(false);
  const prodFileRef = useRef<HTMLInputElement>(null);

  const [deleteConfirm, setDeleteConfirm] = useState<DeleteConfirm>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const uploadImage = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        console.error("Upload error:", res.status, data.error);
        throw new Error(data.error || "Upload failed");
      }
      if (!data.url) {
        console.error("Upload returned no URL:", data);
        throw new Error("No URL returned from upload");
      }
      console.log("Image uploaded successfully:", data.url);
      return data.url;
    } catch (err: any) {
      console.error("Image upload failed:", err);
      alert("Image upload failed: " + (err?.message || "Unknown error"));
      return null;
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setCatUploading(true);

    try {
      let imageUrl: string | undefined = catImageUrl || undefined;
      
      // Only upload file if no URL provided
      if (!catImageUrl && catImage) {
        const url = await uploadImage(catImage);
        if (url) imageUrl = url;
      }

      await addCategory({
        id: `${catName.toLowerCase().replace(/\s+/g, "-")}_${Date.now()}`,
        name: catName,
        icon: "📦",
        image: imageUrl,
        bgColor: "bg-[#FDF2B3]",
      });

      setCatName("");
      setCatImage(null);
      setCatImageUrl("");
      if (catFileRef.current) catFileRef.current.value = "";
      await refreshData();
    } catch (err: any) {
      console.error('Add category failed:', err);
      alert('Failed to create category: ' + (err?.message || 'Unknown error'));
    } finally {
      setCatUploading(false);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setProdUploading(true);

    try {
      let imageUrl: string | undefined = prodImageUrl || undefined;
      
      // Only upload file if no URL provided
      if (!prodImageUrl && prodImage) {
        const url = await uploadImage(prodImage);
        if (url) imageUrl = url;
      }

      await addProduct({
        id: `p_${Date.now()}`,
        categoryId: prodCat || (categories[0] ? categories[0].id : ""),
        name: prodName,
        price: parseFloat(prodPrice),
        description: prodDesc,
        stock: parseInt(prodStock),
        unit: prodUnit,
        farmer: prodFarmer,
        image: imageUrl,
        emoji: "📦",
      });

      setProdName("");
      setProdPrice("");
      setProdDesc("");
      setProdStock("");
      setProdFarmer("");
      setProdImage(null);
      setProdImageUrl("");
      if (prodFileRef.current) prodFileRef.current.value = "";
      await refreshData();
    } catch (err: any) {
      console.error('Add product failed:', err);
      alert('Failed to create product: ' + (err?.message || 'Unknown error'));
    } finally {
      setProdUploading(false);
    }
  };

  const confirmDelete = (type: "cat" | "prod", id: string, name: string) => {
    setDeleteConfirm({ type, id, name });
  };

  const executeDelete = async () => {
    if (!deleteConfirm) return;
    setIsDeleting(true);
    try {
      if (deleteConfirm.type === "cat") await removeCategory(deleteConfirm.id);
      else await removeProduct(deleteConfirm.id);
      setDeleteConfirm(null);
      await refreshData();
    } catch (err: any) {
      console.error('Delete failed:', err);
      alert('Failed to delete: ' + (err?.message || 'Unknown error'));
    } finally {
      setIsDeleting(false);
    }
  };

  const inputClass = "w-full border border-[#D4CFC3] bg-[#FDFCF8] text-[#2A4026] p-3 rounded-xl focus:outline-none focus:border-[#B04132] transition font-sans";
  const labelClass = "block text-xs font-bold uppercase tracking-widest text-[#5A6D55] mb-2";
  const fileLabelClass = "cursor-pointer w-full border-2 border-dashed border-[#D4CFC3] bg-[#FDFCF8] text-[#81917C] p-4 rounded-xl hover:border-[#B04132] transition font-sans flex flex-col items-center gap-2 text-sm";

  return (
    <div className="container mx-auto max-w-6xl px-6 py-16">
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-[#EAE3D5] bg-white p-8 text-center shadow-2xl">
            <div className="mb-4 text-5xl">⚠️</div>
            <h3 className="mb-2 text-xl font-bold text-[#2A4026]">Confirm Delete</h3>
            <p className="mb-2 text-[#81917C]">Are you sure you want to permanently delete</p>
            <p className="mb-6 text-lg font-bold text-[#B04132]">"{deleteConfirm.name}"</p>
            <div className="flex justify-center gap-3">
              <button onClick={() => setDeleteConfirm(null)} disabled={isDeleting} className="rounded-full border border-[#D4CFC3] px-6 py-3 font-bold text-[#2A4026] transition hover:bg-gray-50 disabled:opacity-50">
                Cancel
              </button>
              <button onClick={executeDelete} disabled={isDeleting} className="rounded-full bg-[#B04132] px-6 py-3 font-bold text-white transition hover:bg-[#8B2E22] disabled:opacity-50">
                {isDeleting ? "Deleting..." : "Delete Forever"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-8 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <h1 className="text-4xl font-serif font-bold text-[#2A4026]">Market Admin</h1>
            <div className="h-px flex-1 bg-[#EAE3D5]"></div>
          </div>
          <div className="flex items-center gap-4 ml-4">
            <button onClick={onLogout} className="rounded-lg bg-[#B04132] px-4 py-2 font-bold text-white transition hover:bg-[#8B2E22]">
              Logout
            </button>
          </div>
        </div>
      </div>



      <div className="mb-16 grid grid-cols-1 gap-10 md:grid-cols-2">
        <div className="rounded-3xl border border-[#EAE3D5] bg-[#FDFCF8] p-8 shadow-sm">
          <h2 className="mb-8 text-2xl font-serif font-bold text-[#B04132]">Add New Category</h2>
          <form onSubmit={handleAddCategory} className="flex flex-col gap-6">
            <div>
              <label className={labelClass}>Category Name</label>
              <input required value={catName} onChange={(e) => setCatName(e.target.value)} className={inputClass} placeholder="e.g. Jackfruit" />
            </div>
            <div>
              <label className={labelClass}>Category Image (URL or File)</label>
              <p className="mb-2 text-xs text-[#81917C]">Paste a public image URL or upload a file</p>
              <input 
                type="url" 
                value={catImageUrl} 
                onChange={(e) => setCatImageUrl(e.target.value)} 
                className={inputClass} 
                placeholder="https://example.com/image.jpg" 
              />
              <p className="my-2 text-center text-xs text-[#81917C]">OR</p>
              <input ref={catFileRef} type="file" accept="image/*" onChange={(e) => setCatImage(e.target.files?.[0] || null)} className="hidden" id="catImageUpload" />
              <label htmlFor="catImageUpload" className={fileLabelClass}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
                <span>{catImage ? catImage.name : "Click to upload category image"}</span>
              </label>
            </div>
            <button type="submit" disabled={catUploading} className="mt-4 rounded-full bg-[#2A4026] py-4 text-sm font-bold uppercase tracking-widest text-[#F9F5EC] shadow-md transition hover:bg-[#1F331C] disabled:opacity-50">
              {catUploading ? "Uploading..." : "Add Category"}
            </button>
          </form>
        </div>

        <div className="rounded-3xl border border-[#EAE3D5] bg-[#FDFCF8] p-8 shadow-sm">
          <h2 className="mb-8 text-2xl font-serif font-bold text-[#B04132]">Add New Product</h2>
          <form onSubmit={handleAddProduct} className="flex flex-col gap-6">
            <div>
              <label className={labelClass}>Product Name</label>
              <input required value={prodName} onChange={(e) => setProdName(e.target.value)} className={inputClass} placeholder="e.g. Raw Jackfruit" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Category</label>
                <select required value={prodCat} onChange={(e) => setProdCat(e.target.value)} className={inputClass}>
                  <option value="">Select category</option>
                  {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Price ($)</label>
                <input required type="number" step="0.01" value={prodPrice} onChange={(e) => setProdPrice(e.target.value)} className={inputClass} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Stock</label>
                <input required type="number" value={prodStock} onChange={(e) => setProdStock(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Unit</label>
                <input required value={prodUnit} onChange={(e) => setProdUnit(e.target.value)} className={inputClass} placeholder="kg" />
              </div>
            </div>
            <div>
              <label className={labelClass}>Farm Name</label>
              <input required value={prodFarmer} onChange={(e) => setProdFarmer(e.target.value)} className={inputClass} placeholder="e.g. Green Valley Farm" />
            </div>
            <div>
              <label className={labelClass}>Description</label>
              <textarea required value={prodDesc} onChange={(e) => setProdDesc(e.target.value)} className={inputClass} rows={2} />
            </div>
            <div>
              <label className={labelClass}>Product Image (URL or File)</label>
              <p className="mb-2 text-xs text-[#81917C]">Paste a public image URL or upload a file</p>
              <input 
                type="url" 
                value={prodImageUrl} 
                onChange={(e) => setProdImageUrl(e.target.value)} 
                className={inputClass} 
                placeholder="https://example.com/image.jpg" 
              />
              <p className="my-2 text-center text-xs text-[#81917C]">OR</p>
              <input ref={prodFileRef} type="file" accept="image/*" onChange={(e) => setProdImage(e.target.files?.[0] || null)} className="hidden" id="prodImageUpload" />
              <label htmlFor="prodImageUpload" className={fileLabelClass}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
                <span>{prodImage ? prodImage.name : "Click to upload product image"}</span>
              </label>
            </div>
            <button type="submit" disabled={prodUploading} className="mt-4 rounded-full bg-[#2A4026] py-4 text-sm font-bold uppercase tracking-widest text-[#F9F5EC] shadow-md transition hover:bg-[#1F331C] disabled:opacity-50">
              {prodUploading ? "Uploading..." : "Add Product"}
            </button>
          </form>
        </div>
      </div>

      <div className="rounded-3xl border border-[#EAE3D5] bg-[#FAF7F0] p-10">
        <div className="mb-8 flex items-center gap-4">
          <h2 className="text-2xl font-serif font-bold text-[#2A4026]">System Overview</h2>
          <div className="h-px flex-1 bg-[#D4CFC3]"></div>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-[#B04132]">Categories ({categories.length})</h3>
            {categories.length === 0 && <p className="text-sm italic text-[#81917C]">No categories yet. Add one above!</p>}
            <ul className="space-y-2">
              {categories.map((c: any) => (
                <li key={c.id} className="group flex items-center gap-3 rounded-xl border border-[#EAE3D5] bg-[#FDFCF8] px-4 py-3 text-sm font-medium text-[#2A4026]">
                  <span className="text-xl">{c.icon}</span>
                  <span className="flex-1">{c.name}</span>
                  {c.image && <img src={c.image} alt="" className="h-8 w-8 rounded-lg object-cover" />}
                  <button onClick={() => confirmDelete("cat", c.id, c.name)} className="rounded-lg p-2 text-[#B04132] opacity-0 transition-opacity hover:bg-red-50 group-hover:opacity-100" title="Delete category">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-[#B04132]">Products ({products.length})</h3>
            {products.length === 0 && <p className="text-sm italic text-[#81917C]">No products yet. Add one above!</p>}
            <ul className="space-y-2">
              {products.map((p: any) => (
                <li key={p.id} className="group flex items-center gap-3 rounded-xl border border-[#EAE3D5] bg-[#FDFCF8] px-4 py-3 text-sm font-medium text-[#2A4026]">
                  <span className="text-xl">{p.emoji || "📦"}</span>
                  <div className="flex-1 flex-col">
                    <span className="font-bold">{p.name}</span>
                    <span className="text-xs text-[#81917C]">${p.price?.toFixed(2)}/{p.unit || "kg"}</span>
                  </div>
                  {p.image && <img src={p.image} alt="" className="h-8 w-8 rounded-lg object-cover" />}
                  <button onClick={() => confirmDelete("prod", p.id, p.name)} className="rounded-lg p-2 text-[#B04132] opacity-0 transition-opacity hover:bg-red-50 group-hover:opacity-100" title="Delete product">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}