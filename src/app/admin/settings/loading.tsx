export default function SettingsLoading() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl">
      <div className="space-y-2">
        <div className="h-8 w-64 bg-gray-800/50 rounded-lg animate-pulse" />
        <div className="h-4 w-96 bg-gray-800/30 rounded-lg animate-pulse" />
      </div>

      <div className="bg-[#111827] border border-gray-800 rounded-xl p-6 shadow-xl">
        <div className="h-6 w-48 bg-gray-800/50 rounded border-b border-gray-800 pb-2 mb-6 animate-pulse" />
        
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="h-3 w-40 bg-gray-800/30 rounded animate-pulse" />
            <div className="h-10 w-full max-w-sm bg-gray-800/20 rounded-lg animate-pulse" />
          </div>
          
          <div className="space-y-2">
            <div className="h-3 w-40 bg-gray-800/30 rounded animate-pulse" />
            <div className="h-10 w-full max-w-sm bg-gray-800/20 rounded-lg animate-pulse" />
          </div>

          <div className="pt-4">
            <div className="h-10 w-32 bg-emerald-500/20 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
