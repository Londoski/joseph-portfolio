export default function Loading() {
  return (
    <div className="p-8 flex flex-col items-center">
      <div className="w-full max-w-5xl animate-pulse">
        <div className="flex items-center justify-between mb-8">
          <div className="h-8 w-48 bg-surface rounded-lg" />
          <div className="h-11 w-40 bg-surface rounded-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-surface border border-base rounded-2xl p-6 space-y-4">
              <div className="h-3 w-full bg-base rounded-full" />
              <div className="h-3 w-5/6 bg-base rounded-full" />
              <div className="h-3 w-4/6 bg-base rounded-full" />
              <div className="flex items-center gap-3 mt-6">
                <div className="w-10 h-10 bg-base rounded-full" />
                <div className="h-3 w-24 bg-base rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}