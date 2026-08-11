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
      <div className="relative w-full min-h-[480px] sm:min-h-[540px] lg:min-h-[600px] flex items-center bg-white border-b border-emerald-900/10">
        
        {HERO_SLIDES.map((slide, idx) => {
          const isActive = idx === currentSlide;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out flex flex-col lg:flex-row items-center ${
                isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {/* Text Overlay Container */}
              <div className="w-full lg:w-1/2 p-6 sm:p-12 lg:p-20 flex flex-col justify-center items-start z-10 max-w-3xl">
                <div className="inline-flex items-center space-x-2 bg-amber-100 border border-amber-300/60 text-emerald-950 text-xs font-extrabold px-3.5 py-1.5 rounded-full mb-4 shadow-xs">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>{slide.badge}</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black text-emerald-950 leading-tight font-serif tracking-tight">
                  {slide.title}
                </h1>

                <h2 className="text-base sm:text-xl font-bold text-emerald-800 mt-2 font-sans">
                  {slide.subtitle}
                </h2>

                <p className="text-gray-600 text-sm sm:text-base mt-3 sm:mt-4 max-w-xl leading-relaxed">
                  {slide.description}
                </p>

                {/* Feature Callouts */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-6 text-xs font-bold text-emerald-900">
                  <div className="flex items-center space-x-1.5 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                    <Shield className="w-4 h-4 text-emerald-700" />
                    <span>{slide.tag}</span>
                  </div>
                  <div className="flex items-center space-x-1.5 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                    <Award className="w-4 h-4 text-emerald-700" />
                    <span>Handcrafted in UK</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 flex flex-wrap gap-4 items-center">
                  <a
                    href={slide.ctaLink}
                    className="px-7 py-3.5 bg-emerald-800 hover:bg-emerald-700 text-white font-extrabold rounded-xl shadow-lg hover:shadow-xl transition flex items-center space-x-2 text-sm tracking-wide"
                  >
                    <span>{slide.ctaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>

                  <a
                    href="#special-offers"
                    className="px-6 py-3.5 bg-amber-100 hover:bg-amber-200 text-emerald-950 font-bold rounded-xl transition text-sm border border-amber-300/50"
                  >
                    {slide.secondaryCta}
                  </a>
                </div>
              </div>

              {/* Full Width High-Res Hero Image */}
              <div className="w-full lg:w-1/2 h-64 sm:h-80 lg:h-full relative overflow-hidden">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover object-center transform hover:scale-105 transition duration-1000"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-white via-white/40 to-transparent pointer-events-none" />
              </div>
            </div>
          );
        })}

        {/* Navigation Arrow Controls */}
        <button
          onClick={handlePrev}
          className="absolute left-4 sm:left-6 z-20 p-3 rounded-full bg-white/80 hover:bg-white text-emerald-950 shadow-md backdrop-blur-xs transition border border-gray-200"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-4 sm:right-6 z-20 p-3 rounded-full bg-white/80 hover:bg-white text-emerald-950 shadow-md backdrop-blur-xs transition border border-gray-200"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2 bg-white/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-gray-200">
          {HERO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                currentSlide === idx ? 'w-8 bg-emerald-800' : 'w-2.5 bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
