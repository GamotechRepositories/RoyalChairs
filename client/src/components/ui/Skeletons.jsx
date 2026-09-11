// Premium Luxury Skeleton Loaders for RoyalChairs Client Storefront

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs animate-pulse flex flex-col h-full">
      {/* Image box placeholder */}
      <div className="relative aspect-square w-full bg-slate-200/70 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between space-y-3">
        <div className="space-y-2">
          {/* Category & Tag pill */}
          <div className="flex items-center space-x-2">
            <div className="h-3 w-16 bg-slate-200 rounded-full" />
            <div className="h-3 w-12 bg-slate-200/60 rounded-full" />
          </div>

          {/* Title */}
          <div className="h-4 bg-slate-200 rounded-md w-4/5" />
          <div className="h-3 bg-slate-200/70 rounded-md w-2/3" />
        </div>

        {/* Color swatches */}
        <div className="flex items-center space-x-1.5 py-1">
          <div className="w-3.5 h-3.5 rounded-full bg-slate-200" />
          <div className="w-3.5 h-3.5 rounded-full bg-slate-200" />
          <div className="w-3.5 h-3.5 rounded-full bg-slate-200" />
        </div>

        {/* Price & Action button */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <div className="space-y-1">
            <div className="h-4 w-16 bg-slate-300 rounded-md" />
            <div className="h-3 w-10 bg-slate-200 rounded-md" />
          </div>
          <div className="h-8 w-20 bg-slate-200 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function CategoryCardSkeleton() {
  return (
    <div className="flex flex-col items-center space-y-2.5 animate-pulse min-w-[100px]">
      <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-slate-200/80 shadow-xs overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
      </div>
      <div className="h-3 w-14 bg-slate-200 rounded-full" />
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function OrderCardSkeleton() {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs animate-pulse space-y-4 p-5">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-3">
          <div className="h-4 w-28 bg-slate-200 rounded-md" />
          <div className="h-3 w-20 bg-slate-200/60 rounded-md" />
        </div>
        <div className="h-6 w-24 bg-slate-200 rounded-full" />
      </div>

      {/* Logistics Banner */}
      <div className="h-14 bg-slate-100/80 rounded-2xl" />

      {/* Item Row */}
      <div className="flex items-center space-x-4 py-2">
        <div className="w-16 h-16 rounded-xl bg-slate-200 shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-slate-200 rounded w-1/3" />
          <div className="h-3 bg-slate-200/70 rounded w-1/4" />
        </div>
        <div className="h-4 w-16 bg-slate-200 rounded" />
      </div>

      {/* Footer Total */}
      <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
        <div className="h-3 w-32 bg-slate-200 rounded" />
        <div className="h-5 w-24 bg-slate-300 rounded" />
      </div>
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Gallery Placeholder */}
        <div className="space-y-4">
          <div className="aspect-4/3 w-full bg-slate-200 rounded-3xl" />
          <div className="flex space-x-3">
            <div className="w-20 h-20 bg-slate-200 rounded-2xl" />
            <div className="w-20 h-20 bg-slate-200 rounded-2xl" />
            <div className="w-20 h-20 bg-slate-200 rounded-2xl" />
          </div>
        </div>

        {/* Details Placeholder */}
        <div className="space-y-5">
          <div className="h-3 w-24 bg-slate-200 rounded-full" />
          <div className="h-8 w-4/5 bg-slate-200 rounded-xl" />
          <div className="h-6 w-32 bg-slate-300 rounded-lg" />
          <div className="space-y-2 pt-2">
            <div className="h-3 bg-slate-200 rounded w-full" />
            <div className="h-3 bg-slate-200 rounded w-5/6" />
            <div className="h-3 bg-slate-200 rounded w-2/3" />
          </div>
          <div className="h-12 bg-slate-200 rounded-2xl w-full pt-4" />
        </div>
      </div>
    </div>
  );
}

export default {
  ProductCardSkeleton,
  CategoryCardSkeleton,
  ProductGridSkeleton,
  OrderCardSkeleton,
  ProductDetailSkeleton,
};
