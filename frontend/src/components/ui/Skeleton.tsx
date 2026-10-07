export function VehicleCardSkeleton() {
  return (
    <div className="p-4 border-b border-surface-100 last:border-0">
      <div className="flex items-start gap-3">
        <div className="skeleton w-9 h-9 rounded-lg flex-shrink-0" />
        <div className="flex-1 min-w-0 space-y-2">
          <div className="skeleton h-4 w-24 rounded" />
          <div className="skeleton h-3 w-32 rounded" />
          <div className="skeleton h-5 w-16 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function SummaryCardSkeleton() {
  return (
    <div className="card p-4">
      <div className="skeleton h-3 w-20 rounded mb-3" />
      <div className="skeleton h-8 w-12 rounded" />
    </div>
  );
}
