import { useState } from 'react';
import { Layers, Plus, Edit2, Armchair, Sparkles } from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';

export default function CategoriesManager() {
  const { categories, products } = useAdminData();

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header Bar */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <h2 className="text-2xl font-bold text-slate-900 font-serif">Chair Categories & Styles</h2>
            <span className="bg-emerald-50 text-emerald-800 text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
              {categories.length} Collections
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Curate and manage store categories, cover photography, and craftsmanship stories
          </p>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat) => {
          const productCount = products.filter((p) => p.category === cat.id).length;
          return (
            <div
              key={cat.id}
              className="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden group hover:shadow-md hover:border-emerald-300 transition flex flex-col justify-between"
            >
              <div>
                {/* Category Image Cover */}
                <div className="h-44 w-full relative overflow-hidden bg-slate-100">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 w-9 h-9 rounded-xl bg-white/90 backdrop-blur-xs flex items-center justify-center text-lg border border-slate-200 shadow-sm">
                    {cat.emoji}
                  </span>
                  <span className="absolute top-3 right-3 bg-white/95 text-emerald-900 font-mono text-[10px] font-black px-2.5 py-1 rounded-full border border-slate-200 shadow-sm">
                    {productCount} Models
                  </span>
                </div>

                {/* Details */}
                <div className="p-5 space-y-2">
                  <h3 className="text-base font-bold text-slate-900 font-serif group-hover:text-emerald-800 transition">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {cat.desc || cat.description}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-100 mt-3 pt-3">
                <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">
                  ID: {cat.id}
                </span>
                <span className="text-[10px] bg-emerald-50 text-emerald-800 font-extrabold px-2.5 py-1 rounded-md border border-emerald-200">
                  Active in Store
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
