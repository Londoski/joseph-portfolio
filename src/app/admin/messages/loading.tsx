export default function Loading() {
  return (
    <div className="p-8 flex flex-col items-center">
      <div className="w-full max-w-5xl animate-pulse">
        <div className="h-8 w-48 bg-surface rounded-lg mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-surface border border-base rounded-2xl overflow-hidden">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-4 border-b border-base last:border-0 space-y-2">
                <div className="h-4 w-3/4 bg-base rounded-full" />
                <div className="h-3 w-1/2 bg-base rounded-full" />
              </div>
            ))}
          </div>
          <div className="lg:col-span-2 bg-surface border border-base rounded-2xl p-8 space-y-4">
            <div className="h-6 w-1/3 bg-base rounded-full" />
            <div className="h-4 w-1/2 bg-base rounded-full" />
            <div className="h-32 w-full bg-base rounded-xl mt-6" />
          </div>
        </div>
      </div>
    </div>
  );
}