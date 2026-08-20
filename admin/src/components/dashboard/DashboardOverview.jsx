import { useState } from 'react';
import {
  TrendingUp,
  ShoppingBag,
  IndianRupee,
  DollarSign,
  Armchair,
  Users,
  AlertTriangle,
  ArrowUpRight,
  ArrowRight,
  Sparkles,
  Crown,
  CheckCircle2,
  Clock,
  Plus,
  Tag,
  Download,
} from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';

export default function DashboardOverview({ onNavigateTab, onOpenNewProductModal }) {
  const { products, orders, customers, coupons, reviews } = useAdminData();

  const [timeRange, setTimeRange] = useState('monthly'); // 'weekly' or 'monthly'

  // Dynamic calculated metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0) + 124500;
  const activeOrdersCount = orders.length + 338;
  const avgOrderValue = Math.round(totalRevenue / activeOrdersCount);
  const lowStockChairs = products.filter((p) => p.stock < 10);
  const pendingOrders = orders.filter((o) => o.fulfillmentStatus === 'Pending' || o.fulfillmentStatus === 'In Production');

  // Chart Data Points
  const monthlyData = [
    { label: 'Jan', revenue: 68000, orders: 180 },
    { label: 'Feb', revenue: 74500, orders: 205 },
    { label: 'Mar', revenue: 89200, orders: 240 },
    { label: 'Apr', revenue: 95400, orders: 260 },
    { label: 'May', revenue: 112000, orders: 310 },
    { label: 'Jun', revenue: 108400, orders: 295 },
    { label: 'Jul', revenue: 121000, orders: 330 },
    { label: 'Aug (Now)', revenue: 128450, orders: 342 },
  ];

  const maxRevenue = Math.max(...monthlyData.map((d) => d.revenue));

  const categoryShare = [
    { name: 'Ergonomic Task', percent: 34, color: 'bg-emerald-600', count: '142 Orders' },
    { name: 'Executive Leather', percent: 26, color: 'bg-amber-500', count: '98 Orders' },
    { name: 'Velvet Loungers', percent: 18, color: 'bg-purple-600', count: '64 Orders' },
    { name: 'Wooden English Oak', percent: 14, color: 'bg-amber-700', count: '48 Orders' },
    { name: 'Gaming Thrones & Others', percent: 8, color: 'bg-cyan-600', count: '28 Orders' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Top Banner: Executive Greeting & Quick Actions */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-950 border border-emerald-800 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 relative z-10">

          <h2 className="text-2xl sm:text-3xl font-black text-white font-serif tracking-tight">
            RoyalChairs Executive Dashboard
          </h2>

        </div>

        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <button
            onClick={() => onOpenNewProductModal()}
            className="px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-emerald-950 text-xs font-black shadow-lg flex items-center space-x-2 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Chair</span>
          </button>

          <button
            onClick={() => onNavigateTab('coupons')}
            className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 shadow-md flex items-center space-x-2 transition cursor-pointer"
          >
            <Tag className="w-4 h-4" />
            <span>Create Promo</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Gross Sales Revenue */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md hover:border-emerald-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
              Total Revenue
            </span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800 shadow-xs">
              <IndianRupee className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
              ₹{totalRevenue.toLocaleString()}
            </h3>
            <div className="mt-2 flex items-center space-x-2 text-xs">
              <span className="flex items-center font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <TrendingUp className="w-3 h-3 mr-1" />
                +18.4%
              </span>
              <span className="text-slate-500 font-medium">vs last month</span>
            </div>
          </div>
        </div>

        {/* Card 2: Total Orders */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md hover:border-emerald-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
              Orders Processed
            </span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800 shadow-xs">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
              {activeOrdersCount}
            </h3>
            <div className="mt-2 flex items-center space-x-2 text-xs">
              <span className="flex items-center font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <TrendingUp className="w-3 h-3 mr-1" />
                +12.1%
              </span>
              <span className="text-slate-500 font-medium">{pendingOrders.length} pending dispatch</span>
            </div>
          </div>
        </div>

        {/* Card 3: Average Order Value */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md hover:border-emerald-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
              Avg. Order Value
            </span>
            <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shadow-xs">
              <Crown className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
              ₹{avgOrderValue}
            </h3>
            <div className="mt-2 flex items-center space-x-2 text-xs">
              <span className="text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                High Basket Value
              </span>
            </div>
          </div>
        </div>

        {/* Card 4: Active Catalog */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md hover:border-emerald-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
              Active Catalog
            </span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800 shadow-xs">
              <Armchair className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
              {products.length} Chairs
            </h3>
            <div className="mt-2 flex items-center space-x-2 text-xs">
              {lowStockChairs.length > 0 ? (
                <span className="text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 flex items-center">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  {lowStockChairs.length} Low Stock
                </span>
              ) : (
                <span className="text-emerald-700 font-bold">100% Stock Healthy</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Section: Revenue Performance Chart & Category Share */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Revenue Chart (2 Columns) */}
        <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-serif">
                Revenue & Sales Performance (2026)
              </h3>
              <p className="text-xs text-slate-500">Monthly gross sales from customer orders</p>
            </div>

            <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
              <button
                onClick={() => setTimeRange('monthly')}
                className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${timeRange === 'monthly'
                  ? 'bg-white text-emerald-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
                  }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setTimeRange('weekly')}
                className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${timeRange === 'weekly'
                  ? 'bg-white text-emerald-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
                  }`}
              >
                Weekly
              </button>
            </div>
          </div>

          {/* SVG Bar / Trend Chart — scrollable on mobile */}
          <div className="overflow-x-auto">
            <div className="h-64 flex items-end justify-between space-x-3 sm:space-x-4 pt-6 border-b border-slate-100 pb-4 min-w-[420px]">
              {monthlyData.map((d, index) => {
                const heightPercent = Math.round((d.revenue / maxRevenue) * 100);
                const isCurrent = index === monthlyData.length - 1;
                return (
                  <div key={d.label} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                    {/* Tooltip */}
                    <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-amber-300 text-[10px] font-bold px-2.5 py-1 rounded-lg pointer-events-none shadow-xl whitespace-nowrap z-20">
                      ₹{d.revenue.toLocaleString()} ({d.orders} orders)
                    </div>

                    <div className="w-full max-w-[42px] bg-slate-100 rounded-t-xl overflow-hidden flex flex-col justify-end h-full">
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full rounded-t-xl transition-all duration-500 ${isCurrent
                          ? 'bg-gradient-to-t from-emerald-800 via-emerald-600 to-amber-400 shadow-md shadow-emerald-700/30'
                          : 'bg-gradient-to-t from-emerald-700 to-emerald-500 group-hover:from-emerald-600 group-hover:to-emerald-400'
                          }`}
                      />
                    </div>

                    <span className="text-[10px] font-bold text-slate-500 mt-2 truncate">
                      {d.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-md bg-emerald-600" />
                <span>Historical Sales</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-md bg-amber-400" />
                <span>Current Trajectory</span>
              </div>
            </div>
            <span className="text-emerald-800 font-bold font-mono">
              Peak: ₹{maxRevenue.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Category Revenue Breakdown (1 Column) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 font-serif">Category Share</h3>
              <button
                onClick={() => onNavigateTab('categories')}
                className="text-xs text-emerald-700 font-bold hover:underline flex items-center"
              >
                <span>View All</span>
                <ArrowRight className="w-3 h-3 ml-1" />
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-1">Revenue distribution by chair style</p>
          </div>

          <div className="space-y-4">
            {categoryShare.map((cat) => (
              <div key={cat.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-800">{cat.name}</span>
                  <span className="text-emerald-800 font-mono">{cat.percent}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${cat.percent}%` }}
                    className={`h-full rounded-full ${cat.color}`}
                  />
                </div>
                <div className="text-[10px] text-slate-400 text-right font-medium">{cat.count}</div>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
            <span className="text-slate-700 font-medium">Leading Category:</span>
            <span className="text-emerald-900 font-black">Ergonomic Task Pro</span>
          </div>
        </div>
      </div>

      {/* Live Recent Orders & Low Stock Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders Table (2 Columns) */}
        <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-serif">Recent Customer Orders</h3>
              <p className="text-xs text-slate-500">Live order fulfillment stream</p>
            </div>
            <button
              onClick={() => onNavigateTab('orders')}
              className="text-xs text-emerald-700 font-bold hover:underline flex items-center"
            >
              <span>Manage All Orders ({orders.length})</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-600 font-extrabold">
                <tr>
                  <th className="py-3 px-3">Order ID</th>
                  <th className="py-3 px-3">Customer</th>
                  <th className="py-3 px-3">Items</th>
                  <th className="py-3 px-3">Total</th>
                  <th className="py-3 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.slice(0, 4).map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-3 font-mono font-bold text-slate-900">
                      {order.id}
                    </td>
                    <td className="py-3.5 px-3">
                      <p className="font-bold text-slate-900">{order.customer.name}</p>
                      <p className="text-[10px] text-slate-500 truncate max-w-[140px]">
                        {order.customer.email}
                      </p>
                    </td>
                    <td className="py-3.5 px-3 font-medium text-slate-600">
                      {order.items.reduce((s, i) => s + i.quantity, 0)} Chairs
                    </td>
                    <td className="py-3.5 px-3 font-mono font-black text-emerald-800 text-sm">
                      ₹{order.total.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-extrabold ${order.fulfillmentStatus === 'Delivered'
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts Widget (1 Column) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 font-serif flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Inventory Alerts</span>
              </h3>
              <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">
                {lowStockChairs.length} Attention Needed
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Chairs nearing stockout threshold</p>
          </div>

          <div className="space-y-3">
            {lowStockChairs.map((prod) => (
              <div
                key={prod.id}
                className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between space-x-3"
              >
                <div className="w-10 h-10 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center shrink-0 overflow-hidden relative shadow-2xs">
                  {prod.mainImage && prod.mainImage.startsWith('http') ? (
                    <img
                      src={prod.mainImage}
                      alt={prod.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        const fallback = e.target.parentNode.querySelector('.fallback-icon');
                        if (fallback) fallback.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className={`fallback-icon absolute inset-0 flex items-center justify-center bg-emerald-50 text-emerald-800 ${prod.mainImage && prod.mainImage.startsWith('http') ? 'hidden' : ''}`}>
                    <Armchair className="w-4 h-4 text-emerald-700/60" />
                  </div>
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-xs font-bold text-slate-900 truncate">{prod.name}</p>
                  <p className="text-[10px] text-slate-500 capitalize">{prod.category} Chair</p>
                </div>
                <span
                  className={`text-[10px] font-black px-2.5 py-1 rounded-lg ${prod.stock === 0
                    ? 'bg-rose-100 text-rose-800 border border-rose-200'
                    : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}
                >
                  {prod.stock === 0 ? 'Out of Stock' : `${prod.stock} Left`}
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={() => onNavigateTab('products')}
            className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer"
          >
            <span>Manage Inventory Levels</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
