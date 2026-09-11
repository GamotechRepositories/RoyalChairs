import { useState, useMemo } from 'react';
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
import { StatCardSkeleton, TableRowSkeleton } from '../ui/AdminSkeletons';

export default function DashboardOverview({ onNavigateTab, onOpenNewProductModal }) {
  const { products, orders, customers, coupons, reviews, isLoading } = useAdminData();

  const [timeRange, setTimeRange] = useState('monthly'); // 'weekly' or 'monthly'

  // 1. Core Dynamic Metrics Computed 100% from MongoDB Real Data
  const totalRevenue = orders.reduce((sum, o) => {
    const val = Number(o.totalAmount !== undefined ? o.totalAmount : (o.total || 0));
    return sum + (isNaN(val) ? 0 : val);
  }, 0);

  const activeOrdersCount = orders.length;
  const avgOrderValue = activeOrdersCount > 0 ? Math.round(totalRevenue / activeOrdersCount) : 0;
  const outOfStockChairs = products.filter((p) => p.isAvailable === false || Number(p.stock) === 0);
  const pendingOrders = orders.filter((o) => {
    const st = (o.fulfillmentStatus || o.orderStatus || '').toLowerCase();
    return st === 'pending' || st === 'placed' || st === 'in production' || st === 'confirmed';
  });

  // 2. Dynamic Monthly Performance Chart (Last 8 Months ending in Current Month)
  const monthlyData = useMemo(() => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    const currentMonthIdx = now.getMonth();
    const currentYear = now.getFullYear();

    const months = [];
    for (let i = 7; i >= 0; i--) {
      const d = new Date(currentYear, currentMonthIdx - i, 1);
      const mIdx = d.getMonth();
      const yr = d.getFullYear();
      const isCurrent = i === 0;
      months.push({
        label: isCurrent ? `${monthNames[mIdx]} (Now)` : monthNames[mIdx],
        monthIndex: mIdx,
        year: yr,
        revenue: 0,
        orders: 0,
      });
    }

    // Aggregate real orders into their respective month
    orders.forEach((o) => {
      const oDate = new Date(o.createdAt || o.date || now);
      if (isNaN(oDate.getTime())) return;
      const oMonth = oDate.getMonth();
      const oYear = oDate.getFullYear();
      const match = months.find((m) => m.monthIndex === oMonth && m.year === oYear);
      if (match) {
        const amt = Number(o.totalAmount !== undefined ? o.totalAmount : (o.total || 0));
        match.revenue += isNaN(amt) ? 0 : amt;
        match.orders += 1;
      }
    });

    return months;
  }, [orders]);

  // 3. Dynamic Weekly Performance Chart (Last 7 Days)
  const weeklyData = useMemo(() => {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const now = new Date();
    const days = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const isToday = i === 0;
      days.push({
        label: isToday ? 'Today' : dayNames[d.getDay()],
        dateStr: d.toDateString(),
        revenue: 0,
        orders: 0,
      });
    }

    orders.forEach((o) => {
      const oDate = new Date(o.createdAt || o.date || now);
      if (isNaN(oDate.getTime())) return;
      const match = days.find((d) => d.dateStr === oDate.toDateString());
      if (match) {
        const amt = Number(o.totalAmount !== undefined ? o.totalAmount : (o.total || 0));
        match.revenue += isNaN(amt) ? 0 : amt;
        match.orders += 1;
      }
    });

    return days;
  }, [orders]);

  const activeChartData = timeRange === 'monthly' ? monthlyData : weeklyData;
  const maxRevenue = Math.max(...activeChartData.map((d) => d.revenue), 0);
  const currentTotalChartRevenue = activeChartData.reduce((s, d) => s + d.revenue, 0);

  // Month-over-month growth calculations
  const currentMonthRevenue = monthlyData[monthlyData.length - 1]?.revenue || 0;
  const prevMonthRevenue = monthlyData[monthlyData.length - 2]?.revenue || 0;
  const revenueGrowth = prevMonthRevenue > 0
    ? Math.round(((currentMonthRevenue - prevMonthRevenue) / prevMonthRevenue) * 100)
    : null;

  const currentMonthOrders = monthlyData[monthlyData.length - 1]?.orders || 0;
  const prevMonthOrders = monthlyData[monthlyData.length - 2]?.orders || 0;
  const ordersGrowth = prevMonthOrders > 0
    ? Math.round(((currentMonthOrders - prevMonthOrders) / prevMonthOrders) * 100)
    : null;

  // 4. Dynamic Category Share (Computed from Real Orders or Catalog Distribution)
  const categoryShare = useMemo(() => {
    const catCounts = {};
    const catColors = [
      'bg-emerald-600',
      'bg-amber-500',
      'bg-purple-600',
      'bg-cyan-600',
      'bg-rose-500',
      'bg-blue-600',
    ];

    // Check if orders exist with items
    let hasOrderItems = false;
    orders.forEach((o) => {
      if (Array.isArray(o.items) && o.items.length > 0) {
        hasOrderItems = true;
        o.items.forEach((item) => {
          const cat = item.categorySlug || item.category || 'Executive';
          const qty = Number(item.quantity) || 1;
          catCounts[cat] = (catCounts[cat] || 0) + qty;
        });
      }
    });

    // If no order items yet, calculate from active catalog products
    if (!hasOrderItems) {
      products.forEach((p) => {
        const cat = p.categorySlug || p.category || 'General';
        catCounts[cat] = (catCounts[cat] || 0) + 1;
      });
    }

    const totalCount = Object.values(catCounts).reduce((s, v) => s + v, 0) || 1;
    const entries = Object.entries(catCounts);

    if (entries.length === 0) {
      return [
        { name: 'Executive Seating', percent: 100, count: `${products.length} Chairs`, color: 'bg-emerald-600' },
      ];
    }

    return entries
      .map(([name, count], idx) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, ' '),
        percent: Math.round((count / totalCount) * 100),
        count: `${count} ${hasOrderItems ? 'Units Sold' : 'Catalog Models'}`,
        color: catColors[idx % catColors.length],
        rawCount: count,
      }))
      .sort((a, b) => b.percent - a.percent);
  }, [orders, products]);

  const leadingCategory = categoryShare.length > 0 ? categoryShare[0].name : 'Executive Leather';

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Top Banner: Executive Greeting & Quick Actions */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-950 border border-emerald-800 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 relative z-10">
          <h2 className="text-2xl sm:text-3xl font-black text-white font-serif tracking-tight">
            RoyalChairs Executive Dashboard
          </h2>
          <p className="text-emerald-200 text-xs sm:text-sm font-medium">
            Live business intelligence & operational command center
          </p>
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
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
      ) : (
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
                {revenueGrowth !== null ? (
                  <span className={`flex items-center font-bold px-2 py-0.5 rounded-full border ${
                    revenueGrowth >= 0
                      ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                      : 'text-rose-700 bg-rose-50 border-rose-200'
                  }`}>
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {revenueGrowth >= 0 ? `+${revenueGrowth}%` : `${revenueGrowth}%`}
                  </span>
                ) : (
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Live Real-time
                  </span>
                )}
                <span className="text-slate-500 font-medium">
                  {revenueGrowth !== null ? 'vs last month' : 'from database'}
                </span>
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
                {ordersGrowth !== null ? (
                  <span className={`flex items-center font-bold px-2 py-0.5 rounded-full border ${
                    ordersGrowth >= 0
                      ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                      : 'text-rose-700 bg-rose-50 border-rose-200'
                  }`}>
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {ordersGrowth >= 0 ? `+${ordersGrowth}%` : `${ordersGrowth}%`}
                  </span>
                ) : (
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    {pendingOrders.length} Pending
                  </span>
                )}
                <span className="text-slate-500 font-medium">
                  {pendingOrders.length} pending dispatch
                </span>
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
                ₹{avgOrderValue.toLocaleString()}
              </h3>
              <div className="mt-2 flex items-center space-x-2 text-xs">
                <span className="text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  {avgOrderValue > 10000 ? 'High Basket Value' : 'Standard Basket'}
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
                {outOfStockChairs.length > 0 ? (
                  <span className="text-rose-800 font-bold bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200 flex items-center">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    {outOfStockChairs.length} Out of Stock
                  </span>
                ) : (
                  <span className="text-emerald-700 font-bold">100% Available</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Section: Revenue Performance Chart & Category Share */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Revenue Chart (2 Columns) */}
        <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-serif">
                Revenue & Sales Performance ({timeRange === 'monthly' ? new Date().getFullYear() : 'Last 7 Days'})
              </h3>
              <p className="text-xs text-slate-500">
                {timeRange === 'monthly' ? 'Monthly gross sales from customer orders' : 'Daily sales over the last 7 days'}
              </p>
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
              {activeChartData.map((d, index) => {
                const heightPercent = maxRevenue > 0 ? Math.max(Math.round((d.revenue / maxRevenue) * 100), 4) : 4;
                const isCurrent = index === activeChartData.length - 1;
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
            <span className="text-emerald-900 font-black">{leadingCategory}</span>
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
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400 font-medium">
                      No customer orders placed yet. Orders will appear here in real-time.
                    </td>
                  </tr>
                ) : (
                  orders.slice(0, 4).map((order) => {
                    const safeItems = Array.isArray(order.items) ? order.items : [];
                    const orderTotal = Number(order.totalAmount !== undefined ? order.totalAmount : (order.total || 0));
                    const orderId = order.orderNumber || order.id || order._id || 'ORD';
                    const customerName = order.customer?.name || order.shippingAddress?.fullName || 'Valued Client';
                    const customerEmail = order.customer?.email || order.shippingAddress?.email || 'N/A';
                    const status = order.fulfillmentStatus || 'Pending';

                    return (
                      <tr key={order._id || order.id || orderId} className="hover:bg-slate-50/80 transition">
                        <td className="py-3.5 px-3 font-mono font-bold text-slate-900">
                          {orderId}
                        </td>
                        <td className="py-3.5 px-3">
                          <p className="font-bold text-slate-900">{customerName}</p>
                          <p className="text-[10px] text-slate-500 truncate max-w-[140px]">
                            {customerEmail}
                          </p>
                        </td>
                        <td className="py-3.5 px-3 font-medium text-slate-600">
                          {safeItems.reduce((s, i) => s + (Number(i.quantity) || 1), 0)} Chairs
                        </td>
                        <td className="py-3.5 px-3 font-mono font-black text-emerald-800 text-sm">
                          ₹{orderTotal.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-3">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-extrabold ${status === 'Delivered'
                              ? 'bg-emerald-100 text-emerald-800'
                              : status === 'Dispatched'
                                ? 'bg-blue-100 text-blue-800'
                                : status === 'In Production'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-purple-100 text-purple-800'
                              }`}
                          >
                            {status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Catalog Availability Status Widget (1 Column) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 font-serif flex items-center space-x-2">
                <Armchair className="w-4 h-4 text-emerald-800" />
                <span>Catalog Availability</span>
              </h3>
              <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${
                outOfStockChairs.length > 0
                  ? 'bg-rose-100 text-rose-800 border-rose-200'
                  : 'bg-emerald-100 text-emerald-800 border-emerald-200'
              }`}>
                {outOfStockChairs.length > 0 ? `${outOfStockChairs.length} Out of Stock` : 'All Available'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {outOfStockChairs.length > 0 ? 'Models currently marked unavailable' : 'All chair models are ready to order'}
            </p>
          </div>

          <div className="space-y-3">
            {outOfStockChairs.length === 0 ? (
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 text-center space-y-1">
                <p className="text-xs font-bold text-emerald-900">Full Catalog Available</p>
                <p className="text-[11px] text-emerald-700">All luxury chairs are active and in stock for customers.</p>
              </div>
            ) : (
              outOfStockChairs.slice(0, 4).map((prod) => (
                <div
                  key={prod._id || prod.id}
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
                  <span className="text-[10px] font-black px-2.5 py-1 rounded-lg bg-rose-100 text-rose-800 border border-rose-200">
                    Out of Stock
                  </span>
                </div>
              ))
            )}
          </div>

          <button
            onClick={() => onNavigateTab('products')}
            className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer"
          >
            <span>Manage Catalog Availability</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
