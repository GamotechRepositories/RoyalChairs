import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Tag,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  Calendar,
  Percent,
  X,
  ShieldAlert,
  Sparkles,
  Crown,
  Copy,
  Check,
  Zap,
  Info,
  Layers,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import { TableSkeleton } from '../ui/AdminSkeletons';

export default function CouponsManager() {
  const { coupons = [], addCoupon, toggleCouponStatus, deleteCoupon, isLoading } = useAdminData();

  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedCode, setCopiedCode] = useState('');

  const [formData, setFormData] = useState({
    code: 'ROYAL20',
    type: 'percentage',
    value: 20,
    minSpend: 1000,
    maxDiscount: 5000,
    limit: 200,
    expiry: '2026-12-31',
    description: 'Exclusive 20% privilege discount for premium clientele',
  });

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && modalOpen) {
        setModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modalOpen]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [modalOpen]);

  const handleCopyCode = (code) => {
    if (!code) return;
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  const handleApplyPreset = (preset) => {
    setFormData((prev) => ({
      ...prev,
      code: preset.code,
      type: preset.type,
      value: preset.value,
      minSpend: preset.minSpend,
      maxDiscount: preset.maxDiscount,
      description: preset.description,
    }));
  };

  const generateRandomCode = () => {
    const prefixes = ['ROYAL', 'LUXURY', 'VIP', 'HERITAGE', 'FESTIVE', 'PRIME'];
    const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const randomNum = Math.floor(10 + Math.random() * 90);
    setFormData((prev) => ({ ...prev, code: `${randomPrefix}${randomNum}` }));
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    setError('');
    if (!formData.code.trim()) {
      setError('Please enter a valid coupon code.');
      return;
    }

    setLoading(true);
    try {
      await addCoupon({
        ...formData,
        code: formData.code.toUpperCase().trim(),
        value: Number(formData.value) || 0,
        minSpend: Number(formData.minSpend) || 0,
        maxDiscount: formData.type === 'percentage' && formData.maxDiscount ? Number(formData.maxDiscount) : null,
        limit: Number(formData.limit) || 1000,
      });
      setModalOpen(false);
      setFormData({
        code: 'ROYAL20',
        type: 'percentage',
        value: 20,
        minSpend: 1000,
        maxDiscount: 5000,
        limit: 200,
        expiry: '2026-12-31',
        description: '',
      });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to create promo voucher');
    } finally {
      setLoading(false);
    }
  };

  const now = new Date();

  const getCouponStatus = (cpn) => {
    let isExpired = false;
    if (cpn.expiry) {
      const expiryDate = new Date(cpn.expiry);
      if (!isNaN(expiryDate.getTime())) {
        expiryDate.setHours(23, 59, 59, 999);
        if (now > expiryDate) {
          isExpired = true;
        }
      }
    }

    const isExhausted = Boolean(
      cpn.limit && Number(cpn.limit) > 0 && Number(cpn.usageCount || 0) >= Number(cpn.limit)
    );

    if (isExpired) {
      return {
        label: 'Invalid (Expired)',
        badgeStyle: 'bg-rose-50 text-rose-800 border-rose-200',
        isValid: false,
        reason: 'Expired',
      };
    }

    if (isExhausted) {
      return {
        label: 'Invalid (Limit Exceeded)',
        badgeStyle: 'bg-amber-50 text-amber-900 border-amber-200',
        isValid: false,
        reason: 'Redemptions Reached',
      };
    }

    if (!cpn.active) {
      return {
        label: 'Invalid',
        badgeStyle: 'bg-slate-100 text-slate-600 border-slate-300',
        isValid: false,
        reason: 'Disabled',
      };
    }

    return {
      label: 'Active',
      badgeStyle: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      isValid: true,
      reason: 'Active',
    };
  };

  const activeCount = coupons.filter((c) => getCouponStatus(c).isValid).length;
  const totalRedemptions = coupons.reduce((sum, c) => sum + (c.usageCount || 0), 0);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-white via-slate-50 to-emerald-50/40 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-800 text-amber-300 flex items-center justify-center shadow-md">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 font-serif tracking-tight">
                Promotions &amp; Vouchers
              </h2>
              <div className="flex items-center space-x-2 mt-0.5">
                <span className="bg-emerald-100 text-emerald-900 text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border border-emerald-300">
                  {activeCount} Active
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-xs text-slate-500 font-medium flex items-center">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-700 mr-1" />
                  {totalRedemptions} Total Client Redemptions
                </span>
              </div>
            </div>
          </div>
          <p className="text-xs text-slate-500 max-w-xl">
            Manage store vouchers with spending thresholds, maximum discount caps, and automatic client cart validation.
          </p>
        </div>

        <button
          onClick={() => {
            setError('');
            setModalOpen(true);
          }}
          className="px-6 py-3.5 rounded-2xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-lg shadow-emerald-900/10 flex items-center space-x-2.5 transition transform active:scale-98 cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4 text-amber-300 stroke-[3]" />
          <span>Create Promo Voucher</span>
        </button>
      </div>

      {/* Coupons Table */}
      <div className="rounded-3xl bg-white border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50/90 border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-600 font-extrabold">
              <tr>
                <th className="py-4 px-5">Coupon Code</th>
                <th className="py-4 px-4">Discount Value</th>
                <th className="py-4 px-4">Min. Spend</th>
                <th className="py-4 px-4">Max. Discount</th>
                <th className="py-4 px-4">Redemptions</th>
                <th className="py-4 px-4">Expiry</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <TableSkeleton rows={4} cols={8} />
              ) : coupons.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-400">
                    <Tag className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-bold text-slate-700 text-sm">No promo vouchers found</p>
                    <p className="text-xs text-slate-400 mt-1">Click "Create Promo Voucher" above to add your first discount code.</p>
                  </td>
                </tr>
              ) : (
                coupons.map((cpn) => {
                  const key = cpn._id || cpn.id || cpn.code;
                  return (
                    <tr key={key} className="hover:bg-slate-50/80 transition">
                      {/* Code */}
                      <td className="py-4 px-5">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-black text-emerald-900 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 text-xs tracking-wider shadow-2xs">
                            {cpn.code}
                          </span>
                          <button
                            onClick={() => handleCopyCode(cpn.code)}
                            className="text-slate-400 hover:text-emerald-800 p-1 rounded-lg transition cursor-pointer"
                            title="Copy Code"
                          >
                            {copiedCode === cpn.code ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Value */}
                      <td className="py-4 px-4 font-mono font-black text-slate-900 text-sm">
                        {cpn.type === 'percentage' ? (
                          <span className="text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            {cpn.value}% OFF
                          </span>
                        ) : (
                          <span className="text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                            ₹{cpn.value} OFF
                          </span>
                        )}
                      </td>

                      {/* Min Spend */}
                      <td className="py-4 px-4 font-mono text-slate-800 font-bold">
                        ₹{Number(cpn.minSpend || 0).toLocaleString()}
                      </td>

                      {/* Max Discount */}
                      <td className="py-4 px-4 font-mono font-bold text-emerald-800">
                        {cpn.type === 'percentage' ? (
                          cpn.maxDiscount ? (
                            <span className="bg-amber-50 text-amber-900 px-2 py-0.5 rounded border border-amber-200">
                              Capped ₹{Number(cpn.maxDiscount).toLocaleString()}
                            </span>
                          ) : (
                            <span className="text-slate-400 font-normal text-[11px]">No Cap</span>
                          )
                        ) : (
                          <span className="text-slate-500 font-medium text-[11px]">Flat Discount</span>
                        )}
                      </td>

                      {/* Usage */}
                      <td className="py-4 px-4 font-mono text-slate-700 font-medium">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-1 text-xs">
                            <span className="text-slate-900 font-bold">{cpn.usageCount || 0}</span>
                            <span className="text-slate-400">/</span>
                            <span>{cpn.limit || '∞'}</span>
                          </div>
                          {cpn.limit && (
                            <div className="w-20 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                              <div
                                className="bg-emerald-700 h-full rounded-full"
                                style={{
                                  width: `${Math.min(100, Math.round(((cpn.usageCount || 0) / cpn.limit) * 100))}%`,
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Expiry */}
                      <td className="py-4 px-4 text-slate-500 font-medium">
                        <span className="flex items-center">
                          <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
                          {cpn.expiry || 'No Expiry'}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        {(() => {
                          const statusInfo = getCouponStatus(cpn);
                          return (
                            <button
                              onClick={() => toggleCouponStatus(cpn._id || cpn.id)}
                              className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold transition cursor-pointer border ${statusInfo.badgeStyle}`}
                              title={statusInfo.isValid ? 'Click to deactivate' : 'Click to activate'}
                            >
                              {statusInfo.isValid ? (
                                <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                              ) : (
                                <XCircle className="w-3 h-3 text-rose-500" />
                              )}
                              <span>{statusInfo.label}</span>
                            </button>
                          );
                        })()}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right">
                        <button
                          onClick={() => deleteCoupon(cpn._id || cpn.id)}
                          className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition cursor-pointer"
                          title="Delete Voucher"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* LUXURY CREATE PROMO VOUCHER MODAL (Mounted to Document Body via Portal) */}
      {modalOpen &&
        createPortal(
          <div
            onClick={() => setModalOpen(false)}
            className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/60 backdrop-blur-xs animate-fadeIn cursor-pointer overflow-y-auto"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white border border-slate-200 w-full max-w-2xl rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto relative p-6 sm:p-8 space-y-6 cursor-default text-slate-800 my-auto"
            >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-11 h-11 rounded-2xl bg-emerald-800 text-amber-300 flex items-center justify-center shadow-md">
                  <Tag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 font-serif">
                    Create Promo Voucher
                  </h3>
                  <p className="text-xs text-slate-500">
                    Configure luxury discount rules with spend minimums &amp; maximum caps
                  </p>
                </div>
              </div>

              <button
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center space-x-2 animate-fadeIn">
                <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            {/* LIVE VOUCHER PREVIEW CARD */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-900 text-white border border-emerald-700/50 shadow-lg relative overflow-hidden space-y-3">
              {/* Decorative Watermark */}
              <div className="absolute right-3 top-3 text-amber-300/10 pointer-events-none">
                <Crown className="w-24 h-24" />
              </div>

              <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-widest text-amber-300">
                <span className="flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Client Storefront Live Preview</span>
                </span>
                <span className="bg-amber-400/20 text-amber-200 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                  Verified Privilege
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div>
                  <span className="text-[10px] text-emerald-200 font-medium block uppercase tracking-wider">
                    Promotional Code
                  </span>
                  <div className="text-2xl sm:text-3xl font-mono font-black tracking-wider text-amber-300 flex items-center space-x-2">
                    <span>{formData.code || 'CODE20'}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-emerald-200 font-medium block uppercase tracking-wider">
                    Discount Applied
                  </span>
                  <span className="text-2xl sm:text-3xl font-mono font-black text-white">
                    {formData.type === 'percentage' ? `${formData.value || 0}% OFF` : `₹${formData.value || 0} OFF`}
                  </span>
                </div>
              </div>

              {/* Conditions Summary Strip */}
              <div className="pt-2 border-t border-emerald-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px] text-emerald-200 font-medium">
                <div className="flex items-center space-x-3">
                  <span>
                    Min. Spend: <strong className="text-white">₹{Number(formData.minSpend || 0).toLocaleString()}</strong>
                  </span>
                  {formData.type === 'percentage' && formData.maxDiscount && (
                    <>
                      <span>•</span>
                      <span>
                        Max Cap: <strong className="text-amber-300">₹{Number(formData.maxDiscount).toLocaleString()}</strong>
                      </span>
                    </>
                  )}
                </div>

                <span>
                  Valid till: <strong className="text-white">{formData.expiry || '2026-12-31'}</strong>
                </span>
              </div>
            </div>

            {/* QUICK PRESETS */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                Quick Preset Templates
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'WELCOME10 (10% Off)', code: 'WELCOME10', type: 'percentage', value: 10, minSpend: 500, maxDiscount: 2000, description: 'Welcome voucher for new clients' },
                  { label: 'ROYAL20 (20% Off)', code: 'ROYAL20', type: 'percentage', value: 20, minSpend: 1000, maxDiscount: 5000, description: '20% executive luxury discount' },
                  { label: 'FESTIVE50 (50% Off)', code: 'FESTIVE50', type: 'percentage', value: 50, minSpend: 2000, maxDiscount: 10000, description: 'Special 50% seasonal promotion' },
                  { label: 'FLAT ₹1,000 OFF', code: 'SAVE1000', type: 'fixed', value: 1000, minSpend: 5000, maxDiscount: null, description: 'Flat ₹1,000 instant cart discount' },
                ].map((preset, pIdx) => (
                  <button
                    key={pIdx}
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-900 hover:border-emerald-300 text-slate-700 font-bold text-xs border border-slate-200 transition cursor-pointer flex items-center space-x-1"
                  >
                    <Zap className="w-3 h-3 text-amber-500" />
                    <span>{preset.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* FORM */}
            <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs">
              {/* Coupon Code Input & Generator */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-slate-700 font-bold">
                    Coupon Code <span className="text-rose-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={generateRandomCode}
                    className="text-emerald-800 hover:text-emerald-700 font-bold text-[11px] flex items-center space-x-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>Generate Random Code</span>
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g. ROYAL50, LUXURY20"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-emerald-900 font-mono font-black text-sm focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 focus:outline-hidden uppercase tracking-wider"
                  />
                  <Tag className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                </div>
              </div>

              {/* Discount Type Segmented Switcher */}
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">Discount Calculation Model</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'percentage' })}
                    className={`py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 border transition cursor-pointer ${
                      formData.type === 'percentage'
                        ? 'bg-emerald-800 text-white border-emerald-700 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Percent className="w-4 h-4" />
                    <span>Percentage Off (%)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'fixed', maxDiscount: '' })}
                    className={`py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 border transition cursor-pointer ${
                      formData.type === 'fixed'
                        ? 'bg-emerald-800 text-white border-emerald-700 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span className="font-mono font-black text-sm">₹</span>
                    <span>Flat Amount Off (₹)</span>
                  </button>
                </div>
              </div>

              {/* Value & Min Spend */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    {formData.type === 'percentage' ? 'Discount Percentage (%)' : 'Flat Discount Amount (₹)'}
                    <span className="text-rose-500 ml-0.5">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      max={formData.type === 'percentage' ? 100 : 100000}
                      required
                      placeholder={formData.type === 'percentage' ? 'e.g. 20' : 'e.g. 1000'}
                      value={formData.value}
                      onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-mono font-bold focus:bg-white focus:border-emerald-600 focus:outline-hidden text-sm"
                    />
                    <span className="absolute left-3.5 top-2.5 font-bold text-slate-400">
                      {formData.type === 'percentage' ? '%' : '₹'}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Minimum Order Spend (₹)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      placeholder="e.g. 500"
                      value={formData.minSpend}
                      onChange={(e) => setFormData({ ...formData, minSpend: Number(e.target.value) })}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-mono font-bold focus:bg-white focus:border-emerald-600 focus:outline-hidden text-sm"
                    />
                    <span className="absolute left-3.5 top-2.5 font-bold text-slate-400">₹</span>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Clients must add items equal or greater than this cart value.
                  </span>
                </div>
              </div>

              {/* Max Discount Cap & Redemptions Limit */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-slate-700 font-bold">
                      Max Discount Cap (₹)
                    </label>
                    {formData.type === 'fixed' && (
                      <span className="text-[10px] text-slate-400">(N/A for flat amounts)</span>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      disabled={formData.type === 'fixed'}
                      placeholder={formData.type === 'percentage' ? 'e.g. 5000 (Optional)' : 'Fixed discount'}
                      value={formData.maxDiscount || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          maxDiscount: e.target.value === '' ? '' : Number(e.target.value),
                        })
                      }
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-mono font-bold focus:bg-white focus:border-emerald-600 focus:outline-hidden disabled:opacity-50 text-sm"
                    />
                    <span className="absolute left-3.5 top-2.5 font-bold text-slate-400">₹</span>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Ceiling limit on percentage savings (e.g. 50% up to ₹5,000).
                  </span>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Total Redemptions Limit
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 100"
                    value={formData.limit}
                    onChange={(e) => setFormData({ ...formData, limit: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-mono font-bold focus:bg-white focus:border-emerald-600 focus:outline-hidden text-sm"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Max number of times this voucher can be claimed store-wide.
                  </span>
                </div>
              </div>

              {/* Expiry Date & Description */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Expiration Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.expiry}
                    onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-medium focus:bg-white focus:border-emerald-600 focus:outline-hidden text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Voucher Description (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Festive luxury 20% discount"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-medium focus:bg-white focus:border-emerald-600 focus:outline-hidden text-xs"
                  />
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-900/10 transition flex items-center space-x-2 cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>{loading ? 'Creating Voucher...' : 'Save & Activate Voucher'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

