import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      {/* Minimal Top Bar */}
      <header className="border-b border-slate-200/70 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image src="/globe.svg" alt="ERP Logo" width={28} height={28} className="shrink-0" />
            <span className="text-base font-semibold tracking-tight text-slate-900">ERP</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900">Login</Link>
            <Link href="/register" className="px-4 py-2 rounded-md bg-slate-900 text-white text-sm font-semibold hover:bg-black transition">Get started</Link>
          </div>
        </div>
      </header>

      {/* Section 1: Compact Hero */}
      <section className="relative">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(55%_40%_at_50%_0%,rgba(2,6,23,0.06)_0%,rgba(255,255,255,0)_70%)]" />
        </div>
        {/* Subtle decorative logo */}
        <div className="hidden md:block absolute right-6 top-10 opacity-10">
          <Image src="/vercel.svg" alt="Decorative" width={120} height={120} />
        </div>
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20 lg:py-24">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
              A refined ERP starter for modern operations
            </h1>
            <p className="mt-4 text-base md:text-lg text-slate-600 leading-relaxed">
              Secure authentication, role‑based access, and clean dashboards for admins and drivers. Built on Next.js and MongoDB.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/register" className="inline-flex items-center justify-center rounded-md bg-slate-900 px-5 py-2.5 text-white text-sm font-semibold hover:bg-black transition">
                Create account
              </Link>
              <Link href="/login" className="inline-flex items-center justify-center rounded-md px-5 py-2.5 text-slate-900 text-sm font-semibold border border-slate-200 bg-white hover:bg-slate-50 transition">
                Login
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Subtle Highlights (compact) */}
      <section className="pb-16 md:pb-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="rounded-xl border border-black bg-white p-5">
              <p className="text-xs uppercase tracking-wide text-slate-500">Access</p>
              <p className="mt-1 text-slate-900 font-semibold">Admin & Driver roles</p>
            </div>
            <div className="rounded-xl border border-black bg-white p-5">
              <p className="text-xs uppercase tracking-wide text-slate-500">Security</p>
              <p className="mt-1 text-slate-900 font-semibold">JWT auth, bcrypt hashes</p>
            </div>
            <div className="rounded-xl border border-black bg-white p-5">
              <p className="text-xs uppercase tracking-wide text-slate-500">Foundation</p>
              <p className="mt-1 text-slate-900 font-semibold">Next.js + MongoDB</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
