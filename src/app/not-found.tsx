import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="text-center space-y-4">
        <p className="text-8xl font-bold text-primary/20 font-[family-name:var(--font-display)]">404</p>
        <h1 className="text-2xl font-bold">Lost in the Universe</h1>
        <p className="text-muted-foreground">This chapter doesn&apos;t exist in the ML Systems constellation.</p>
        <Link
          href="/"
          className="inline-block mt-4 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors"
        >
          Return to Universe
        </Link>
      </div>
    </main>
  );
}
