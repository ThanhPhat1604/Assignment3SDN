"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { resendVerificationEmail } from "@/lib/api";
import toast from "react-hot-toast";

export default function VerifyEmailPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleResend = async () => {
    setLoading(true);
    setMessage(null);
    setError(null);
    try {
      await resendVerificationEmail("");
      setMessage("Email xác minh đã được gửi lại. Vui lòng kiểm tra hộp thư.");
      toast.success("Đã gửi lại email xác minh");
    } catch (e) {
      setError("Không thể gửi lại email. Vui lòng thử lại.");
      toast.error("Gửi lại email thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700" />
      <div className="flex w-full items-center justify-center relative z-10 p-6">
        <div className="w-full max-w-md">
          <div className="bg-white/95 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-white/20 dark:bg-white/10 dark:border-white/10">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="relative h-8 w-8">
                  <Image src="/next.svg" alt="Brand logo" fill className="object-contain" priority />
                </div>
                <span className="text-xl font-extrabold tracking-tight text-gray-900 dark:text-white">ShopLite</span>
              </div>
              <div className="inline-block p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-4 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0z" />
                </svg>
              </div>
              <h2 className="text-3xl font-black text-gray-800 mb-2 dark:text-white">Xác minh email</h2>
              <p className="text-gray-500 dark:text-gray-300">Chúng tôi đã gửi email xác minh. Hãy kiểm tra hộp thư của bạn.</p>
            </div>

            {message && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-green-50 text-green-700 border border-green-200 mb-4">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm font-medium">{message}</span>
              </div>
            )}
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 text-red-700 border border-red-200 mb-4">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M4.93 4.93l14.14 14.14M12 2a10 10 0 1010 10A10 10 0 0012 2z" />
                </svg>
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}

            <div className="space-y-4">
              <button
                onClick={handleResend}
                disabled={loading}
                className={`w-full py-3.5 rounded-xl font-semibold text-white transition-all duration-300 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'}`}
              >
                {loading ? "Đang gửi lại..." : "Gửi lại email xác minh"}
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Link href="/auth/login" className="inline-flex items-center justify-center rounded-xl border-2 border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition dark:border-white/20 dark:text-gray-200 dark:hover:bg-white/5">← Về đăng nhập</Link>
                <Link href="/main" className="inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold text-purple-700 hover:text-purple-800 hover:underline">Tiếp tục như Khách →</Link>
              </div>
            </div>
          </div>
          <p className="text-center text-sm mt-6 text-white/80">Bảo mật bởi chuẩn công nghiệp</p>
        </div>
      </div>
    </div>
  );
}


