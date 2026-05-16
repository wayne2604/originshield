export default function AdminLoading() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-gray-800/50 rounded-lg animate-pulse" />
          <div className="h-4 w-48 bg-gray-800/30 rounded-lg animate-pulse" />
        </div>
        <div className="flex gap-3">
          <div className="h-10 w-32 bg-gray-800/50 rounded-xl animate-pulse" />
          <div className="h-10 w-32 bg-gray-800/50 rounded-xl animate-pulse" />
        </div>
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-[#111827] border border-gray-800 rounded-3xl p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div className="h-10 w-10 bg-gray-800/50 rounded-2xl animate-pulse" />
              <div className="h-6 w-12 bg-gray-800/30 rounded-lg animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="h-3 w-20 bg-gray-800/30 rounded animate-pulse" />
              <div className="h-8 w-24 bg-gray-800/50 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#111827] border border-gray-800 rounded-3xl p-8 h-[450px]">
          <div className="flex justify-between mb-8">
            <div className="space-y-2">
              <div className="h-6 w-32 bg-gray-800/50 rounded animate-pulse" />
              <div className="h-4 w-48 bg-gray-800/30 rounded animate-pulse" />
            </div>
            <div className="h-8 w-8 bg-gray-800/30 rounded-lg animate-pulse" />
          </div>
          <div className="w-full h-full bg-gray-800/20 rounded-2xl animate-pulse" />
        </div>
        <div className="space-y-6">
          <div className="bg-[#111827] border border-gray-800 rounded-3xl p-6 h-[215px]">
            <div className="h-4 w-24 bg-gray-800/30 rounded mb-4 animate-pulse" />
            <div className="w-full h-24 bg-gray-800/20 rounded-xl animate-pulse" />
            <div className="mt-4 flex justify-between">
              <div className="h-8 w-16 bg-gray-800/50 rounded animate-pulse" />
              <div className="h-4 w-12 bg-gray-800/30 rounded animate-pulse" />
            </div>
          </div>
          <div className="bg-[#111827] border border-gray-800 rounded-3xl p-6 h-[215px]">
            <div className="h-4 w-24 bg-gray-800/30 rounded mb-4 animate-pulse" />
            <div className="w-full h-24 bg-gray-800/20 rounded-xl animate-pulse" />
            <div className="mt-4 flex justify-between">
              <div className="h-8 w-16 bg-gray-800/50 rounded animate-pulse" />
              <div className="h-4 w-12 bg-gray-800/30 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="bg-[#111827] border border-gray-800 rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
          <div className="h-6 w-32 bg-gray-800/50 rounded animate-pulse" />
          <div className="h-4 w-16 bg-gray-800/30 rounded animate-pulse" />
        </div>
        <div className="p-6 space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-gray-800/50 last:border-0">
              <div className="flex gap-4 items-center">
                <div className="h-8 w-16 bg-gray-800/50 rounded animate-pulse" />
                <div className="h-4 w-32 bg-gray-800/30 rounded animate-pulse" />
              </div>
              <div className="h-6 w-24 bg-gray-800/30 rounded-full animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
