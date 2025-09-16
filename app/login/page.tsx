import Link from "next/link";
import Image from "next/image";
import AuthForm from "@/components/AuthForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* Mobile Header */}
      <header className="lg:hidden border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/globe.svg" alt="ERP Logo" width={24} height={24} />
            <span className="text-lg font-semibold text-slate-900">ERP</span>
          </Link>
          <Link href="/register" className="text-sm text-slate-600 hover:text-slate-900">
            Sign up
          </Link>
        </div>
      </header>

      <div className="lg:grid lg:grid-cols-2 lg:min-h-screen">
        {/* Left Side - Branding (Desktop) */}
        <div className="hidden lg:flex flex-col justify-center px-8 xl:px-12 bg-gradient-to-br from-slate-900 to-slate-800 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:20px_20px]" />
          </div>
          
          <div className="relative z-10 max-w-md">
            <div className="flex items-center gap-3 mb-8">
              <Image src="/globe.svg" alt="ERP Logo" width={32} height={32} className="invert" />
              <span className="text-2xl font-bold">ERP System</span>
            </div>
            
            <h1 className="text-3xl xl:text-4xl font-bold mb-4">
              Welcome back to your dashboard
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed mb-8">
              Access your personalized workspace with secure authentication and role-based permissions.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-slate-300">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Secure JWT authentication</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>Role-based access control</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span>Modern, responsive interface</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex flex-col justify-center px-4 py-8 sm:px-6 lg:px-8 xl:px-12">
          <div className="mx-auto w-full max-w-md">
            {/* Desktop Header */}
            <div className="hidden lg:block mb-8">
              <Link href="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to home
              </Link>
              <h2 className="text-2xl font-bold text-slate-900">Sign in to your account</h2>
              <p className="mt-2 text-slate-600">Enter your credentials to access your dashboard</p>
            </div>

            {/* Mobile Header */}
            <div className="lg:hidden text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Image src="/globe.svg" alt="ERP Logo" width={28} height={28} />
                <span className="text-xl font-bold text-slate-900">ERP</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Welcome back</h2>
              <p className="mt-2 text-slate-600">Sign in to continue</p>
            </div>

            <AuthForm mode="login" />

            {/* Footer Links */}
            <div className="mt-8 text-center">
              <p className="text-sm text-slate-600">
                Don't have an account?{" "}
                <Link href="/register" className="font-semibold text-slate-900 hover:text-slate-700">
                  Create one here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
