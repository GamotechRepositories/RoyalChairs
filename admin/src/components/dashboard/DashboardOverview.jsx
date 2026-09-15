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
  Calendar,
  ChevronDown,
} from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import { StatCardSkeleton, TableRowSkeleton } from '../ui/AdminSkeletons';

// Helper to format large revenue values compactly (e.g. ₹70k, ₹52.5k, ₹1.5L)
const formatCompactRevenue = (val) => {
  if (!val || val === 0) return '₹0';
  const num = Number(val);
  if (isNaN(num)) return '₹0';
  if (num >= 10000000) {
    const formatted = (num / 10000000).toFixed(1).replace(/\.0$/, '');
    return `₹${formatted}Cr`;
  }
  if (num >= 100000) {
    const formatted = (num / 100000).toFixed(1).replace(/\.0$/, '');
    return `₹${formatted}L`;
  }
  if (num >= 1000) {
    const formatted = (num / 1000).toFixed(1).replace(/\.0$/, '');
    return `₹${formatted}k`;
  }
  return `₹${num}`;
};

export default function DashboardOverview({ onNavigateTab, onOpenNewProductModal }) {
  const { products, orders, customers, coupons, reviews, isLoading } = useAdminData();

  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  // 1. Core Dynamic Metrics Computed 100% from MongoDB Real Data
  const totalRevenue = orders.reduce((sum, o) => {
    const val = Number(o.totalAmount !== undefined ? o.totalAmount : (o.total || 0));
    return sum + (isNaN(val) ? 0 : val);
  }, 0);

  const activeOrdersCount = orders.length;
  const todayStr = new Date().toDateString();
  const todaysOrdersCount = orders.filter((o) => {
    const d = new Date(o.createdAt || o.date);
    return !isNaN(d.getTime()) && d.toDateString() === todayStr;
  }).length;
  const outOfStockChairs = products.filter((p) => p.isAvailable === false || Number(p.stock) === 0);
  const pendingOrders = orders.filter((o) => {
    const st = (o.fulfillmentStatus || o.orderStatus || '').toLowerCase();
    return st === 'pending' || st === 'placed' || st === 'in production' || st === 'confirmed';
  });

  // Compute available years from real orders data + current year
  const availableYears = useMemo(() => {
    const yearsSet = new Set([currentYear, currentYear - 1, currentYear - 2]);
    orders.forEach((o) => {
      const d = new Date(o.createdAt || o.date);
      if (!isNaN(d.getTime())) {
        yearsSet.add(d.getFullYear());
      }
    });
    return Array.from(yearsSet).sort((a, b) => b - a);
  }, [orders, currentYear]);

  // 2. Dynamic 12-Month Performance Chart (Jan - Dec) for Selected Year
  const monthlyData = useMemo(() => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const fullMonthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ];
    const now = new Date();
    const isCurrentYear = Number(selectedYear) === now.getFullYear();
    const currentMonthIdx = isCurrentYear ? now.getMonth() : -1;

    const months = monthNames.map((name, idx) => ({
      label: name,
      fullName: `${fullMonthNames[idx]} ${selectedYear}`,
      monthIndex: idx,
      year: selectedYear,
      isCurrentMonth: idx === currentMonthIdx,
      revenue: 0,
      orders: 0,
    }));

    // Aggregate real orders into their respective calendar month (Jan - Dec) for selectedYear
    orders.forEach((o) => {
      const oDate = new Date(o.createdAt || o.date || now);
      if (isNaN(oDate.getTime())) return;
      const oMonth = oDate.getMonth();
      const oYear = oDate.getFullYear();
      if (oYear === Number(selectedYear) && oMonth >= 0 && oMonth < 12) {
        const amt = Number(o.totalAmount !== undefined ? o.totalAmount : (o.total || 0));
        months[oMonth].revenue += isNaN(amt) ? 0 : amt;
        months[oMonth].orders += 1;
      }
    });

    return months;
  }, [orders, selectedYear]);

  const activeChartData = monthlyData;
  const rawMaxOrders = Math.max(...activeChartData.map((d) => d.orders), 0);
  const rawMaxRevenue = Math.max(...activeChartData.map((d) => d.revenue), 0);

  // Clean scale ceilings for dual axes
  const maxOrdersScale = rawMaxOrders > 0 ? (rawMaxOrders <= 5 ? 5 : Math.ceil(rawMaxOrders / 5) * 5) : 5;
  const maxRevenueScale = rawMaxRevenue > 0 ? (rawMaxRevenue <= 10000 ? 10000 : Math.ceil(rawMaxRevenue / 10000) * 10000) : 50000;

  const totalYearRevenue = monthlyData.reduce((s, d) => s + d.revenue, 0);
  const totalYearOrders = monthlyData.reduce((s, d) => s + d.orders, 0);

  // Month-over-month growth calculations
  const nowMonthIdx = new Date().getMonth();
  const currentMonthRevenue = monthlyData[nowMonthIdx]?.revenue || 0;
  const prevMonthRevenue = nowMonthIdx > 0 ? monthlyData[nowMonthIdx - 1]?.revenue || 0 : 0;
  const revenueGrowth = prevMonthRevenue > 0
    ? Math.round(((currentMonthRevenue - prevMonthRevenue) / prevMonthRevenue) * 100)
    : null;

  const currentMonthOrders = monthlyData[nowMonthIdx]?.orders || 0;
  const prevMonthOrders = nowMonthIdx > 0 ? monthlyData[nowMonthIdx - 1]?.orders || 0 : 0;
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
            </div>
          </div>

          {/* Card 2: Total Orders */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md hover:border-emerald-300 transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                Total Orders
              </span>
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800 shadow-xs">
                <ShoppingBag className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
                {activeOrdersCount}
              </h3>
            </div>
          </div>

          {/* Card 3: Today's Orders */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md hover:border-emerald-300 transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                Today's Orders
              </span>
              <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shadow-xs">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
                {todaysOrdersCount}
              </h3>
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
            </div>
          </div>
        </div>
      )}

      {/* Analytics Section: 12-Month Dual Bar Performance Chart & Category Share */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main 12-Column Dual-Bar Chart (Orders & Revenue) */}
        <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-serif">
                Order & Revenue Analytics
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Annual monthly performance data
              </p>
            </div>

            {/* Top Right: Year Dropdown FIRST, Legend SECOND */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 self-start sm:self-auto">
              {/* 1. Year Dropdown */}
              <div className="relative">
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  aria-label="Filter by Year"
                  className="appearance-none bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold pl-8 pr-7 py-1.5 rounded-xl border border-slate-200 shadow-2xs focus:outline-none focus:ring-2 focus:ring-emerald-600 cursor-pointer transition"
                >
                  {availableYears.map((yr) => (
                    <option key={yr} value={yr}>
                      {yr}
                    </option>
                  ))}
                </select>
                <Calendar className="w-3.5 h-3.5 text-emerald-800 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* 2. Legend */}
              <div className="flex items-center space-x-3 text-xs bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                {/* Green Legend (Orders) */}
                <div className="flex items-center space-x-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 shadow-2xs" />
                  <span className="font-bold text-slate-700 text-[11px]">Orders (Qty)</span>
                </div>

                {/* Yellow Legend (Revenue) */}
                <div className="flex items-center space-x-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-2xs" />
                  <span className="font-bold text-slate-700 text-[11px]">Revenue (₹)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Dual Bar Chart with Dedicated Side Y-Axes and Axis Grid Lines */}
          <div className="overflow-x-auto no-scrollbar pt-2">
            <div className="min-w-[720px] flex items-stretch">
              {/* Left Y-Axis: Orders (Green Scale) */}
              <div className="w-8 sm:w-9 flex flex-col justify-between items-end pr-2.5 text-[10px] sm:text-[11px] font-mono font-bold text-emerald-700 pb-8 pt-2 select-none shrink-0">
                <span>{maxOrdersScale}</span>
                <span>{Math.round(maxOrdersScale * 0.75)}</span>
                <span>{Math.round(maxOrdersScale * 0.5)}</span>
                <span>{Math.round(maxOrdersScale * 0.25)}</span>
                <span>0</span>
              </div>

              {/* Center Canvas: Grid lines + 12-Month Bars */}
              <div className="flex-1 relative mx-2">
                {/* Background Horizontal Grid Lines (Only dashed grid lines above 0, no solid line at bottom) */}
                <div className="absolute inset-x-0 top-2 bottom-8 pointer-events-none flex flex-col justify-between">
                  <div className="w-full border-b border-dashed border-slate-200/80" />
                  <div className="w-full border-b border-dashed border-slate-200/80" />
                  <div className="w-full border-b border-dashed border-slate-200/80" />
                  <div className="w-full border-b border-dashed border-slate-200/80" />
                </div>

                {/* 12 Month Dual-Column Bars Container - Increased Height */}
                <div className="h-80 flex items-end justify-between px-1 sm:px-2 relative z-10 pb-8">
                  {activeChartData.map((d, index) => {
                    const ordersHeightPct =
                      maxOrdersScale > 0
                        ? Math.max(Math.round((d.orders / maxOrdersScale) * 100), d.orders > 0 ? 6 : 2)
                        : 2;

                    const revenueHeightPct =
                      maxRevenueScale > 0
                        ? Math.max(Math.round((d.revenue / maxRevenueScale) * 100), d.revenue > 0 ? 6 : 2)
                        : 2;

                    // Anchor tooltips to left or right when near chart edges so they don't overflow
                    const isNearRight = index >= activeChartData.length - 2;
                    const isNearLeft = index === 0;

                    return (
                      <div
                        key={d.label + index}
                        className="flex-1 flex flex-col items-center h-full justify-end group relative cursor-pointer px-0.5"
                      >
                        {/* Interactive Column Hover Highlight Box */}
                        <div className="absolute inset-x-0.5 inset-y-0 bg-transparent group-hover:bg-slate-100/90 rounded-2xl transition border border-transparent group-hover:border-slate-200 -z-10" />

                        {/* Tooltip Card on Hover */}
                        <div
                          className={`absolute -top-14 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-30 bg-slate-900 text-white shadow-2xl rounded-xl p-2.5 min-w-[130px] text-left transform -translate-y-1 ${
                            isNearRight
                              ? 'right-0'
                              : isNearLeft
                                ? 'left-0'
                                : 'left-1/2 -translate-x-1/2'
                          }`}
                        >
                          <div className="text-[11px] font-bold text-amber-300 border-b border-slate-700/80 pb-1 mb-1.5 flex items-center justify-between">
                            <span>{d.label} {selectedYear}</span>
                            {d.isCurrentMonth && (
                              <span className="text-[9px] bg-emerald-700 text-white px-1.5 py-0.2 rounded font-black">
                                Now
                              </span>
                            )}
                          </div>
                          <div className="space-y-1 text-[10px]">
                            <div className="flex items-center justify-between text-emerald-300 font-bold">
                              <span className="flex items-center space-x-1.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block shrink-0" />
                                <span>Orders:</span>
                              </span>
                              <span className="font-mono font-black">{d.orders}</span>
                            </div>
                            <div className="flex items-center justify-between text-amber-300 font-bold">
                              <span className="flex items-center space-x-1.5">
                                <span className="w-2 h-2 rounded-full bg-amber-400 inline-block shrink-0" />
                                <span>Sales:</span>
                              </span>
                              <span className="font-mono font-black">₹{d.revenue.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>

                        {/* Dual Bars: Green (Orders) & Yellow (Revenue) - Touching Side-by-Side */}
                        <div className="w-full flex items-end justify-center gap-0 h-full pb-1">
                          {/* 1. Green Column (Orders) */}
                          <div className="w-3.5 sm:w-4 md:w-4.5 flex flex-col justify-end h-full">
                            <div
                              style={{ height: `${ordersHeightPct}%` }}
                              className={`w-full rounded-tl-md transition-all duration-500 ${
                                d.orders > 0
                                  ? 'bg-gradient-to-t from-emerald-700 via-emerald-600 to-emerald-400 shadow-xs group-hover:brightness-110'
                                  : 'bg-slate-200/60 rounded-t-xs'
                              }`}
                              title={`Orders: ${d.orders}`}
                            />
                          </div>

                          {/* 2. Yellow Column (Revenue / Sales) */}
                          <div className="w-3.5 sm:w-4 md:w-4.5 flex flex-col justify-end h-full">
                            <div
                              style={{ height: `${revenueHeightPct}%` }}
                              className={`w-full rounded-tr-md transition-all duration-500 ${
                                d.revenue > 0
                                  ? 'bg-gradient-to-t from-amber-600 via-amber-500 to-yellow-300 shadow-xs group-hover:brightness-110'
                                  : 'bg-slate-200/60 rounded-t-xs'
                              }`}
                              title={`Revenue: ₹${d.revenue.toLocaleString()}`}
                            />
                          </div>
                        </div>

                        {/* Month Label below the X-axis */}
                        <span
                          className={`text-[10.5px] font-bold mt-2 truncate transition ${
                            d.isCurrentMonth
                              ? 'text-emerald-950 font-black scale-105'
                              : 'text-slate-500 group-hover:text-slate-900'
                          }`}
                        >
                          {d.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Y-Axis: Sales Revenue in 70k format (Amber Scale) */}
              <div className="w-14 sm:w-16 flex flex-col justify-between items-start pl-2.5 text-[10px] sm:text-[11px] font-mono font-bold text-amber-700 pb-8 pt-2 select-none shrink-0">
                <span>{formatCompactRevenue(maxRevenueScale)}</span>
                <span>{formatCompactRevenue(Math.round(maxRevenueScale * 0.75))}</span>
                <span>{formatCompactRevenue(Math.round(maxRevenueScale * 0.5))}</span>
                <span>{formatCompactRevenue(Math.round(maxRevenueScale * 0.25))}</span>
                <span>₹0</span>
              </div>
            </div>
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
        {/* Recent Orders Table (2 Columns) - Displays Last 5 Orders */}
        <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-bold text-slate-900 font-serif">Recent Customer Orders</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Last 5
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Live order fulfillment stream</p>
            </div>
            <button
              onClick={() => onNavigateTab('orders')}
              className="text-xs text-emerald-800 hover:text-emerald-950 font-bold flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
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
                  [...orders]
                    .sort((a, b) => new Date(b.createdAt || b.date || 0) - new Date(a.createdAt || a.date || 0))
                    .slice(0, 5)
                    .map((order) => {
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

          {orders.length > 5 && (
            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={() => onNavigateTab('orders')}
                className="w-full py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
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
