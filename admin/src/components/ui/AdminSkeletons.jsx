// Premium Luxury Skeleton Loaders for RoyalChairs Admin Panel

export function StatCardSkeleton() {
  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs animate-pulse space-y-4">
      <div className="flex items-center justify-between">
        <div className="w-11 h-11 rounded-2xl bg-slate-200/80" />
        <div className="h-4 w-12 bg-slate-200/60 rounded-full" />
      </div>
      <div className="space-y-1.5">
        <div className="h-3 w-20 bg-slate-200 rounded" />
        <div className="h-7 w-28 bg-slate-300 rounded-lg" />
      </div>
      <div className="h-3 w-36 bg-slate-200/60 rounded" />
    </div>
  );
}

export function TableRowSkeleton({ cols = 6 }) {
  return (
    <tr className="animate-pulse border-b border-slate-100">
      {Array.from({ length: cols }).map((_, idx) => (
        <td key={idx} className="py-4 px-4">
          <div className={`h-4 bg-slate-200/80 rounded ${idx === 0 ? 'w-24' : idx === 1 ? 'w-32' : 'w-16'}`} />
        </td>
      ))}
    </tr>
  );
}

export function TableSkeleton({ rows = 5, cols = 6 }) {
  return (
    <tbody className="divide-y divide-slate-100">
      {Array.from({ length: rows }).map((_, rIdx) => (
        <TableRowSkeleton key={rIdx} cols={cols} />
      ))}
    </tbody>
  );
}

export function CategoryCardSkeletonAdmin() {
  return (
    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 animate-pulse space-y-3">
      <div className="w-full aspect-video rounded-xl bg-slate-200" />
      <div className="h-4 w-2/3 bg-slate-200 rounded" />
      <div className="flex justify-between items-center pt-2">
        <div className="h-3 w-12 bg-slate-200 rounded" />
        <div className="h-6 w-16 bg-slate-200 rounded-lg" />
      </div>
    </div>
  );
}

export default {
  StatCardSkeleton,
  TableRowSkeleton,
  TableSkeleton,
  CategoryCardSkeletonAdmin,
};
