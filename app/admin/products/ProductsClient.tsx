'use client';

import React, { useState } from 'react';
import { Product, StockStatus } from '@/lib/types';
import { formatIDR } from '@/lib/utils';
import { saveProduct, updateProduct } from '@/lib/data-service';
import { Package, Plus, CheckCircle, Clock, Edit2, Search, X, Upload, Trash2, Flame } from 'lucide-react';

interface ProductsClientProps {
  initialProducts: Product[];
}

export function ProductsClient({ initialProducts }: ProductsClientProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  React.useEffect(() => {
    import('@/lib/data-service').then(({ getProducts }) => {
      getProducts().then((latest) => {
        if (latest && latest.length > 0) {
          setProducts(latest);
        }
      });
    });
  }, []);

  // New Product Form State
  const [partNumber, setPartNumber] = useState('');
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('Toyota');
  const [category, setCategory] = useState('Filter');
  const [compatibleModels, setCompatibleModels] = useState('');
  const [price, setPrice] = useState('');
  const [stockStatus, setStockStatus] = useState<StockStatus>('READY');
  const [isFastMoving, setIsFastMoving] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStockToggle = async (productId: string, currentStatus: StockStatus) => {
    const newStatus: StockStatus = currentStatus === 'READY' ? 'INDENT' : 'READY';
    await updateProduct(productId, { stock_status: newStatus });
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stock_status: newStatus } : p))
    );
  };

  const handleFastMovingToggle = async (productId: string, currentStatus?: boolean) => {
    const newStatus = !currentStatus;
    await updateProduct(productId, { is_fast_moving: newStatus });
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, is_fast_moving: newStatus } : p))
    );
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partNumber || !name || !price) return;

    setIsSubmitting(true);
    try {
      const modelsArr = compatibleModels
        .split(',')
        .map((m) => m.trim())
        .filter((m) => m.length > 0);

      const created = await saveProduct({
        part_number: partNumber.toUpperCase(),
        name,
        brand,
        category,
        compatible_models: modelsArr.length > 0 ? modelsArr : ['Universal Spec'],
        price: parseFloat(price) || 0,
        stock_status: stockStatus,
        is_fast_moving: isFastMoving,
        image_url: imageUrl || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
        description: description || 'Sparepart heavy duty garansi presisi.',
      });

      setProducts((prev) => [created, ...prev]);
      resetForm();
      setIsAddModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    setIsSubmitting(true);
    try {
      const modelsArr = compatibleModels
        .split(',')
        .map((m) => m.trim())
        .filter((m) => m.length > 0);

      const updates = {
        part_number: partNumber.toUpperCase(),
        name,
        brand,
        category,
        compatible_models: modelsArr,
        price: parseFloat(price) || 0,
        stock_status: stockStatus,
        is_fast_moving: isFastMoving,
        image_url: imageUrl,
        description,
      };

      await updateProduct(editingProduct.id, updates);
      setProducts((prev) =>
        prev.map((p) => (p.id === editingProduct.id ? { ...p, ...updates } : p))
      );

      resetForm();
      setEditingProduct(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setPartNumber(p.part_number);
    setName(p.name);
    setBrand(p.brand);
    setCategory(p.category);
    setCompatibleModels(p.compatible_models.join(', '));
    setPrice(p.price.toString());
    setStockStatus(p.stock_status);
    setIsFastMoving(!!p.is_fast_moving);
    setImageUrl(p.image_url);
    setDescription(p.description);
  };

  const resetForm = () => {
    setPartNumber('');
    setName('');
    setBrand('Toyota');
    setCategory('Filter');
    setCompatibleModels('');
    setPrice('');
    setStockStatus('READY');
    setIsFastMoving(false);
    setImageUrl('');
    setDescription('');
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setImageUrl(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.part_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black uppercase text-slate-900 tracking-tight flex items-center gap-2">
            <Package className="h-6 w-6 text-amber-500" />
            Manajemen Produk & Update Stok
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Tambah SKU baru, ubah harga netto, kelola status Fast-Moving (Yang Sering Dipakai), dan status stok (READY / INDENT).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari Part Number / Nama..."
              className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-4 text-xs text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
          </div>

          <button
            onClick={() => {
              resetForm();
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-1.5 shrink-0 rounded-lg bg-amber-500 px-4 py-2 text-xs font-black uppercase text-slate-950 hover:bg-amber-400 shadow-xs transition"
          >
            <Plus className="h-4 w-4" />
            Tambah Part
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-900 text-white uppercase text-[10px] font-black tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-4 py-3.5">Part Number</th>
                <th className="px-4 py-3.5">Nama & Brand</th>
                <th className="px-4 py-3.5">Kategori</th>
                <th className="px-4 py-3.5">Model Kompatibel</th>
                <th className="px-4 py-3.5">Harga Netto</th>
                <th className="px-4 py-3.5">Tipe Part</th>
                <th className="px-4 py-3.5">Status Stok</th>
                <th className="px-4 py-3.5 text-right">Edit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50 transition">
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className="font-mono-part font-black text-slate-900 text-xs">
                      {product.part_number}
                    </span>
                  </td>

                  <td className="px-4 py-3.5">
                    <span className="font-bold text-slate-900 block">{product.name}</span>
                    <span className="text-[10px] font-extrabold uppercase text-amber-600">
                      {product.brand}
                    </span>
                  </td>

                  <td className="px-4 py-3.5 font-semibold text-slate-600">
                    {product.category}
                  </td>

                  <td className="px-4 py-3.5 max-w-xs">
                    <span className="text-[11px] text-slate-500 font-medium">
                      {product.compatible_models.join(', ')}
                    </span>
                  </td>

                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className="font-black text-slate-900">
                      {formatIDR(product.price)}
                    </span>
                  </td>

                  {/* Fast Moving Toggle Column */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <button
                      onClick={() => handleFastMovingToggle(product.id, product.is_fast_moving)}
                      title="Klik untuk mengubah status Fast Moving / Yang Sering Dipakai"
                      className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-[10px] uppercase shadow-2xs transition font-extrabold ${
                        product.is_fast_moving
                          ? 'bg-amber-500 text-slate-950 hover:bg-amber-400 font-black ring-1 ring-amber-600'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-300'
                      }`}
                    >
                      <Flame className={`h-3 w-3 ${product.is_fast_moving ? 'text-slate-950 fill-slate-950' : 'text-slate-400'}`} />
                      {product.is_fast_moving ? 'FAST MOVING' : 'REGULAR'}
                    </button>
                  </td>

                  {/* Stock Status Toggle Column */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <button
                      onClick={() => handleStockToggle(product.id, product.stock_status)}
                      className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-[10px] font-black uppercase shadow-2xs transition ${
                        product.stock_status === 'READY'
                          ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                          : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                      }`}
                    >
                      {product.stock_status === 'READY' ? (
                        <>
                          <CheckCircle className="h-3 w-3" /> READY
                        </>
                      ) : (
                        <>
                          <Clock className="h-3 w-3 text-amber-400" /> INDENT
                        </>
                      )}
                    </button>
                  </td>

                  <td className="px-4 py-3.5 text-right whitespace-nowrap">
                    <button
                      onClick={() => openEditModal(product)}
                      className="p-1.5 text-slate-600 hover:text-amber-600 transition hover:bg-slate-100 rounded-md"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {(isAddModalOpen || editingProduct) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold uppercase text-slate-900 text-base">
                {editingProduct ? 'Edit Sparepart SKU' : 'Tambah Sparepart Baru'}
              </h3>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingProduct(null);
                }}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={editingProduct ? handleUpdateProductSubmit : handleAddProduct}
              className="space-y-3 text-xs"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Part Number *</label>
                  <input
                    type="text"
                    required
                    value={partNumber}
                    onChange={(e) => setPartNumber(e.target.value)}
                    placeholder="mis: 1R-0716"
                    className="w-full rounded-lg border border-slate-300 p-2 font-mono-part uppercase focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Brand *</label>
                  <select
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 p-2 focus:border-amber-500 focus:outline-none"
                  >
                    <option value="Toyota">Toyota</option>
                    <option value="Komatsu">Komatsu</option>
                    <option value="Caterpillar">Caterpillar</option>
                    <option value="TCM">TCM</option>
                    <option value="Mitsubishi">Mitsubishi</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Sparepart *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="mis: Fuel Filter Element Main"
                  className="w-full rounded-lg border border-slate-300 p-2 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kategori *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 p-2 focus:border-amber-500 focus:outline-none"
                  >
                    <option value="Filter">Filter</option>
                    <option value="Hydraulic">Hydraulic</option>
                    <option value="Brake">Brake</option>
                    <option value="Engine">Engine</option>
                    <option value="Electrical">Electrical</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Harga (IDR) *</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="485000"
                    className="w-full rounded-lg border border-slate-300 p-2 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Model Kompatibel (Pisahkan koma)</label>
                <input
                  type="text"
                  value={compatibleModels}
                  onChange={(e) => setCompatibleModels(e.target.value)}
                  placeholder="Toyota 8FD30, Komatsu PC200"
                  className="w-full rounded-lg border border-slate-300 p-2 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status Stok Initial</label>
                  <select
                    value={stockStatus}
                    onChange={(e) => setStockStatus(e.target.value as StockStatus)}
                    className="w-full rounded-lg border border-slate-300 p-2 focus:border-amber-500 focus:outline-none"
                  >
                    <option value="READY">READY STOCK</option>
                    <option value="INDENT">INDENT 7 DAYS</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tipe Part (Filter Publik)</label>
                  <select
                    value={isFastMoving ? 'FAST_MOVING' : 'REGULAR'}
                    onChange={(e) => setIsFastMoving(e.target.value === 'FAST_MOVING')}
                    className={`w-full rounded-lg border p-2 font-bold focus:outline-none ${
                      isFastMoving
                        ? 'border-amber-500 bg-amber-50 text-amber-900'
                        : 'border-slate-300 bg-white text-slate-700'
                    }`}
                  >
                    <option value="REGULAR">REGULAR PART</option>
                    <option value="FAST_MOVING">🔥 FAST MOVING (Sering Dipakai)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Foto Sparepart (Upload dari HP / Komputer)</label>
                {imageUrl ? (
                  <div className="relative rounded-xl border border-slate-200 bg-slate-50 p-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 overflow-hidden">
                      {/* eslint-disable-next-html-element-suppression */}
                      <img
                        src={imageUrl}
                        alt="Preview"
                        className="h-14 w-14 rounded-lg object-cover border border-slate-300 shrink-0"
                      />
                      <div className="text-xs truncate">
                        <span className="font-bold text-slate-800 block">Foto Berhasil Dipilih</span>
                        <span className="text-[10px] text-slate-500">Siap disimpan ke katalog</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setImageUrl('')}
                      className="flex items-center gap-1 rounded-lg bg-rose-50 px-2.5 py-1.5 text-[11px] font-bold text-rose-600 hover:bg-rose-100 transition shrink-0"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Ganti Foto
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-4 hover:bg-amber-50/50 hover:border-amber-400 transition cursor-pointer group">
                    <Upload className="h-6 w-6 text-slate-400 group-hover:text-amber-600 transition mb-1.5" />
                    <span className="text-xs font-bold text-slate-700">Pilih Foto dari Galeri HP / Komputer</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">Format JPG, PNG, WEBP (Bisa langsung ambil dari Kamera HP)</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Deskripsi Teknis</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Spesifikasi & instruksi pemasangan..."
                  className="w-full rounded-lg border border-slate-300 p-2 focus:border-amber-500 focus:outline-none resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-lg bg-amber-500 py-3 font-extrabold uppercase text-slate-950 hover:bg-amber-400 transition"
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Sparepart'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
