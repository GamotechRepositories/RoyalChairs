import { useState } from 'react';
import { Users, Search, Crown, Mail, ShoppingBag, DollarSign, Calendar } from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';

export default function CustomersManager() {
  const { customers } = useAdminData();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.tier.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header Bar */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <h2 className="text-2xl font-bold text-slate-900 font-serif">VIP Client Directory (CRM)</h2>
            <span className="bg-emerald-50 text-emerald-800 text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
              {customers.length} Members
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Client profiles, lifetime order history, white-glove privileges, and VIP tiers
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by client name, email, tier..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs font-medium focus:bg-white focus:border-emerald-600 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-600 font-extrabold">
              <tr>
                <th className="py-4 px-4">VIP Client</th>
                <th className="py-4 px-4">Tier Status</th>
                <th className="py-4 px-4">Lifetime Orders</th>
                <th className="py-4 px-4">Total Expenditure</th>
                <th className="py-4 px-4">Member Since</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.map((cust) => (
                <tr key={cust.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={cust.avatar}
                        alt={cust.name}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200 shadow-xs"
                      />
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{cust.name}</p>
                        <p className="text-[11px] text-slate-500">{cust.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-800 border border-amber-200">
                      <Crown className="w-3 h-3 text-amber-600" />
                      <span>{cust.tier}</span>
                    </span>
                  </td>

                  <td className="py-4 px-4 font-mono font-bold text-slate-800">
                    {cust.ordersCount} Orders
                  </td>

                  <td className="py-4 px-4 font-mono font-black text-emerald-800 text-sm">
                    ₹{cust.totalSpent.toLocaleString()}
                  </td>

                  <td className="py-4 px-4 text-slate-500 font-medium">
                    {cust.joinedDate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
