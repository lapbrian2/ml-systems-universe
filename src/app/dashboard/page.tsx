import Link from 'next/link';

export default function DashboardPage() {
  return (
    <main className="min-h-screen p-8 max-w-6xl mx-auto">
      <Link href="/" className="text-muted-foreground hover:text-foreground text-sm mb-8 inline-block">
        &larr; Back to Universe
      </Link>

      <div className="space-y-6">
        <h1 className="text-4xl font-bold font-[family-name:var(--font-display)]">
          Progress Dashboard
        </h1>
        <p className="text-muted-foreground text-lg">
          Track your journey through the ML Systems Universe.
        </p>

        <div className="glass-panel rounded-xl p-8 text-center">
          <p className="text-muted-foreground">
            Full dashboard with progress tracking, badges, and analytics coming soon.
          </p>
        </div>
      </div>
    </main>
  );
}
