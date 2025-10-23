"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { HiEye, HiEyeOff } from "react-icons/hi";
import Image from "next/image";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    const nextFieldErrors: { email?: string; password?: string } = {};

    // Simple inline validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      nextFieldErrors.email = "Email không hợp lệ";
    }
    if (!password || password.length < 6) {
      nextFieldErrors.password = "Mật khẩu tối thiểu 6 ký tự";
    }

    if (Object.keys(nextFieldErrors).length > 0) {
      setFieldErrors(nextFieldErrors);
      return;
    }

    setFieldErrors({});
    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.ok) {
      toast.success("Đăng nhập thành công");
      router.push("/main");
    } else {
      setFormError("Email hoặc mật khẩu không đúng. Vui lòng thử lại.");
      toast.error("Đăng nhập thất bại");
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Left side - Hero section */}
      <div className="hidden lg:flex w-1/2 relative z-10 items-center justify-center p-12">
        <div className="max-w-md">
          <div className="mb-8">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 shadow-2xl">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <h1 className="text-6xl font-black text-white mb-6 leading-tight">
            Welcome<br />Back!
          </h1>
          <p className="text-xl text-white/90 leading-relaxed">
            Access your dashboard and continue your journey with us. We're glad to see you again!
          </p>
          <div className="mt-12 flex gap-4">
            <div className="flex -space-x-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 border-2 border-white shadow-lg"></div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white shadow-lg"></div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 border-2 border-white shadow-lg"></div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 border-2 border-white shadow-lg flex items-center justify-center text-white text-xs font-bold">
                +50
              </div>
            </div>
            <p className="text-white/80 text-sm self-center">Join 1000+ users</p>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center relative z-10 p-6">
        <div className="w-full max-w-md">
          <div className="bg-white/95 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-white/20 dark:bg-white/10 dark:border-white/10">
            {/* Header */}
            <div className="mb-8">
              {/* Brand */}
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="relative h-8 w-8">
                  <Image src="/next.svg" alt="Brand logo" fill className="object-contain" priority />
                </div>
                <span className="text-xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                  ShopLite
                </span>
              </div>
              {/* Context icon */}
              <div className="text-center">
                <div className="inline-block p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-4 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m12-9l-1 9m-5-9v9" />
                  </svg>
                </div>
              </div>
              <h2 className="text-3xl font-black text-gray-800 mb-2 text-center dark:text-white">
                Đăng nhập để tiếp tục mua sắm
              </h2>
              <p className="text-center text-gray-500 dark:text-gray-300">
                Nhận ưu đãi độc quyền, theo dõi đơn hàng và thanh toán nhanh hơn
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5" noValidate aria-describedby={formError ? "form-error" : undefined}>
              {formError && (
                <div id="form-error" className="flex items-center gap-2 p-3 rounded-xl bg-red-50 text-red-700 border border-red-200">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M4.93 4.93l14.14 14.14M12 2a10 10 0 1010 10A10 10 0 0012 2z" />
                  </svg>
                  <span className="text-sm font-medium">{formError}</span>
                </div>
              )}
              <div className="relative">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2 dark:text-gray-200">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    id="email"
                    name="email"
                    className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl transition-all duration-200 outline-none ${
                      fieldErrors.email
                        ? "border-red-500 bg-red-50"
                        : focusedInput === "email"
                        ? "border-purple-500 bg-purple-50/50 shadow-lg shadow-purple-100"
                        : "border-gray-200 bg-gray-50 hover:border-gray-300"
                    } dark:bg-white/5 dark:text-white dark:placeholder-white/60`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedInput("email")}
                    onBlur={() => setFocusedInput("")}
                    required
                    aria-invalid={!!fieldErrors.email}
                    aria-describedby={fieldErrors.email ? "email-error" : undefined}
                  />
                  {fieldErrors.email && (
                    <p id="email-error" className="mt-2 text-sm text-red-600">{fieldErrors.email}</p>
                  )}
                </div>
              </div>

              <div className="relative">
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2 dark:text-gray-200">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    id="password"
                    name="password"
                    className={`w-full pl-12 pr-12 py-3.5 border-2 rounded-xl transition-all duration-200 outline-none ${
                      fieldErrors.password
                        ? "border-red-500 bg-red-50"
                        : focusedInput === "password"
                        ? "border-purple-500 bg-purple-50/50 shadow-lg shadow-purple-100"
                        : "border-gray-200 bg-gray-50 hover:border-gray-300"
                    } dark:bg-white/5 dark:text-white dark:placeholder-white/60`}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedInput("password")}
                    onBlur={() => setFocusedInput("")}
                    required
                    aria-invalid={!!fieldErrors.password}
                    aria-describedby={fieldErrors.password ? "password-error" : undefined}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-700"
                    aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    aria-pressed={showPassword}
                  >
                    {showPassword ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                  </button>
                  {fieldErrors.password && (
                    <p id="password-error" className="mt-2 text-sm text-red-600">{fieldErrors.password}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                  <span className="text-gray-600 group-hover:text-gray-800 dark:text-gray-300">Remember me</span>
                </label>
                <Link href="/auth/forgot" className="text-purple-600 font-semibold hover:text-purple-700 hover:underline">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 rounded-xl font-bold text-white text-lg transition-all duration-300 transform focus:outline-none focus:ring-4 focus:ring-purple-300 ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 hover:shadow-2xl hover:shadow-purple-500/50 hover:-translate-y-0.5"
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2" aria-live="polite" role="status">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Logging in...
                  </span>
                ) : (
                  "Login"
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center justify-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
              <span className="text-gray-400 text-sm font-medium">OR</span>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
            </div>

            {/* Google Login */}
            <button
              onClick={() => signIn("google", { callbackUrl: "/main" })}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 border-2 border-gray-200 py-3.5 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 hover:shadow-lg group disabled:opacity-60 disabled:cursor-not-allowed dark:border-white/20 dark:hover:bg-white/5"
            >
              <FcGoogle className="w-6 h-6 group-hover:scale-110 transition-transform" />
              <span className="text-gray-700 font-semibold">
                Continue with Google
              </span>
            </button>

            {/* Guest & Shop Links */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-xl border-2 border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition dark:border-white/20 dark:text-gray-200 dark:hover:bg-white/5"
              >
                Tiếp tục như Khách
              </Link>
              <Link
                href="/main"
                className="inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold text-purple-700 hover:text-purple-800 hover:underline"
              >
                ← Quay lại cửa hàng
              </Link>
            </div>

            {/* Sign up link */}
            <p className="text-center text-sm mt-8 text-gray-600 dark:text-gray-300">
              Don't have an account?{" "}
              <Link
                href="/auth/register"
                className="text-purple-600 font-bold hover:text-purple-700 hover:underline"
              >
                Create one now
              </Link>
            </p>

            {/* Trust badges */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-gray-600 dark:text-gray-300">
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c.5304 0 1.0391-.2107 1.4142-.5858C13.7893 10.0391 14 9.5304 14 9s-.2107-1.03906-.5858-1.41421C13.0391 7.21071 12.5304 7 12 7s-1.0391.21071-1.4142.58579C10.2107 7.96094 10 8.46957 10 9s.2107 1.0391.5858 1.4142C10.9609 10.7893 11.4696 11 12 11zm0 0v8m8-12a10 10 0 11-16 8.66" />
                </svg>
                Thanh toán an toàn
              </div>
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h18M8 8h8m-8 4h8M5 21l1.5-6H17l1.5 6" />
                </svg>
                Đổi trả trong 30 ngày
              </div>
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 10c0-3.3137-2.6863-6-6-6S6 6.6863 6 10c0 2.7614 1.8797 5.0789 4.4 5.7746V20l3.2-1.6v-2.6255C16.1203 15.0789 18 12.7614 18 10z" />
                </svg>
                Hỗ trợ 24/7
              </div>
            </div>
          </div>

          {/* Footer note */}
          <p className="text-center text-sm mt-6 text-white/80">
            Protected by industry-standard encryption
          </p>
        </div>
      </div>
    </div>
  );
}