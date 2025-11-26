import { notFound } from "next/navigation";
import { LevelGame } from "@/components/LevelGame";
import { levels } from "@/levels";

interface LevelPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return levels.map((level) => ({ slug: level.slug }));
}

export default async function LevelDetailPage({ params }: LevelPageProps) {
  const { slug } = await params;
  const levelExists = levels.some((level) => level.slug === slug);

  if (!levelExists && levels.length === 0) {
    notFound();
  }

  const initialSlug = levelExists ? slug : levels[0]?.slug;

  if (!initialSlug) {
    notFound();
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-8 bg-slate-50 px-4 py-10 sm:px-8 lg:px-12">
      <LevelGame initialSlug={initialSlug} allLevels={levels} />
    </main>
  );
}

