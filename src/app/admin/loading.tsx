export default function AdminLoading() {
  return (
    <div className="p-8 flex flex-col items-center">
      <div className="w-full max-w-5xl animate-pulse">
        {/* Header skeleton */}
        <div className="mb-8 space-y-3">
          <div className="h-8 w-64 bg-surface rounded-lg" />
          <div className="h-4 w-80 bg-surface rounded-full" />
        </div>

        {/* Stats grid skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-surface border border-base rounded-2xl p-6 space-y-3"
            >
              <div className="h-3 w-24 bg-base rounded-full" />
              <div className="h-8 w-16 bg-base rounded-lg" />
            </div>
          ))}
        </div>

        {/* Table skeleton */}
        <div className="mt-8 bg-surface border border-base rounded-2xl overflow-hidden">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="p-4 border-b border-base last:border-0 flex items-center gap-4"
            >
              <div className="w-20 h-14 bg-base rounded-lg flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-1/3 bg-base rounded-full" />
                <div className="h-3 w-1/2 bg-base rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}