import { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Sparkles,
  Award,
  Truck,
  Star,
  CheckCircle2,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { WHY_CHOOSE_US_ITEMS } from '../../data/chairProductsData';

export default function WhyChooseUs() {
  const { reviews } = useStore();
  const reviewsList = reviews || [];

  const iconMap = {
    ShieldCheck: <ShieldCheck className="w-8 h-8 text-emerald-700" />,
    Sparkles: <Sparkles className="w-8 h-8 text-emerald-700" />,
    Award: <Award className="w-8 h-8 text-emerald-700" />,
    Truck: <Truck className="w-8 h-8 text-emerald-700" />,
  };

  return (
    <section id="why-choose-us" className="py-20 bg-white border-t border-gray-100">
      <div className="w-full max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8">
        {/* 1. Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-emerald-950 font-serif">
            Why Visionaries Choose RoyalChairs
          </h2>


        </div>

        {/* 2. 4 Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {WHY_CHOOSE_US_ITEMS.map((item) => (
            <div
              key={item.id}
              className="bg-cream-soft rounded-2xl p-6 border border-emerald-900/10 hover:border-emerald-700/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-md mb-6 group-hover:scale-110 transition">
                  {iconMap[item.iconName]}
                </div>

                <h3 className="text-lg font-extrabold text-emerald-950 font-serif mb-2">
                  {item.title}
                </h3>

                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-gray-200/60 flex items-center text-xs font-bold text-emerald-800">
                <CheckCircle2 className="w-4 h-4 mr-1 text-emerald-600" />
                <span>Verified Royal Standard</span>
              </div>
            </div>
          ))}
        </div>

        {/* 3. Craftsmanship & Material Story */}
        <div className="bg-emerald-900 text-white rounded-3xl p-8 sm:p-12 mb-20 relative overflow-hidden grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <h3 className="text-2xl sm:text-3xl font-black font-serif leading-tight text-white mb-4">
              From FSC English Oak Forests to Hand-Stitched Italian Nappa Leather
            </h3>

            <div className="space-y-4 text-sm text-emerald-100 leading-relaxed">
              <p>
                Unlike mass-market plastic chairs that break easily, every RoyalChairs model features an internal heavy-duty steel backbone encased in high-density molded memory foam.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="bg-emerald-800/80 p-3 rounded-xl border border-emerald-700 text-xs">
                  <strong className="text-amber-300 block mb-1">Top-Grain Nappa & Velvet</strong>
                  Hand-selected, breathable, and treated to resist spills while aging gracefully.
                </div>

                <div className="bg-emerald-800/80 p-3 rounded-xl border border-emerald-700 text-xs">
                  <strong className="text-amber-300 block mb-1">FSC Certified Oak</strong>
                  Sustainably harvested from managed English woodlands for lifetime frame integrity.
                </div>
              </div>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden shadow-2xl h-80 lg:h-96">
            <img
              src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=80"
              alt="Craftsmanship"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-transparent flex items-end p-6">
              <span className="text-xs font-bold text-amber-200 bg-emerald-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-amber-300/30">
                Master Craftsman Workshop • Gloucestershire, UK
              </span>
            </div>
          </div>
        </div>

        {/* 4. Customer Reviews Card Boxes Section */}
        <div className="bg-cream-soft rounded-3xl p-6 sm:p-10 lg:p-12 border border-emerald-900/10 shadow-lg">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="flex items-center space-x-1 text-amber-500 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
                <span className="text-emerald-950 font-black text-sm ml-2">
                  4.96 / 5.0 Star Overall Rating
                </span>
                <span className="text-xs font-extrabold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200 ml-2">
                  {reviewsList.length} Verified Reviews
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-emerald-950 font-serif">
                Verified Owner Reviews
              </h3>

            </div>
          </div>

          {/* Review Card Boxes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviewsList.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-2xl p-6 border border-emerald-900/10 hover:border-emerald-700/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
              >
                <div>
                  {/* Top Bar: Stars + Verified Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-1 text-amber-500">
                      {[...Array(review.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>

                    <span className="inline-flex items-center text-[10px] font-extrabold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/70">
                      <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
                      Verified Owner
                    </span>
                  </div>

                  {/* Review Text */}
                  <p className="text-gray-700 text-xs sm:text-sm leading-relaxed font-sans mb-6 line-clamp-4">
                    {review.comment}
                  </p>
                </div>

                {/* Author Info & Purchased Chair */}
                <div className="border-t border-gray-100 pt-4 mt-auto space-y-3">
                  <div className="flex items-center space-x-3">
                    <img
                      src={review.avatar}
                      alt={review.name}
                      onError={(e) => {
                        e.target.src =
                          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';
                      }}
                      className="w-10 h-10 rounded-full object-cover border-2 border-emerald-800/20 shadow-2xs shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs sm:text-sm font-extrabold text-emerald-950 font-serif truncate">
                        {review.name}
                      </h4>
                      <p className="text-[11px] text-gray-500 truncate">
                        {review.role} • {review.location}
                      </p>
                    </div>
                  </div>

                  {/* Product Tag */}
                  {review.productName && (
                    <div className="bg-emerald-50/70 rounded-xl p-2 border border-emerald-100 flex items-center justify-between text-[11px]">
                      <span className="text-gray-500 font-medium truncate">Purchased:</span>
                      <span className="font-extrabold text-emerald-900 truncate ml-1">
                        {review.productName}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
