import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const STATIC_GALLERY_IMAGES = [
  {
    id: 1,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzRaGtqJJm-ef94DYRAIj0WF2lBaM7yIJZpp-WKKx0OQ&s=10',
    alt: 'Royal Chairs Showcase 1'
  },
  {
    id: 2,
    image: 'https://m.media-amazon.com/images/I/81OG2t9Y9jL._AC_UF350,350_QL80_.jpg',
    alt: 'Royal Chairs Showcase 2'
  },
  {
    id: 3,
    image: 'https://m.media-amazon.com/images/I/71gXgk3mmIL._AC_UF894,1000_QL80_.jpg',
    alt: 'Royal Chairs Showcase 3'
  },
  {
    id: 4,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQw_0CP-5yF9Sbrneb7GeBiBUzDtA8q9EuMj-hE2rcHQw&s=10',
    alt: 'Royal Chairs Showcase 4'
  },
  {
    id: 5,
    image: 'https://m.media-amazon.com/images/I/71gXgk3mmIL._AC_UF894,1000_QL80_.jpg',
    alt: 'Royal Chairs Showcase 5'
  },
  {
    id: 6,
    image: 'https://m.media-amazon.com/images/I/61ovSWklH0L._AC_UF894,1000_QL80_.jpg',
    alt: 'Royal Chairs Showcase 6'
  },
  {
    id: 7,
    image: 'https://media.istockphoto.com/id/2219842558/photo/good-book-and-cozy-armchair-relaxed-attractive-young-woman-with-long-brown-hair-reading-book.jpg?s=612x612&w=0&k=20&c=z9MzipNGqpMTgosJYCzNC7RnY86PFiZoX-S-85PtDHQ=',
    alt: 'Royal Chairs Showcase 7'
  },
  {
    id: 8,
    image: 'https://m.media-amazon.com/images/I/51xXPuoDkKL.jpg',
    alt: 'Royal Chairs Showcase 8'
  },
  {
    id: 9,
    image: 'https://drogo.in/cdn/shop/files/DGC401_-_grey_1.jpg?v=1771571755&width=1500',
    alt: 'Royal Chairs Showcase 9'
  },
  {
    id: 10,
    image: 'https://officetalks.co.in/uploads/69c3da4f57a7d_volt-x-gaming-chair-blaze-red-person-reclined-footrest-gaming-room.jpg',
    alt: 'Royal Chairs Showcase 10'
  },
];

export default function LifestyleGallery() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const scrollContainerRef = useRef(null);

  const total = STATIC_GALLERY_IMAGES.length;

  // Auto-slide every 2 seconds
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % total);
    }, 2000);

    return () => clearInterval(timer);
  }, [isPaused, total]);

  // Smooth scroll sync
  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const card = container.firstElementChild;
      if (card) {
        const cardWidth = card.offsetWidth;
        const gap = 16;
        container.scrollTo({
          left: currentIndex * (cardWidth + gap),
          behavior: 'smooth',
        });
      }
    }
  }, [currentIndex]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  return (
    <section className="py-12 bg-white overflow-hidden border-b border-slate-100">
      <div className="w-full max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-serif">
            Moments of Comfort
          </h2>
        </div>

        {/* Carousel Wrapper */}
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="relative group"
        >
          {/* Navigation Arrows */}
          <button
            onClick={handlePrev}
            aria-label="Previous"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 text-slate-800 shadow-lg border border-slate-200/80 flex items-center justify-center hover:bg-black hover:text-white transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            aria-label="Next"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 text-slate-800 shadow-lg border border-slate-200/80 flex items-center justify-center hover:bg-black hover:text-white transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Scrolling Container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto scrollbar-none scroll-smooth pb-2 pt-1 snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {STATIC_GALLERY_IMAGES.map((item, idx) => {
              return (
                <div
                  key={item.id}
                  onClick={() => setCurrentIndex(idx)}
                  className="flex-none w-[200px] sm:w-[240px] md:w-[270px] lg:w-[290px] snap-start rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer"
                >
                  {/* Pure plain square image with no text overlay */}
                  <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
                    <img
                      src={item.image}
                      alt={item.alt}
                      loading="lazy"
                      onError={(e) => {
                        e.target.src =
                          'https://images.unsplash.com/photo-1580481072645-022f9a6d8310?auto=format&fit=crop&w=800&q=85';
                      }}
                      className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-500 ease-out"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
