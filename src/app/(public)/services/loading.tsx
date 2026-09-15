export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto px-6 lg:px-8 py-20">
      <div className="animate-pulse space-y-6">
        <div className="h-3 w-24 bg-surface rounded-full" />
        <div className="h-16 w-1/2 bg-surface rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-40 bg-surface rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}