import { useState } from 'react';
import { Tag, Plus, Trash2, CheckCircle2, XCircle, Calendar, Percent, DollarSign, X } from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';

export default function CouponsManager() {
  const { coupons, addCoupon, toggleCouponStatus, deleteCoupon } = useAdminData();

  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    type: 'percentage',
    value: 20,
    minSpend: 400,
    limit: 100,
    expiry: '2026-12-31',
  });

  const handleCreateCoupon = (e) => {
    e.preventDefault();
    if (!formData.code.trim()) return;
    addCoupon({
      ...formData,
      code: formData.code.toUpperCase().trim(),
    });
    setModalOpen(false);
    setFormData({
      code: '',
      type: 'percentage',
      value: 20,
      minSpend: 400,
      limit: 100,
      expiry: '2026-12-31',
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header Bar */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <h2 className="text-2xl font-bold text-slate-900 font-serif">Promotions & Vouchers</h2>
            <span className="bg-emerald-50 text-emerald-800 text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
              {coupons.length} Active
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Create promotional discount codes for flash sales, events, and seasonal collections
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-5 py-3 rounded-2xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-md flex items-center space-x-2 transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-amber-300" />
          <span>Create Voucher</span>
        </button>
      </div>

      {/* Coupons Table */}
      <div className="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-600 font-extrabold">
              <tr>
                <th className="py-4 px-4">Coupon Code</th>
                <th className="py-4 px-4">Discount Value</th>
                <th className="py-4 px-4">Minimum Order</th>
                <th className="py-4 px-4">Redemptions</th>
                <th className="py-4 px-4">Expiration</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {coupons.map((cpn) => (
                <tr key={cpn.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-4 px-4">
                    <span className="font-mono font-black text-emerald-900 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 text-sm tracking-wider shadow-2xs">
                      {cpn.code}
                    </span>
                  </td>

                  <td className="py-4 px-4 font-mono font-black text-slate-900 text-sm">
                    {cpn.type === 'percentage' ? `${cpn.value}% OFF` : `$${cpn.value} OFF`}
                  </td>

                  <td className="py-4 px-4 font-mono text-slate-700 font-medium">
                    ₹{cpn.minSpend}
                  </td>

                  <td className="py-4 px-4 font-mono text-slate-700 font-medium">
                    <span className="text-slate-900 font-bold">{cpn.usageCount}</span> / {cpn.limit}
                  </td>

                  <td className="py-4 px-4 text-slate-500 font-medium">
                    {cpn.expiry}
                  </td>

                  <td className="py-4 px-4">
                    <button
                      onClick={() => toggleCouponStatus(cpn.id)}
                      className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold transition cursor-pointer ${
                        cpn.active
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-slate-100 text-slate-500 border border-slate-200'
                      }`}
                    >
                      {cpn.active ? <CheckCircle2 className="w-3 h-3 text-emerald-700" /> : <XCircle className="w-3 h-3 text-slate-400" />}
                      <span>{cpn.active ? 'Active' : 'Disabled'}</span>
                    </button>
                  </td>

                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={() => deleteCoupon(cpn.id)}
                      className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition cursor-pointer"
                      title="Delete Voucher"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Coupon Modal */}
      {modalOpen && (
        <div
          onClick={() => setModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white border border-slate-200 w-full max-w-md rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl cursor-default text-slate-800"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900 font-serif">Create Promo Voucher</h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Coupon Code (Uppercase)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AUTUMN30"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-emerald-800 font-mono font-black focus:bg-white focus:border-emerald-600 focus:outline-hidden uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Discount Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold"
                  >
                    <option value="percentage">% Percentage Off</option>
                    <option value="fixed">₹ Fixed Amount Off</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Discount Value</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                    className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Min Spend (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.minSpend}
                    onChange={(e) => setFormData({ ...formData, minSpend: Number(e.target.value) })}
                    className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Usage Limit</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.limit}
                    onChange={(e) => setFormData({ ...formData, limit: Number(e.target.value) })}
                    className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Expiry Date</label>
                <input
                  type="date"
                  required
                  value={formData.expiry}
                  onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-extrabold shadow-md"
                >
                  Save Voucher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
