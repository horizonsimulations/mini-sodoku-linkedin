import Link from "next/link";
import { siteConfig } from "@/config/site";

export const metadata = {
  title: "Community Levels · Mini Sudoku Archive",
  description:
    "Catch up on community submitted LinkedIn Mini Sudoku puzzles and learn how to share your own.",
};

const steps = [
  "Replay the current official puzzle on the home page.",
  "Open the Level Builder to craft a solved 6×6 grid that matches LinkedIn’s rules.",
  "Export the code and create a new file in src/levels via GitHub’s web editor.",
  "Open a pull request – we’ll tag it as community-submitted and ship it once reviewed.",
];

export default function CommunityPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-8 bg-slate-50 px-4 py-10 sm:px-8 lg:px-12">
      <section className="space-y-3 rounded-3xl border border-purple-100 bg-white p-8 shadow-sm">
        <p className="text-xs uppercase tracking-[0.4em] text-purple-500">
          Community levels
        </p>
        <h1 className="text-3xl font-semibold text-slate-900">
          Every great streak deserves a rerun.
        </h1>
        <p className="text-sm text-slate-600">
          This page highlights puzzles contributed by the community. We curate
          the queue daily, merging one featured level into the official archive.
          Want your puzzle to appear here? Follow the steps below and we&apos;ll
          review it within a day.
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900">
            Submission checklist
          </h2>
          <ol className="space-y-2 text-sm text-slate-600">
            {steps.map((step, index) => (
              <li key={step} className="flex gap-2">
                <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
          <p className="text-xs text-slate-500">
            Pro tip: press <code>.</code> on any GitHub repo page to open the
            web editor instantly.
          </p>
        </div>
        <div className="space-y-4 rounded-3xl border border-slate-200 bg-slate-900/80 p-6 text-slate-50">
          <h2 className="text-lg font-semibold text-white">
            Ready to submit?
          </h2>
          <p className="text-sm text-slate-100">
            Once your level file is created, open a pull request. Our workflow
            automatically adds your GitHub username to the level metadata so the
            archive can highlight your contribution.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/level-builder"
              className="rounded-full bg-white px-4 py-2 text-center text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              Build a level
            </Link>
            <a
              href={siteConfig.repoUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Open repository
            </a>
            <a
              href={siteConfig.communityDiscussionUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/40 px-4 py-2 text-center text-sm font-semibold text-white/90 transition hover:bg-white/10"
            >
              Start a discussion
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

