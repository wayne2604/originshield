import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="relative z-10 flex-1 px-4 py-24">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-sm text-[#00f0ff] hover:text-white">
          Back to scanner
        </Link>
        <h1 className="text-4xl font-bold text-white mt-6 mb-4">
          Terms of Use
        </h1>
        <div className="space-y-5 text-sm leading-7 text-slate-400">
          <p>
            OriginShield provides probabilistic verification signals. Results
            should be reviewed alongside source context and human judgment.
          </p>
          <p>
            You are responsible for having rights to submit content for
            analysis and for complying with applicable platform and provider
            policies.
          </p>
          <p>
            Abuse of the API, attempts to bypass rate limits, or misuse of scan
            results may result in access restrictions.
          </p>
        </div>
      </div>
    </main>
  );
}
