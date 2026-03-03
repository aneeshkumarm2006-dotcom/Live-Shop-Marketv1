/* ─────────────────────────────────────────────────
   Auth Layout
   Centers auth content within the root layout shell.
   ───────────────────────────────────────────────── */

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[calc(100vh-72px)] items-center justify-center px-4 py-8 md:py-12">
      {children}
    </div>
  );
}
