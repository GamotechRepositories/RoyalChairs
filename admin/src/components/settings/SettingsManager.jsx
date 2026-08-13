import { useState } from 'react';
import { Settings, Save, CheckCircle2, ShieldCheck, Truck, Mail, Phone, MapPin, Globe } from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';

export default function SettingsManager() {
  const { settings, updateSettings } = useAdminData();
  const [formData, setFormData] = useState({ ...settings });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    updateSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header Bar */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <h2 className="text-2xl font-bold text-slate-900 font-serif">Store Configuration & Logistics</h2>
          </div>
          <p className="text-xs text-slate-500">
            Control brand details, currency, taxes, white-glove courier rules, and support concierge
          </p>
        </div>

        {savedSuccess && (
          <span className="text-xs text-emerald-800 font-bold bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-200 flex items-center shadow-xs">
            <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-600" />
            Configurations saved successfully!
          </span>
        )}
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* General Store Identity */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 font-serif flex items-center space-x-2">
            <Globe className="w-4 h-4 text-emerald-700" />
            <span>Store Brand Identity</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Store Name</label>
              <input
                type="text"
                value={formData.storeName}
                onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:bg-white focus:border-emerald-600 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Brand Tagline</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:bg-white focus:border-emerald-600 focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Financials & Logistics */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 font-serif flex items-center space-x-2">
            <Truck className="w-4 h-4 text-amber-600" />
            <span>Shipping & Financial Parameters</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Currency Code</label>
              <input
                type="text"
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono font-bold focus:bg-white focus:border-emerald-600 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Standard Tax Rate (%)</label>
              <input
                type="number"
                step="0.1"
                value={formData.taxRate}
                onChange={(e) => setFormData({ ...formData, taxRate: Number(e.target.value) })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono font-bold focus:bg-white focus:border-emerald-600 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Free White-Glove Threshold (₹)</label>
              <input
                type="number"
                value={formData.freeShippingThreshold}
                onChange={(e) => setFormData({ ...formData, freeShippingThreshold: Number(e.target.value) })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono font-bold focus:bg-white focus:border-emerald-600 focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Concierge & Contact */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 font-serif flex items-center space-x-2">
            <Mail className="w-4 h-4 text-purple-700" />
            <span>Concierge & Customer Support</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Concierge Email</label>
              <input
                type="email"
                value={formData.supportEmail}
                onChange={(e) => setFormData({ ...formData, supportEmail: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:bg-white focus:border-emerald-600 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Concierge Phone Line</label>
              <input
                type="text"
                value={formData.supportPhone}
                onChange={(e) => setFormData({ ...formData, supportPhone: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:bg-white focus:border-emerald-600 focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-8 py-3.5 rounded-2xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-md flex items-center space-x-2 transition cursor-pointer"
          >
            <Save className="w-4 h-4 text-amber-300" />
            <span>Save All Configurations</span>
          </button>
        </div>
      </form>
    </div>
  );
}
