import { useState, useEffect } from 'react';
import { ShieldCheck, Sparkles, Award, Truck, Star, Quote, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { REVIEWS, WHY_CHOOSE_US_ITEMS } from '../../data/chairProductsData';

export default function WhyChooseUs() {
  const [activeReviewIdx, setActiveReviewIdx] = useState(0);

  // Auto-play slideshow timer for reviews - rotates continuously every 3.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveReviewIdx((prev) => (prev + 1) % REVIEWS.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const iconMap = {
    ShieldCheck: <ShieldCheck className="w-8 h-8 text-emerald-700" />,
    Sparkles: <Sparkles className="w-8 h-8 text-amber-500" />,
    Award: <Award className="w-8 h-8 text-emerald-700" />,
    Truck: <Truck className="w-8 h-8 text-amber-500" />,
  };

  const handleNextReview = () => {
    setActiveReviewIdx((prev) => (prev + 1) % REVIEWS.length);
  };

  const handlePrevReview = () => {
    setActiveReviewIdx((prev) => (prev - 1 + REVIEWS.length) % REVIEWS.length);
  };

  return (
    <section id="why-choose-us" className="py-20 bg-white border-t border-gray-100">
      <div className="w-full max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-emerald-900 bg-emerald-50 border border-emerald-200 px-3.5 py-1 rounded-full mb-3">
            <Award className="w-4 h-4 text-emerald-700" />
            <span>UNCOMPROMISING HERITAGE</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-emerald-950 font-serif">
            Why Visionaries Choose RoyalChairs
          </h2>

          <p className="text-gray-600 text-sm sm:text-base mt-3 leading-relaxed">
            Every chair is handcrafted using eco-conscious English timbers, orthopedic medical biomechanics, and stain-resistant luxury upholstery designed to endure generations.
          </p>
        </div>

        {/* 4 Pillars */}
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

        {/* Craftsmanship & Material Story */}
        <div className="bg-emerald-900 text-white rounded-3xl p-8 sm:p-12 mb-20 relative overflow-hidden grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-block bg-amber-400 text-emerald-950 text-xs font-black px-3 py-1 rounded-full mb-4">
              THE MATERIALS & CRAFT
            </div>

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

        {/* Customer Reviews Slideshow */}
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="bg-cream-soft rounded-3xl p-8 sm:p-12 border border-emerald-900/10 shadow-lg relative"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
            <div>
              <div className="flex items-center space-x-1 text-amber-500 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
                <span className="text-emerald-950 font-black text-sm ml-2">4.96 / 5.0 Star Overall Rating</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-emerald-950 font-serif">
                Verified Owner Reviews
              </h3>
            </div>

            <div className="flex items-center space-x-3 mt-4 sm:mt-0">
              <span className="text-xs font-extrabold text-emerald-900 bg-emerald-100 px-3 py-1.5 rounded-full border border-emerald-200 mr-2">
                Review {activeReviewIdx + 1} of {REVIEWS.length}
              </span>
              <button
                onClick={handlePrevReview}
                className="p-3 rounded-full bg-white border border-gray-200 text-emerald-950 hover:bg-emerald-800 hover:text-white transition shadow-xs cursor-pointer"
                title="Previous Review"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNextReview}
                className="p-3 rounded-full bg-white border border-gray-200 text-emerald-950 hover:bg-emerald-800 hover:text-white transition shadow-xs cursor-pointer"
                title="Next Review"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Active Review Slide */}
          <div
            key={activeReviewIdx}
            className="bg-white rounded-2xl p-6 sm:p-10 border border-emerald-900/10 shadow-sm relative min-h-[220px] flex flex-col justify-between transition-all duration-500 animate-fadeIn"
          >
            <Quote className="w-12 h-12 text-amber-300/40 absolute top-6 right-6 pointer-events-none" />

            <p className="text-gray-800 text-base sm:text-lg italic leading-relaxed mb-6 font-serif">
              "{REVIEWS[activeReviewIdx].comment}"
            </p>

            <div className="flex items-center justify-between border-t border-gray-100 pt-4">
              <div className="flex items-center space-x-4">
                <img
                  src={REVIEWS[activeReviewIdx].avatar}
                  alt={REVIEWS[activeReviewIdx].name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-emerald-800/20 shadow-xs"
                />
                <div>
                  <h4 className="text-sm font-extrabold text-emerald-950 font-serif">
                    {REVIEWS[activeReviewIdx].name}
                  </h4>
                  <p className="text-xs text-gray-500 font-medium">{REVIEWS[activeReviewIdx].role} • {REVIEWS[activeReviewIdx].location}</p>
                </div>
              </div>

              <div className="text-right hidden sm:block">
                <span className="text-xs text-gray-400 block font-medium">Purchased Chair</span>
                <span className="text-xs font-extrabold text-emerald-800">{REVIEWS[activeReviewIdx].productName}</span>
              </div>
            </div>
          </div>

          {/* Review Indicator Dots */}
          <div className="flex justify-center items-center space-x-2 mt-6">
            {REVIEWS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveReviewIdx(idx)}
                className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  activeReviewIdx === idx ? 'w-8 bg-emerald-800' : 'w-2.5 bg-gray-300 hover:bg-gray-400'
                }`}
                title={`Go to review ${idx + 1}`}
              />
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
