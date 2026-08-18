import { Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-emerald-900 text-emerald-100 pt-16 pb-8 border-t border-emerald-800">
      <div className="w-full max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8">
        {/* Main Footer Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 pb-12 border-b border-emerald-800/80">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <a href="#" className="inline-block" title="Royal Chairs Home">
              <img
                src="/logo.svg"
                alt="Royal Chairs and Sofa Maker Pune"
                className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-full shadow-md border-2 border-amber-300/80 bg-white"
              />
            </a>

            <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed">
              Engineered luxury seating co-developed with British spine orthopedists. Handcrafted using sustainable English oak, Italian top-grain leathers, and rich plush velvets.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-amber-300 mb-4">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs font-medium text-emerald-100">
              <li><a href="#" className="hover:text-white transition">Home Dashboard</a></li>
              <li><a href="#shop-by-category" className="hover:text-white transition">Shop Categories</a></li>
              <li><a href="#best-sellers" className="hover:text-white transition">Best Seller Chairs</a></li>
              <li><a href="#new-collection" className="hover:text-white transition">2026 New Collection</a></li>
              <li><a href="#special-offers" className="hover:text-white font-bold text-amber-300 transition">Offers (Up to 50% OFF)</a></li>
              <li><a href="#why-choose-us" className="hover:text-white transition">Why Choose Us</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-amber-300 mb-4">
              Chair Ranges
            </h4>
            <ul className="space-y-2 text-xs font-medium text-emerald-100">
              <li><a href="#shop-by-category" className="hover:text-white transition">Wooden Chairs</a></li>
              <li><a href="#shop-by-category" className="hover:text-white transition">Ergonomic Task Chairs</a></li>
              <li><a href="#shop-by-category" className="hover:text-white transition">Plastic & Molded</a></li>
              <li><a href="#shop-by-category" className="hover:text-white transition">Pro Gaming Thrones</a></li>
              <li><a href="#shop-by-category" className="hover:text-white transition">Velvet & Loungers</a></li>
              <li><a href="#shop-by-category" className="hover:text-white transition">Executive Leather</a></li>
            </ul>
          </div>

          {/* Contact Details (Right side of footer) */}
          <div>
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-amber-300 mb-4">
              Contact Us
            </h4>
            <div className="space-y-3 text-xs text-emerald-100">
              <div className="flex items-start space-x-2.5">
                <Phone className="w-4 h-4 text-amber-300 flex-shrink-0 mt-0.5" />
                <span>Concierge Support: +44 (0) 800 917 2026</span>
              </div>
              <div className="flex items-start space-x-2.5">
                <Mail className="w-4 h-4 text-amber-300 flex-shrink-0 mt-0.5" />
                <span>concierge@royalchairs.co.uk</span>
              </div>
              <div className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-amber-300 flex-shrink-0 mt-0.5" />
                <span>Flagship Showroom: 42 Mayfair Square, London W1K</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright, Legal Links & Payment Logos */}
        <div className="pt-8 flex flex-col lg:flex-row items-center justify-between text-xs text-emerald-200/80 gap-4 text-center lg:text-left">
          {/* Copyright Info */}
          <div className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-3">
            <span>© 2026 RoyalChairs &amp; Sofa Maker Ltd. All rights reserved.</span>
            <span className="hidden sm:inline text-emerald-700">•</span>
            <span className="text-amber-300/90 font-medium">Handcrafted Luxury Seating • Pune</span>
          </div>

          {/* Legal & Policy Quick Links */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[11px] font-medium text-emerald-200/90">
            <a href="#" className="hover:text-amber-300 transition">Privacy Policy</a>
            <span className="text-emerald-700">•</span>
            <a href="#" className="hover:text-amber-300 transition">Terms of Service</a>
            <span className="text-emerald-700">•</span>
            <a href="#" className="hover:text-amber-300 transition">Shipping &amp; Delivery</a>
            <span className="text-emerald-700">•</span>
            <a href="#" className="hover:text-amber-300 transition">Return &amp; Warranty Policy</a>
            <span className="text-emerald-700">•</span>
            <a href="#" className="hover:text-amber-300 transition">Cookie Settings</a>
          </div>

          {/* Payment Method Logos */}
          <div className="flex items-center space-x-2.5 flex-shrink-0">
            {/* Visa */}
            <div title="Visa" className="hover:scale-105 transition-transform shadow-xs rounded overflow-hidden flex-shrink-0">
              <svg className="h-7 w-11" viewBox="0 0 50 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="50" height="32" rx="4" fill="#FFFFFF"/>
                <path d="M20.2 21.5H17.4L19.2 10.5H22.0L20.2 21.5ZM30.8 10.7C30.2 10.4 29.1 10.1 27.9 10.1C25.0 10.1 23.0 11.6 23.0 13.8C23.0 15.4 24.4 16.3 25.5 16.9C26.6 17.5 27.0 17.9 27.0 18.5C27.0 19.4 26.0 19.8 25.0 19.8C23.5 19.8 22.4 19.4 21.5 18.9L21.1 20.9C22.1 21.4 23.6 21.8 25.1 21.8C28.2 21.8 30.2 20.3 30.2 18.1C30.2 16.0 28.5 15.0 27.2 14.4C26.2 13.9 25.8 13.6 25.8 13.0C25.8 12.4 26.5 11.9 27.7 11.9C28.7 11.9 29.6 12.2 30.2 12.5L30.8 10.7ZM37.2 10.5H34.9C34.2 10.5 33.6 10.7 33.3 11.4L28.5 21.5H31.6L32.2 19.8H36.0L36.4 21.5H39.2L37.2 10.5ZM33.1 17.4L34.7 12.9L35.6 17.4H33.1ZM16.4 10.5L13.4 18.7L13.0 16.8C12.4 14.9 10.8 12.5 8.8 11.5L11.7 21.5H14.8L19.5 10.5H16.4Z" fill="#1434CB"/>
                <path d="M11.4 10.5H6.5L6.3 10.7C10.2 11.7 13.4 14.1 14.4 16.8L13.6 10.5H11.4Z" fill="#F7B600"/>
              </svg>
            </div>

            {/* Mastercard */}
            <div title="Mastercard" className="hover:scale-105 transition-transform shadow-xs rounded overflow-hidden flex-shrink-0">
              <svg className="h-7 w-11" viewBox="0 0 50 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="50" height="32" rx="4" fill="#141824"/>
                <circle cx="19" cy="16" r="9" fill="#EB001B"/>
                <circle cx="31" cy="16" r="9" fill="#F79E1B"/>
                <path d="M25 9.65C27.07 11.31 28.4 13.5 28.4 16C28.4 18.5 27.07 20.69 25 22.35C22.93 20.69 21.6 18.5 21.6 16C21.6 13.5 22.93 11.31 25 9.65Z" fill="#FF5F00"/>
              </svg>
            </div>

            {/* American Express */}
            <div title="American Express" className="hover:scale-105 transition-transform shadow-xs rounded overflow-hidden flex-shrink-0">
              <svg className="h-7 w-11" viewBox="0 0 50 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="50" height="32" rx="4" fill="#006FCF"/>
                <path d="M8 20.5L10.2 11.5H13.2L15.4 20.5H13L12.4 18H10.8L10.2 20.5H8ZM11.2 16.2H12.1L11.6 13.8L11.2 16.2Z" fill="#FFFFFF"/>
                <path d="M16 11.5H18.8L20.4 16.3L22 11.5H24.8V20.5H22.7V14.8L21.1 19.2H19.7L18.1 14.8V20.5H16V11.5Z" fill="#FFFFFF"/>
                <path d="M26 11.5H31.5V13.5H28.3V15H31.2V16.8H28.3V18.5H31.5V20.5H26V11.5Z" fill="#FFFFFF"/>
                <path d="M32.8 11.5H35.2L37.1 14.8L39 11.5H41.4L38.4 16L41.6 20.5H39.2L37.1 17.2L35 20.5H32.6L35.8 16L32.8 11.5Z" fill="#FFFFFF"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
