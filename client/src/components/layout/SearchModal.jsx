import { useState, useId } from 'react';
import { Search, X, ShoppingBag, Star, ArrowRight } from 'lucide-react';
import { PRODUCTS } from '../../data/chairProductsData';
import { useCart } from '../../context/CartContext';

export default function SearchModal({ isOpen, onClose, onQuickView }) {
  const [query, setQuery] = useState('');
  const searchInputId = useId();
  const { addToCart } = useCart();

  if (!isOpen) return null;

  const filteredProducts = query.trim() === ''
    ? PRODUCTS.slice(0, 3)
    : PRODUCTS.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase())
      );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-black/60 backdrop-blur-xs transition-opacity animate-fadeIn">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-emerald-900/10">
        {/* Search Input Bar */}
        <div className="relative p-4 border-b border-gray-100 flex items-center bg-cream-soft">
          <label htmlFor={searchInputId} className="sr-only">Search Chairs</label>
          <Search className="w-5 h-5 text-emerald-800 ml-2 mr-3" />
          <input
            id={searchInputId}
            type="text"
            placeholder="Search luxury chairs, leather, ergonomic, velvet lounge..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-gray-900 placeholder-gray-400 font-medium focus:outline-hidden text-base"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-gray-400 hover:text-gray-600 mr-2 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="ml-2 px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-semibold rounded-lg transition"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-4 divide-y divide-gray-100">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-900 mb-3 px-2 flex justify-between">
            <span>{query ? `Search Results (${filteredProducts.length})` : 'Popular Recommendations'}</span>
            <span className="text-amber-600">Pure English Luxury</span>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              <p className="text-base font-medium">No chairs matching "{query}"</p>
              <p className="text-xs text-gray-400 mt-1">Try searching "Ergonomic", "Velvet", or "Executive"</p>
            </div>
          ) : (
            filteredProducts.map((product) => (
              <div
                key={product.id}
                className="py-3 px-2 flex items-center justify-between hover:bg-emerald-50/50 rounded-xl transition group"
              >
                <div className="flex items-center space-x-4 cursor-pointer" onClick={() => { onQuickView(product); onClose(); }}>
                  <img
                    src={product.mainImage}
                    alt={product.name}
                    className="w-14 h-14 object-cover rounded-lg border border-gray-100 shadow-xs group-hover:scale-105 transition"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 group-hover:text-emerald-900 transition">
                      {product.name}
                    </h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs font-bold text-emerald-900">${product.price}</span>
                      {product.originalPrice > product.price && (
                        <span className="text-xs text-gray-400 line-through">${product.originalPrice}</span>
                      )}
                      <div className="flex items-center text-amber-500 text-xs ml-2">
                        <Star className="w-3.5 h-3.5 fill-current mr-0.5" />
                        <span>{product.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      addToCart(product);
                    }}
                    className="p-2 rounded-lg bg-emerald-900 hover:bg-emerald-800 text-white transition flex items-center text-xs font-semibold"
                    title="Add to Cart"
                  >
                    <ShoppingBag className="w-4 h-4 mr-1" />
                    <span>Buy</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-emerald-950 text-white p-3 px-5 text-xs flex justify-between items-center">
          <span className="text-emerald-200">Free White-Glove Shipping on all orders</span>
          <a href="#shop-by-category" onClick={onClose} className="text-amber-300 hover:underline flex items-center font-medium">
            Browse All Categories <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </a>
        </div>
      </div>
    </div>
  );
}
