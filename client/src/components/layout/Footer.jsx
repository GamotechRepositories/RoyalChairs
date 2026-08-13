import { Crown, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-emerald-900 text-emerald-100 pt-16 pb-8 border-t border-emerald-800">
      <div className="w-full max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8">
        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-emerald-800/80">
          
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
            <div title="Visa" className="hover:scale-105 transition shadow-xs rounded overflow-hidden">
              <svg className="h-7 w-auto" viewBox="0 0 50 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="50" height="32" rx="4" fill="#FFFFFF"/>
                <path d="M19.6 22H16.6L18.5 10H21.5L19.6 22ZM30.1 10.3C29.4 10 28.4 9.7 27.2 9.7C24.3 9.7 22.3 11.2 22.3 13.3C22.3 14.9 23.7 15.8 24.8 16.4C25.9 17 26.3 17.4 26.3 18C26.3 18.9 25.3 19.3 24.3 19.3C22.9 19.3 21.7 18.9 20.8 18.4L20.4 20.4C21.4 20.9 22.9 21.3 24.4 21.3C27.5 21.3 29.5 19.8 29.5 17.6C29.5 15.5 27.8 14.5 26.5 13.9C25.5 13.4 25.1 13.1 25.1 12.5C25.1 11.9 25.8 11.4 27.0 11.4C28.0 11.4 29.0 11.7 29.6 12L30.1 10.3ZM36.5 10H34.2C33.5 10 32.9 10.2 32.6 10.9L27.8 22H30.9L31.5 20.3H35.3L35.7 22H38.5L36.5 10ZM32.4 17.9L34.0 13.4L34.9 17.9H32.4ZM15.8 10L12.8 18.2L12.4 16.3C11.8 14.4 10.2 12 8.2 11L11.1 22H14.2L18.9 10H15.8Z" fill="#1434CB"/>
              </svg>
            </div>

            {/* Mastercard */}
            <div title="Mastercard" className="hover:scale-105 transition shadow-xs rounded overflow-hidden">
              <svg className="h-7 w-auto" viewBox="0 0 50 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="50" height="32" rx="4" fill="#141824"/>
                <circle cx="19" cy="16" r="9" fill="#EB001B"/>
                <circle cx="31" cy="16" r="9" fill="#F79E1B"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M25 9.646C27.07 11.31 28.4 13.5 28.4 16C28.4 18.5 27.07 20.69 25 22.354C22.93 20.69 21.6 18.5 21.6 16C21.6 13.5 22.93 11.31 25 9.646Z" fill="#FF5F00"/>
              </svg>
            </div>

            {/* Amex */}
            <div title="American Express" className="hover:scale-105 transition shadow-xs rounded overflow-hidden">
              <svg className="h-7 w-auto" viewBox="0 0 50 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="50" height="32" rx="4" fill="#006FCF"/>
                <path d="M7 21L9.2 15L11.4 21H14.5L10.8 11H7.6L3.9 21H7ZM15.5 11H22.5V13.5H18.2V14.8H22V17.2H18.2V18.5H22.5V21H15.5V11ZM24 11L26.2 15.5L28.4 11H31.5V21H29.2V14.2L27 18.6H25.4L23.2 14.2V21H21V11H24ZM33 11H40V13.5H35.7V14.8H39.2V17.2H35.7V18.5H40V21H33V11Z" fill="#FFFFFF"/>
              </svg>
            </div>

            {/* Apple Pay */}
            <div title="Apple Pay" className="hover:scale-105 transition shadow-xs rounded overflow-hidden">
              <svg className="h-7 w-auto" viewBox="0 0 50 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="50" height="32" rx="4" fill="#000000"/>
                <path d="M16.2 15.1C16.2 13.6 17.4 12.6 18.9 12.5C18.9 12.6 18.5 14.0 17.5 15.1C16.6 16.2 15.4 16.3 15.4 16.3C15.3 16.3 16.2 15.3 16.2 15.1ZM18.9 16.5C18.0 16.5 16.7 15.9 15.8 15.9C14.7 15.9 13.5 16.5 12.9 17.5C11.6 19.7 12.5 23.0 13.8 24.9C14.4 25.8 15.1 26.7 16.1 26.7C17.0 26.7 17.4 26.1 18.5 26.1C19.6 26.1 19.9 26.7 20.9 26.7C21.9 26.7 22.5 25.8 23.1 24.9C23.9 23.7 24.2 22.6 24.2 22.5C24.2 22.5 22.4 21.8 22.4 19.6C22.4 17.8 23.8 16.9 23.9 16.8C23.0 15.5 21.6 15.3 21.1 15.3C19.9 15.2 19.0 16.5 18.9 16.5Z" fill="#FFFFFF"/>
                <path d="M27.5 16.3V26.5H29.7V22.2H32.4C34.7 22.2 36.3 20.7 36.3 18.6C36.3 16.5 34.7 15.1 32.4 15.1H27.5V16.3ZM29.7 20.4V16.9H32.3C33.7 16.9 34.5 17.6 34.5 18.6C34.5 19.7 33.7 20.4 32.3 20.4H29.7Z" fill="#FFFFFF"/>
              </svg>
            </div>

            {/* Google Pay */}
            <div title="Google Pay" className="hover:scale-105 transition shadow-xs rounded overflow-hidden">
              <svg className="h-7 w-auto" viewBox="0 0 50 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="50" height="32" rx="4" fill="#FFFFFF"/>
                <path d="M17.5 16.4C17.5 15.7 17.4 15.0 17.3 14.3H10.5V17.1H14.4C14.2 18.3 13.5 19.3 12.3 20.0V22.4H14.7C16.1 21.2 17.5 19.0 17.5 16.4Z" fill="#4285F4"/>
                <path d="M10.5 23.5C12.5 23.5 14.2 22.8 15.4 21.7L13.0 19.8C12.3 20.3 11.5 20.7 10.5 20.7C8.5 20.7 6.8 19.4 6.2 17.6H3.8V20.1C5.0 22.2 7.5 23.5 10.5 23.5Z" fill="#34A853"/>
                <path d="M6.2 17.6C6.0 17.0 5.9 16.4 5.9 15.7C5.9 15.0 6.0 14.4 6.2 13.8V11.3H3.8C3.3 12.6 3.0 14.1 3.0 15.7C3.0 17.3 3.3 18.8 3.8 20.1L6.2 17.6Z" fill="#FBBC05"/>
                <path d="M10.5 10.7C11.6 10.7 12.6 11.1 13.4 11.8L15.5 9.7C14.2 8.5 12.5 7.9 10.5 7.9C7.5 7.9 5.0 9.2 3.8 11.3L6.2 13.8C6.8 12.0 8.5 10.7 10.5 10.7Z" fill="#EA4335"/>
                <path d="M22.5 12.2V23.5H24.8V19.4H27.5C30.0 19.4 31.8 17.8 31.8 15.8C31.8 13.8 30.0 12.2 27.5 12.2H22.5ZM24.8 17.3V14.3H27.4C28.8 14.3 29.6 15.0 29.6 15.8C29.6 16.6 28.8 17.3 27.4 17.3H24.8Z" fill="#3C4043"/>
                <path d="M34.5 18.8C34.5 17.3 35.6 16.2 37.0 16.2C38.4 16.2 39.5 17.3 39.5 18.8C39.5 20.3 38.4 21.4 37.0 21.4C35.6 21.4 34.5 20.3 34.5 18.8ZM37.0 19.8C37.8 19.8 38.4 19.2 38.4 18.8C38.4 18.4 37.8 17.8 37.0 17.8C36.2 17.8 35.6 18.4 35.6 18.8C35.6 19.2 36.2 19.8 37.0 19.8Z" fill="#3C4043"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
