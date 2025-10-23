"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { requestPasswordReset } from "@/lib/api";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState("");
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setFormError("Email không hợp lệ");
      return;
    }

    setLoading(true);
    try {
      await requestPasswordReset(email);
      setFormSuccess("Nếu email tồn tại, liên kết đặt lại mật khẩu đã được gửi.");
      toast.success("Đã gửi liên kết đặt lại mật khẩu");
    } catch (e) {
      setFormError("Có lỗi xảy ra. Vui lòng thử lại.");
      toast.error("Gửi liên kết thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="flex w-full items-center justify-center relative z-10 p-6">
        <div className="w-full max-w-md">
          <div className="bg-white/95 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-white/20 dark:bg-white/10 dark:border-white/10">
            <div className="mb-8 text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="relative h-8 w-8">
                  <Image src="/next.svg" alt="Brand logo" fill className="object-contain" priority />
                </div>
                <span className="text-xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                  ShopLite
                </span>
              </div>
              <div className="inline-block p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-4 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 18a6 6 0 100-12 6 6 0 000 12z" />
                </svg>
              </div>
              <h2 className="text-3xl font-black text-gray-800 mb-2 dark:text-white">Quên mật khẩu</h2>
              <p className="text-gray-500 dark:text-gray-300">Nhập email để nhận liên kết đặt lại mật khẩu</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {formError && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 text-red-700 border border-red-200">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M4.93 4.93l14.14 14.14M12 2a10 10 0 1010 10A10 10 0 0012 2z" />
                  </svg>
                  <span className="text-sm font-medium">{formError}</span>
                </div>
              )}
              {formSuccess && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-green-50 text-green-700 border border-green-200">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm font-medium">{formSuccess}</span>
                </div>
              )}
              <div className="relative">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2 dark:text-gray-200">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="you@example.com"
                    className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl transition-all duration-200 outline-none ${
                      focusedInput === "email"
                        ? "border-purple-500 bg-purple-50/50 shadow-lg shadow-purple-100"
                        : "border-gray-200 bg-gray-50 hover:border-gray-300"
                    } dark:bg-white/5 dark:text-white dark:placeholder-white/60`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedInput("email")}
                    onBlur={() => setFocusedInput("")}
                    required
                  />
                </div>
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
                    Đang gửi liên kết...
                  </span>
                ) : (
                  "Gửi liên kết đặt lại"
                )}
              </button>
            </form>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                href="/auth/login"
                className="inline-flex items-center justify-center rounded-xl border-2 border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition dark:border-white/20 dark:text-gray-200 dark:hover:bg-white/5"
              >
                ← Quay lại đăng nhập
              </Link>
              <Link
                href="/main"
                className="inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold text-purple-700 hover:text-purple-800 hover:underline"
              >
                Tiếp tục như Khách →
              </Link>
            </div>
          </div>

          <p className="text-center text-sm mt-6 text-white/80">Bảo mật bởi chuẩn công nghiệp</p>
        </div>
      </div>
    </div>
  );
}


