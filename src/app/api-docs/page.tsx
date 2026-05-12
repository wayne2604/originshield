import Link from "next/link";

const ENDPOINTS = [
  {
    path: "/api/verify/text",
    body: '{ "text": "Long-form text to analyze..." }',
  },
  {
    path: "/api/verify/url",
    body: '{ "url": "https://example.com/article" }',
  },
  {
    path: "/api/verify/media",
    body: "multipart/form-data with a file field named file",
  },
];

export default function ApiDocsPage() {
  return (
    <main className="relative z-10 flex-1 px-4 py-24">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-sm text-[#00f0ff] hover:text-white">
          Back to scanner
        </Link>
        <h1 className="text-4xl font-bold text-white mt-6 mb-4">API Docs</h1>
        <p className="text-sm leading-7 text-slate-400 mb-8">
          These first-party Route Handlers power the scanner UI and keep
          provider credentials on the server.
        </p>
        <div className="space-y-4">
          {ENDPOINTS.map((endpoint) => (
            <div key={endpoint.path} className="glass-card p-5">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-bold text-emerald-300">POST</span>
                <code className="text-sm text-white">{endpoint.path}</code>
              </div>
              <pre className="overflow-x-auto rounded-lg bg-slate-950/70 p-4 text-xs text-slate-300">
                {endpoint.body}
              </pre>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
