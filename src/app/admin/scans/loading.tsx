export default function ScansLoading() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-gray-800/50 rounded-lg animate-pulse" />
          <div className="h-4 w-96 bg-gray-800/30 rounded-lg animate-pulse" />
        </div>
      </div>

      {/* Toolbar Skeleton */}
      <div className="flex flex-col sm:flex-row gap-4 bg-[#111827] border border-gray-800 p-4 rounded-xl">
        <div className="h-10 flex-1 bg-gray-800/30 rounded-lg animate-pulse" />
        <div className="h-10 w-24 bg-gray-800/30 rounded-lg animate-pulse" />
      </div>

      {/* Table Skeleton */}
      <div className="bg-[#111827] border border-gray-800 rounded-xl overflow-hidden shadow-xl">
        <div className="bg-[#0e0e1a]/50 h-12 border-b border-gray-800 flex items-center px-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-3 flex-1 bg-gray-800/30 rounded animate-pulse" />
          ))}
        </div>
        <div className="p-0">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="px-6 py-5 border-b border-gray-800/50 flex items-center gap-4">
              <div className="h-4 w-24 bg-gray-800/50 rounded animate-pulse" />
              <div className="h-4 w-24 bg-gray-800/30 rounded animate-pulse" />
              <div className="h-6 w-16 bg-gray-800/30 rounded-lg animate-pulse" />
              <div className="h-4 w-32 bg-gray-800/50 rounded animate-pulse" />
              <div className="h-4 flex-1 bg-gray-800/20 rounded animate-pulse" />
              <div className="h-4 w-24 bg-gray-800/30 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
