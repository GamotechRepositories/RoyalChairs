import { useState } from 'react';
import { Search, RotateCw, ExternalLink } from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import CustomerDetailModal from './CustomerDetailModal';

export default function CustomersManager() {
  const { customers, refetchUsers } = useAdminData();
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // Modal State
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    if (refetchUsers) {
      await refetchUsers();
    }
    setTimeout(() => setRefreshing(false), 500);
  };

  const handleUserClick = (customer) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  const filteredCustomers = (customers || []).filter(
    (c) =>
      c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header Bar */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <h2 className="text-2xl font-bold text-slate-900 font-serif">Registered Users</h2>
            <span className="bg-emerald-50 text-emerald-800 text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
              {customers?.length || 0} Registered
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Manage customer accounts, registration profiles, and order history
          </p>
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <button
            onClick={handleRefresh}
            title="Refresh Users"
            className="flex items-center space-x-2 px-3.5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer"
          >
            <RotateCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs font-medium focus:bg-white focus:border-emerald-600 focus:outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-600 font-extrabold">
              <tr>
                <th className="py-4 px-5">User Profile</th>
                <th className="py-4 px-4">Lifetime Orders</th>
                <th className="py-4 px-4">Total Spent</th>
                <th className="py-4 px-4">Member Since</th>
                <th className="py-4 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.map((cust) => (
                <tr
                  key={cust.id}
                  onClick={() => handleUserClick(cust)}
                  className="hover:bg-emerald-50/50 transition cursor-pointer group"
                >
                  <td className="py-4 px-5">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-800 text-amber-300 flex items-center justify-center font-bold text-xs shrink-0 border border-emerald-600 shadow-2xs group-hover:scale-105 transition">
                        {cust.name
                          ? cust.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .toUpperCase()
                              .slice(0, 2)
                          : 'U'}
                      </div>
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <p className="font-bold text-slate-900 text-sm group-hover:text-emerald-800 transition">
                            {cust.name}
                          </p>
                          {cust.role === 'admin' && (
                            <span className="text-[9px] bg-emerald-100 text-emerald-800 font-extrabold px-1.5 py-0.5 rounded border border-emerald-200">
                              Admin
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500">{cust.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-4 font-mono font-bold text-slate-800">
                    {cust.ordersCount || 0} Orders
                  </td>

                  <td className="py-4 px-4 font-mono font-black text-emerald-800 text-sm">
                    ₹{(cust.totalSpent || 0).toLocaleString()}
                  </td>

                  <td className="py-4 px-4 text-slate-500 font-medium">
                    {cust.joinedDate || 'Recent'}
                  </td>

                  <td className="py-4 px-5 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUserClick(cust);
                      }}
                      className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-slate-100 group-hover:bg-emerald-600 group-hover:text-white text-slate-700 text-xs font-semibold transition cursor-pointer"
                    >
                      <span>View Details</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Details Modal */}
      <CustomerDetailModal
        customer={selectedCustomer}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
