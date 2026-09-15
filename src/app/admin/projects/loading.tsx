export default function Loading() {
  return (
    <div className="p-8 flex flex-col items-center">
      <div className="w-full max-w-5xl animate-pulse">
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-2">
            <div className="h-7 w-48 bg-surface rounded-lg" />
            <div className="h-4 w-64 bg-surface rounded-full" />
          </div>
          <div className="h-11 w-36 bg-surface rounded-full" />
        </div>
        <div className="bg-surface border border-base rounded-2xl overflow-hidden">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-5 border-b border-base last:border-0 flex items-center gap-5"
            >
              <div className="flex-1 space-y-2">
                <div className="h-4 w-1/2 bg-base rounded-full" />
                <div className="h-3 w-1/3 bg-base rounded-full" />
              </div>
              <div className="h-6 w-20 bg-base rounded-full" />
              <div className="h-6 w-20 bg-base rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}