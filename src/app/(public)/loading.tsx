export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
      <div className="animate-pulse space-y-6">
        <div className="h-3 w-24 bg-surface rounded-full" />
        <div className="h-16 w-3/4 bg-surface rounded-xl" />
        <div className="h-4 w-full bg-surface rounded-full mt-8" />
        <div className="h-4 w-5/6 bg-surface rounded-full" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="aspect-video bg-surface rounded-2xl" />
          <div className="aspect-video bg-surface rounded-2xl" />
          <div className="aspect-video bg-surface rounded-2xl" />
        </div>
      </div>
    </div>
  );
}