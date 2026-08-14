import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, Shield, Award, Sparkles } from 'lucide-react';
import { HERO_SLIDES } from '../../data/chairProductsData';

export default function BannerSlideshow() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [isPaused]);

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  return (
    <section
      className="relative w-full overflow-hidden bg-cream-soft"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* 100% Full Width Hero Banner Box */}
      <div className="relative w-full min-h-[280px] sm:min-h-[400px] lg:min-h-[600px] flex items-center bg-white border-b border-emerald-900/10">

        {HERO_SLIDES.map((slide, idx) => {
          const isActive = idx === currentSlide;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out flex flex-row items-stretch ${isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'}`}
            >
              {/* Text Overlay Container — always half width */}
              <div className="w-1/2 p-3 sm:p-8 lg:p-16 flex flex-col justify-center items-start z-10 overflow-hidden">
                <div className="inline-flex items-center space-x-1 sm:space-x-2 bg-amber-100 border border-amber-300/60 text-emerald-950 text-[9px] sm:text-xs font-extrabold px-2 sm:px-3.5 py-1 sm:py-1.5 rounded-full mb-2 sm:mb-4 shadow-xs">
                  <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-600 flex-shrink-0" />
                  <span className="truncate">{slide.badge}</span>
                </div>

                <h1 className="text-sm sm:text-2xl md:text-3xl lg:text-5xl xl:text-6xl font-black text-emerald-950 leading-tight font-serif tracking-tight">
                  {slide.title}
                </h1>

                <h2 className="hidden sm:block text-xs sm:text-sm lg:text-xl font-bold text-emerald-800 mt-1 sm:mt-2 font-sans">
                  {slide.subtitle}
                </h2>

                <p className="hidden md:block text-gray-600 text-xs sm:text-sm lg:text-base mt-2 sm:mt-4 max-w-xl leading-relaxed">
                  {slide.description}
                </p>

                {/* Feature Callouts */}
                <div className="hidden sm:flex flex-wrap items-center gap-2 sm:gap-4 mt-3 sm:mt-6 text-[10px] sm:text-xs font-bold text-emerald-900">
                  <div className="flex items-center space-x-1 sm:space-x-1.5 bg-emerald-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-emerald-200">
                    <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-700 flex-shrink-0" />
                    <span>{slide.tag}</span>
                  </div>
                  <div className="hidden md:flex items-center space-x-1.5 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                    <Award className="w-4 h-4 text-emerald-700" />
                    <span>Handcrafted in UK</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-3 sm:mt-6 lg:mt-8 flex flex-wrap gap-2 sm:gap-4 items-center">
                  <a
                    href={slide.ctaLink}
                    className="px-3 sm:px-6 lg:px-7 py-2 sm:py-3 lg:py-3.5 bg-emerald-800 hover:bg-emerald-700 text-white font-extrabold rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition flex items-center space-x-1 sm:space-x-2 text-[10px] sm:text-sm tracking-wide"
                  >
                    <span>{slide.ctaText}</span>
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                  </a>

                  <a
                    href="#special-offers"
                    className="hidden sm:inline-flex px-4 sm:px-6 py-2 sm:py-3.5 bg-amber-100 hover:bg-amber-200 text-emerald-950 font-bold rounded-xl transition text-xs sm:text-sm border border-amber-300/50"
                  >
                    {slide.secondaryCta}
                  </a>
                </div>
              </div>

              {/* Full Width High-Res Hero Image Container — always half width */}
              <div className="w-1/2 h-full relative overflow-hidden bg-emerald-950 flex-1 min-h-[280px] sm:min-h-[400px] lg:min-h-[600px]">
                <img
                  src={slide.image}
                  alt={slide.title}
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1600&q=85';
                  }}
                  className="w-full h-full object-cover object-center transform hover:scale-105 transition duration-1000"
                  loading="eager"
                />
                {/* Smooth left gradient blend */}
                <div className="absolute inset-0 bg-gradient-to-r from-white via-white/10 to-transparent w-1/4 pointer-events-none" />
              </div>
            </div>
          );
        })}

        {/* Navigation Arrow Controls — visible on all sizes */}
        <button
          onClick={handlePrev}
          className="absolute left-[48%] sm:left-1/2 -translate-x-10 sm:-translate-x-8 lg:left-4 lg:translate-x-0 top-auto bottom-3 sm:bottom-4 lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2 z-20 p-1.5 sm:p-2 lg:p-3 rounded-full bg-white/80 hover:bg-white text-emerald-950 shadow-md backdrop-blur-xs transition border border-gray-200 flex items-center justify-center cursor-pointer"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-4 h-4 lg:w-5 lg:h-5" />
        </button>

        <button
          onClick={handleNext}
          className="absolute left-[48%] sm:left-1/2 translate-x-1 sm:translate-x-2 lg:right-4 lg:left-auto lg:translate-x-0 top-auto bottom-3 sm:bottom-4 lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2 z-20 p-1.5 sm:p-2 lg:p-3 rounded-full bg-white/80 hover:bg-white text-emerald-950 shadow-md backdrop-blur-xs transition border border-gray-200 flex items-center justify-center cursor-pointer"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-4 h-4 lg:w-5 lg:h-5" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2 bg-white/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-gray-200">
          {HERO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2.5 rounded-full transition-all duration-300 ${currentSlide === idx ? 'w-8 bg-emerald-800' : 'w-2.5 bg-gray-300 hover:bg-gray-400'
                }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
