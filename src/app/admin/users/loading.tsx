export default function UsersLoading() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-gray-800/50 rounded-lg animate-pulse" />
          <div className="h-4 w-72 bg-gray-800/30 rounded-lg animate-pulse" />
        </div>
      </div>

      {/* Toolbar Skeleton */}
      <div className="flex flex-col sm:flex-row gap-4 bg-[#111827] border border-gray-800 p-4 rounded-xl">
        <div className="h-10 w-full max-w-md bg-gray-800/30 rounded-lg animate-pulse" />
      </div>

      {/* Table Skeleton */}
      <div className="bg-[#111827] border border-gray-800 rounded-xl overflow-hidden shadow-xl">
        <div className="bg-[#0e0e1a]/50 h-12 border-b border-gray-800 flex items-center px-6 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-3 flex-1 bg-gray-800/30 rounded animate-pulse" />
          ))}
        </div>
        <div className="p-0">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="px-6 py-4 border-b border-gray-800/50 flex items-center gap-4">
              <div className="flex items-center gap-3 flex-1">
                <div className="h-9 w-9 rounded-full bg-gray-800/50 animate-pulse" />
                <div className="space-y-1">
                  <div className="h-4 w-32 bg-gray-800/50 rounded animate-pulse" />
                  <div className="h-3 w-48 bg-gray-800/20 rounded animate-pulse" />
                </div>
              </div>
              <div className="h-6 w-16 bg-gray-800/30 rounded-lg animate-pulse" />
              <div className="h-4 w-12 bg-gray-800/30 rounded animate-pulse" />
              <div className="h-4 w-24 bg-gray-800/30 rounded animate-pulse" />
              <div className="h-4 w-24 bg-gray-800/30 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
