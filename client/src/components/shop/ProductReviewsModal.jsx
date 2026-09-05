import { useEffect, useMemo } from 'react';
import {
  X,
  Star,
  CheckCircle2,
  MessageSquare,
  ShieldCheck,
  User,
  Sparkles,
} from 'lucide-react';

export default function ProductReviewsModal({
  isOpen,
  onClose,
  product,
  reviews = [],
  avgRating = '5.0',
}) {
  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Star breakdown calculation
  const breakdown = useMemo(() => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      const star = Math.max(1, Math.min(5, Math.round(Number(r.rating) || 5)));
      counts[star] = (counts[star] || 0) + 1;
    });
    const total = reviews.length || 1;
    return [5, 4, 3, 2, 1].map((star) => ({
      star,
      count: counts[star] || 0,
      percentage: Math.round(((counts[star] || 0) / total) * 100),
    }));
  }, [reviews]);

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col z-10">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-emerald-900 to-emerald-950 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10">
              <MessageSquare className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2 text-[11px] font-black uppercase tracking-wider text-amber-300">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>VERIFIED REVIEWS</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black font-serif truncate max-w-md">
                {product.name}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 flex-1">
          {/* Summary & Star Distribution Banner */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 flex flex-col sm:flex-row items-center gap-6">
            {/* Average Score */}
            <div className="text-center sm:text-left shrink-0">
              <div className="flex items-baseline justify-center sm:justify-start space-x-1">
                <span className="text-4xl sm:text-5xl font-black text-slate-900 font-serif">
                  {avgRating}
                </span>
                <span className="text-sm font-bold text-slate-400">/ 5</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start text-amber-500 my-1.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.round(Number(avgRating))
                        ? 'fill-current text-amber-500'
                        : 'text-slate-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs font-black text-slate-600">
                Based on {reviews.length} verified {reviews.length === 1 ? 'review' : 'reviews'}
              </p>
            </div>

            <div className="hidden sm:block w-px h-20 bg-slate-200" />

            {/* Breakdown Bars */}
            <div className="flex-1 w-full space-y-1.5">
              {breakdown.map(({ star, count, percentage }) => (
                <div key={star} className="flex items-center text-xs space-x-2">
                  <span className="w-12 font-black text-slate-700 flex items-center space-x-1">
                    <span>{star}</span>
                    <Star className="w-3 h-3 fill-current text-amber-500" />
                  </span>
                  <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-slate-400 font-semibold text-[11px]">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Verified Purchaser Notice */}
          <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex items-center space-x-2.5 text-xs text-emerald-950 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>
              <strong>Verified Reviews Only:</strong> Only verified customers who purchased this item can leave reviews via their Order History in My Account.
            </span>
          </div>

          {/* Reviews List */}
          <div className="space-y-4">
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider">
              Customer Experiences ({reviews.length})
            </h4>

            {reviews.length === 0 ? (
              <div className="p-8 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-2">
                <MessageSquare className="w-10 h-10 text-slate-300 mx-auto" />
                <h5 className="text-sm font-black text-slate-800">
                  No Reviews Yet for this Product
                </h5>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Be the first to review after purchasing! Customers with confirmed orders can review this product from their Member Account.
                </p>
              </div>
            ) : (
              <div className="space-y-3 divide-y divide-slate-100">
                {reviews.map((rev, index) => (
                  <div key={rev.id || rev._id || index} className="pt-4 first:pt-0 space-y-2.5">
                    {/* User info & Stars */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 font-black text-xs flex items-center justify-center border border-emerald-200 shrink-0">
                          {(rev.userName || rev.name || 'U')[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs sm:text-sm font-black text-slate-900">
                              {rev.userName || rev.name || 'Verified Client'}
                            </span>
                            <span className="inline-flex items-center text-[10px] font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              <CheckCircle2 className="w-2.5 h-2.5 mr-1 text-emerald-600" />
                              Verified Purchase
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400">
                            {rev.userRole || rev.role || 'Verified Buyer'} {rev.location ? `• ${rev.location}` : ''}
                          </p>
                        </div>
                      </div>

                      {/* Stars */}
                      <div className="flex items-center text-amber-500 shrink-0">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < (Number(rev.rating) || 5)
                                ? 'fill-current text-amber-500'
                                : 'text-slate-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Review Comment Text */}
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/80 font-sans">
                      "{rev.comment}"
                    </p>

                    {/* Selected Finish Tag */}
                    {rev.finish && (
                      <div className="text-[11px] text-slate-500 flex items-center space-x-1 pt-0.5">
                        <span className="font-semibold">Selected Finish:</span>
                        <span className="font-black text-emerald-900">{rev.finish}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Showing all {reviews.length} authentic reviews
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-xl transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
