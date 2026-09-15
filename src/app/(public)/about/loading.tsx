export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto px-6 lg:px-8 py-20">
      <div className="animate-pulse space-y-6">
        <div className="h-3 w-24 bg-surface rounded-full" />
        <div className="h-20 w-2/3 bg-surface rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 mt-12">
          <div className="lg:col-span-3 space-y-4">
            <div className="h-8 w-3/4 bg-surface rounded-lg" />
            <div className="h-4 w-full bg-surface rounded-full" />
            <div className="h-4 w-5/6 bg-surface rounded-full" />
          </div>
          <div className="lg:col-span-2">
            <div className="aspect-square bg-surface rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}