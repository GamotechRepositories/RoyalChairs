import { useState } from 'react';
import { Star, Check, Trash2, Crown, Sparkles, AlertCircle } from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';

export default function ReviewsManager() {
  const { reviews, moderateReview, deleteReview } = useAdminData();

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header Bar */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <h2 className="text-2xl font-bold text-slate-900 font-serif">Client Reviews & Testimonials</h2>
            <span className="bg-emerald-50 text-emerald-800 text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
              {reviews.length} Total
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Moderate verified buyer ratings, approve testimonials, and feature reviews on the storefront
          </p>
        </div>
      </div>

      {/* Reviews List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="flex text-amber-500">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-slate-900">{rev.rating}.0</span>
                </div>

                <div className="flex items-center space-x-2">
                  <span
                    className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                      rev.status === 'Approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {rev.status}
                  </span>

                  {rev.featured && (
                    <span className="text-[10px] bg-amber-50 text-amber-800 font-extrabold px-2.5 py-0.5 rounded-full border border-amber-200 flex items-center space-x-1">
                      <Crown className="w-3 h-3 text-amber-600" />
                      <span>Featured</span>
                    </span>
                  )}
                </div>
              </div>

              <div>
                <p className="text-sm font-bold text-slate-900">{rev.product}</p>
                <p className="text-xs text-slate-500">Reviewed by {rev.customer} • {rev.date}</p>
              </div>

              <p className="text-xs text-slate-700 italic leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                "{rev.comment}"
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                onClick={() => moderateReview(rev.id, rev.status, !rev.featured)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
                  rev.featured
                    ? 'bg-amber-50 text-amber-800 border border-amber-200'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                <Crown className="w-3.5 h-3.5 text-amber-600" />
                <span>{rev.featured ? 'Featured on Home' : 'Feature on Home'}</span>
              </button>

              <div className="flex items-center space-x-2">
                {rev.status === 'Pending' && (
                  <button
                    onClick={() => moderateReview(rev.id, 'Approved', rev.featured)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition cursor-pointer flex items-center space-x-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Approve</span>
                  </button>
                )}

                <button
                  onClick={() => deleteReview(rev.id)}
                  className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition cursor-pointer"
                  title="Remove Review"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
