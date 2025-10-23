"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { registerUser } from "@/lib/api";
import { Eye, EyeOff, Facebook, Linkedin } from "lucide-react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formError, setFormError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; email?: string; password?: string; confirmPassword?: string }>({});
  const router = useRouter();

  const getPasswordScore = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return Math.min(score, 5);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    const nextFieldErrors: { name?: string; email?: string; password?: string; confirmPassword?: string } = {};

    if (!name.trim()) nextFieldErrors.name = "Vui lòng nhập họ tên";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) nextFieldErrors.email = "Email không hợp lệ";
    if (!password || password.length < 8) nextFieldErrors.password = "Mật khẩu tối thiểu 8 ký tự";
    if (password && confirmPassword && password !== confirmPassword) nextFieldErrors.confirmPassword = "Mật khẩu không khớp";

    if (Object.keys(nextFieldErrors).length > 0) {
      setFieldErrors(nextFieldErrors);
      return;
    }

    setFieldErrors({});
    setLoading(true);
    try {
      const res = await registerUser({ name, email, password });
      if (res) {
        toast.success("Tạo tài khoản thành công. Vui lòng đăng nhập.");
        router.push("/auth/login");
      } else {
        toast.error("Đăng ký thất bại");
        setFormError("Đăng ký thất bại. Vui lòng thử lại.");
      }
    } catch (err) {
      toast.error("Lỗi máy chủ");
      setFormError("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
      </div>

      {/* Left side - Hero section */}
      <div className="hidden lg:flex w-1/2 relative z-10 items-center justify-center px-12">
        <div className="max-w-lg">
          {/* Brand */}
          <div className="mb-6 flex items-center gap-3">
            <div className="relative h-8 w-8">
              <Image src="/next.svg" alt="ShopLite" fill className="object-contain" priority />
            </div>
            <span className="text-3xl font-black text-white">ShopLite</span>
          </div>

          <h1 className="text-6xl font-black text-white mb-4 leading-tight">
            Tham gia<br />mua sắm!
          </h1>
          <p className="text-lg text-white/90 leading-relaxed mb-8">
            Tạo tài khoản để theo dõi đơn hàng, nhận ưu đãi và thanh toán nhanh hơn.
          </p>

          {/* Benefits */}
          <div className="space-y-3 mb-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-white/90 text-base">Free to use, forever</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-white/90 text-base">Secure & encrypted</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-white/90 text-base">24/7 customer support</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-black text-white mb-1">10K+</div>
              <div className="text-white/80 text-sm">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-white mb-1">4.9★</div>
              <div className="text-white/80 text-sm">Rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-white mb-1">99%</div>
              <div className="text-white/80 text-sm">Satisfaction</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Register form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center relative z-10 p-6">
        <div className="w-full max-w-md">
          <div className="bg-white/95 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/20 dark:bg-white/10 dark:border-white/10">
            {/* Header */}
            <div className="mb-6">
              <div className="text-right mb-4 text-sm text-gray-600 dark:text-gray-300">
                Đã có tài khoản?{" "}
                <Link href="/auth/login" className="text-purple-600 font-bold hover:text-purple-700 hover:underline">Đăng nhập</Link>
              </div>

              <div className="text-center">
                <div className="inline-block p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-3 shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-black text-gray-800 mb-1 dark:text-white">Tạo tài khoản</h2>
                <p className="text-sm text-gray-500 dark:text-gray-300">Điền thông tin để bắt đầu mua sắm</p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {formError && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 text-red-700 border border-red-200">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" />
                  </svg>
                  <span className="text-sm font-medium">{formError}</span>
                </div>
              )}
              
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1.5 dark:text-gray-200">Họ và tên</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Nguyễn Văn A"
                    className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl transition-all duration-200 outline-none ${
                      fieldErrors.name ? "border-red-500 bg-red-50" : focusedInput === "name" ? "border-purple-500 bg-purple-50/50 shadow-lg shadow-purple-100" : "border-gray-200 bg-gray-50 hover:border-gray-300"
                    } dark:bg-white/5 dark:text-white dark:placeholder-white/60`}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onFocus={() => setFocusedInput("name")}
                    onBlur={() => setFocusedInput("")}
                    aria-invalid={!!fieldErrors.name}
                    aria-describedby={fieldErrors.name ? "name-error" : undefined}
                  />
                  {fieldErrors.name && <p id="name-error" className="mt-1.5 text-xs text-red-600">{fieldErrors.name}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5 dark:text-gray-200">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl transition-all duration-200 outline-none ${
                      fieldErrors.email ? "border-red-500 bg-red-50" : focusedInput === "email" ? "border-purple-500 bg-purple-50/50 shadow-lg shadow-purple-100" : "border-gray-200 bg-gray-50 hover:border-gray-300"
                    } dark:bg-white/5 dark:text-white dark:placeholder-white/60`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedInput("email")}
                    onBlur={() => setFocusedInput("")}
                    aria-invalid={!!fieldErrors.email}
                    aria-describedby={fieldErrors.email ? "email-error" : undefined}
                  />
                  {fieldErrors.email && <p id="email-error" className="mt-1.5 text-xs text-red-600">{fieldErrors.email}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1.5 dark:text-gray-200">Mật khẩu</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="8+ ký tự"
                    className={`w-full pl-11 pr-11 py-3 border-2 rounded-xl transition-all duration-200 outline-none ${
                      fieldErrors.password ? "border-red-500 bg-red-50" : focusedInput === "password" ? "border-purple-500 bg-purple-50/50 shadow-lg shadow-purple-100" : "border-gray-200 bg-gray-50 hover:border-gray-300"
                    } dark:bg-white/5 dark:text-white dark:placeholder-white/60`}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedInput("password")}
                    onBlur={() => setFocusedInput("")}
                    aria-invalid={!!fieldErrors.password}
                    aria-describedby={fieldErrors.password ? "password-error" : undefined}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                  {fieldErrors.password && <p id="password-error" className="mt-1.5 text-xs text-red-600">{fieldErrors.password}</p>}
                </div>
                <div className="mt-2">
                  <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        getPasswordScore(password) <= 2 ? "bg-red-500" : getPasswordScore(password) === 3 ? "bg-yellow-500" : "bg-green-500"
                      }`}
                      style={{ width: `${(getPasswordScore(password) / 5) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-1.5 dark:text-gray-200">Xác nhận mật khẩu</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Nhập lại mật khẩu"
                    className={`w-full pl-11 pr-11 py-3 border-2 rounded-xl transition-all duration-200 outline-none ${
                      fieldErrors.confirmPassword ? "border-red-500 bg-red-50" : focusedInput === "confirmPassword" ? "border-purple-500 bg-purple-50/50 shadow-lg shadow-purple-100" : "border-gray-200 bg-gray-50 hover:border-gray-300"
                    } dark:bg-white/5 dark:text-white dark:placeholder-white/60`}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onFocus={() => setFocusedInput("confirmPassword")}
                    onBlur={() => setFocusedInput("")}
                    aria-invalid={!!fieldErrors.confirmPassword}
                    aria-describedby={fieldErrors.confirmPassword ? "confirm-error" : undefined}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                  {fieldErrors.confirmPassword && <p id="confirm-error" className="mt-1.5 text-xs text-red-600">{fieldErrors.confirmPassword}</p>}
                </div>
              </div>

              <div className="flex items-start gap-2 text-sm pt-1">
                <input type="checkbox" className="w-4 h-4 mt-0.5 rounded border-gray-300 text-purple-600" required />
                <label className="text-gray-600">
                  Tôi đồng ý với <a href="#" className="text-purple-600 font-semibold hover:underline">Điều khoản</a> và <a href="#" className="text-purple-600 font-semibold hover:underline">Chính sách</a>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3.5 rounded-xl font-bold text-white text-base transition-all duration-300 transform ${
                  loading ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 hover:shadow-xl hover:shadow-purple-500/50 hover:-translate-y-0.5"
                }`}
              >
                {loading ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
              </button>
            </form>

            {/* Divider */}
            <div className="my-5 flex items-center justify-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
              <span className="text-gray-400 text-xs font-medium">OR</span>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
            </div>

            {/* Social Login */}
            <div className="flex justify-center gap-3">
              <button className="flex-1 flex items-center justify-center border-2 border-gray-200 py-3 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all hover:shadow-md">
                <Facebook className="w-5 h-5 text-blue-600" />
              </button>
              <button className="flex-1 flex items-center justify-center border-2 border-gray-200 py-3 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all hover:shadow-md">
                <Linkedin className="w-5 h-5 text-blue-500" />
              </button>
              <button className="flex-1 flex items-center justify-center border-2 border-gray-200 py-3 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all hover:shadow-md">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Footer note */}
          <p className="text-center text-sm mt-4 text-white/80">🔒 Dữ liệu của bạn được bảo mật</p>
        </div>
      </div>
    </div>
  );
}