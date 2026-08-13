import { useState } from 'react';
import {
  ShoppingBag,
  Search,
  Filter,
  Eye,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  AlertCircle,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import OrderDetailModal from './OrderDetailModal';

export default function OrdersManager() {
  const { orders } = useAdminData();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const STATUS_TABS = ['All', 'Pending', 'In Production', 'Dispatched', 'Delivered', 'Cancelled'];

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.trackingNumber && o.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = activeFilter === 'All' || o.fulfillmentStatus.toLowerCase() === activeFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header Bar */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <h2 className="text-2xl font-bold text-slate-900 font-serif">Orders & Logistics</h2>
            <span className="bg-emerald-50 text-emerald-800 text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
              {orders.length} Active
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Track benchcrafted seating orders, customer requests, and white-glove courier deliveries
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-right">
            <p className="text-slate-500 text-[10px] font-medium">Total Order Volume</p>
            <p className="text-sm font-black text-emerald-800 font-mono">
              ₹{orders.reduce((s, o) => s + (o.total || 0), 0).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="p-4 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {STATUS_TABS.map((tab) => {
              const count = tab === 'All' ? orders.length : orders.filter((o) => o.fulfillmentStatus.toLowerCase() === tab.toLowerCase()).length;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveFilter(tab)}
                  className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
                    activeFilter === tab
                      ? 'bg-emerald-800 text-white shadow-sm font-extrabold'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200'
                  }`}
                >
                  <span>{tab}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeFilter === tab ? 'bg-amber-300 text-emerald-950 font-black' : 'bg-slate-200 text-slate-700 font-bold'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Order ID, Client, Tracking..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs font-medium focus:bg-white focus:border-emerald-600 focus:outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-600 font-extrabold">
              <tr>
                <th className="py-4 px-4">Order ID</th>
                <th className="py-4 px-4">VIP Client</th>
                <th className="py-4 px-4">Item Breakdown</th>
                <th className="py-4 px-4">Total Amount</th>
                <th className="py-4 px-4">Fulfillment Status</th>
                <th className="py-4 px-4">Courier Tracking</th>
                <th className="py-4 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-500 font-medium">
                    No client orders found in this status category.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/80 transition group">
                    {/* Order ID & Date */}
                    <td className="py-4 px-4">
                      <div className="font-mono font-black text-slate-900 text-sm">
                        {order.id}
                      </div>
                      <span className="text-[10px] text-slate-500 font-medium">
                        {new Date(order.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                    </td>

                    {/* Customer */}
                    <td className="py-4 px-4">
                      <p className="font-bold text-slate-900 group-hover:text-emerald-800 transition">
                        {order.customer.name}
                      </p>
                      <p className="text-[10px] text-slate-500 truncate max-w-[140px]">
                        {order.customer.email}
                      </p>
                    </td>

                    {/* Items */}
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <div className="flex -space-x-2">
                          {order.items.map((item, idx) => (
                            <img
                              key={idx}
                              src={item.image}
                              alt={item.name}
                              className="w-8 h-8 rounded-xl object-cover border-2 border-white shadow-xs"
                            />
                          ))}
                        </div>
                        <span className="text-xs font-bold text-slate-700">
                          {order.items.reduce((s, i) => s + i.quantity, 0)} Seats
                        </span>
                      </div>
                    </td>

                    {/* Total Amount */}
                    <td className="py-4 px-4 font-mono">
                      <p className="font-black text-emerald-800 text-sm">
                        ₹{order.total.toLocaleString()}
                      </p>
                      <span className="text-[10px] text-emerald-700 font-sans font-bold">
                        {order.paymentStatus}
                      </span>
                    </td>

                    {/* Fulfillment Status */}
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-extrabold ${
                          order.fulfillmentStatus === 'Delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : order.fulfillmentStatus === 'Dispatched'
                            ? 'bg-blue-100 text-blue-800'
                            : order.fulfillmentStatus === 'In Production'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}
                      >
                        {order.fulfillmentStatus}
                      </span>
                    </td>

                    {/* Tracking Code */}
                    <td className="py-4 px-4 font-mono text-[11px] text-slate-600 font-medium">
                      {order.trackingNumber || 'Awaiting assignment'}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-xs font-bold transition flex items-center space-x-1.5 ml-auto cursor-pointer shadow-2xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      <OrderDetailModal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        order={selectedOrder}
      />
    </div>
  );
}
