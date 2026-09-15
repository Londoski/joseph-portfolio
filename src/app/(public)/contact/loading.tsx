export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto px-6 lg:px-8 py-20">
      <div className="animate-pulse space-y-6">
        <div className="h-3 w-24 bg-surface rounded-full" />
        <div className="h-16 w-1/2 bg-surface rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 mt-12">
          <div className="lg:col-span-3 h-96 bg-surface rounded-2xl" />
          <div className="lg:col-span-2 space-y-4">
            <div className="h-4 w-32 bg-surface rounded-full" />
            <div className="h-4 w-40 bg-surface rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}