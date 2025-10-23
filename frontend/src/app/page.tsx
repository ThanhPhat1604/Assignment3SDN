"use client";
import Link from "next/link";
import Image from "next/image";
import { Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import {getProducts} from "@/lib/api";
import type { IProduct } from "@/types/product";
import { useSession } from "next-auth/react";

export default function LandingPage() {
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";
  const [newProducts, setNewProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 6;

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await getProducts();
        const sorted = Array.isArray(data)
          ? [...data].sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime())
          : [];
        setNewProducts(sorted);
        const cats = Array.from(new Set(sorted.map(p => p.category).filter(Boolean))) as string[];
        setCategories(cats);
      } catch (err) {
        setNewProducts([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = activeCategory ? newProducts.filter(p => p.category === activeCategory) : newProducts;
  const limited = isAuthenticated ? filtered : filtered.slice(0, itemsPerPage);
  const totalPages = Math.ceil(limited.length / itemsPerPage) || 1;
  const pageItems = isAuthenticated
    ? limited.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : limited; // guests see only first page

  const setCategory = (cat: string) => {
    setActiveCategory(cat === activeCategory ? "" : cat);
    setCurrentPage(1);
  };
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700" />

      {/* Decorative blobs */}
      <div className="pointer-events-none absolute top-0 -left-10 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-pulse" />
      <div className="pointer-events-none absolute -bottom-10 right-10 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animation-delay-2000 animate-pulse" />

      <main className="relative z-10">
        {/* Header */}
        <header className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative h-8 w-8">
              <Image src="/next.svg" alt="ShopLite" fill className="object-contain" priority />
            </div>
            <span className="text-white text-xl font-extrabold tracking-tight">ShopLite</span>
          </div>

          <nav className="hidden sm:flex items-center gap-3">
            <Link href="/auth/login" className="px-4 py-2 text-white/90 hover:text-white font-semibold animate-slide-in-top">Đăng nhập</Link>
            <Link href="/auth/register" className="px-4 py-2 rounded-xl bg-white text-purple-700 font-bold hover:bg-white/90 transition animate-slide-in-top">Tạo tài khoản</Link>
          </nav>
        </header>

        {/* Hero */}
        <section className="max-w-7xl mx-auto px-6 pt-8 pb-16 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-6">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-4">
              Khám phá thời trang mới
              <span className="block bg-gradient-to-r from-yellow-200 via-pink-200 to-purple-200 bg-clip-text text-transparent">
                Tiếp tục xem như người mới
              </span>
            </h1>
            <p className="text-white/90 text-lg md:text-xl leading-relaxed max-w-xl">
              Xem nhanh bộ sưu tập hot nhất, không cần đăng nhập. Bạn có thể tạo tài khoản sau để lưu yêu thích và đặt hàng nhanh hơn.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                href="/main"
                className="inline-flex items-center justify-center px-6 py-4 rounded-xl bg-white text-purple-700 font-extrabold hover:bg-white/90 shadow-lg"
              >
                Tiếp tục xem như người mới
              </Link>
              <Link
                href="/auth/login"
                className="inline-flex items-center justify-center px-6 py-4 rounded-xl border-2 border-white/70 text-white font-bold hover:bg-white/10"
              >
                Đăng nhập
              </Link>
            </div>

            {/* Trust badges */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-white/90 text-sm">
              <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-300" /> Thanh toán an toàn</div>
              <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-300" /> Đổi trả 30 ngày</div>
              <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-300" /> Hỗ trợ 24/7</div>
            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/20">
              <Image src="/window.svg" alt="Showcase" width={900} height={600} className="w-full h-auto" priority />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
          </div>
        </section>

        {/* Featured quick-cards */}
        <section className="max-w-7xl mx-auto px-6 pb-16">
          <h2 className="text-white text-2xl font-bold mb-4">Bộ sưu tập nổi bật</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Áo thun", color: "from-pink-500 to-rose-500" },
              { title: "Giày sneaker", color: "from-indigo-500 to-purple-500" },
              { title: "Phụ kiện", color: "from-emerald-500 to-teal-500" },
            ].map((c, i) => (
              <Link
                key={i}
                href="/auth/login"
                className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${c.color} p-6 shadow-xl hover:shadow-2xl transition`}
              >
                <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition mix-blend-overlay">
                  <Image src="/globe.svg" alt="bg" width={400} height={400} />
                </div>
                <div className="relative">
                  <p className="text-white/90 text-sm mb-2">Khám phá ngay</p>
                  <h3 className="text-white text-2xl font-extrabold">{c.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* New Products */}
        <section className="max-w-7xl mx-auto px-6 pb-24">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white text-2xl font-bold">Sản phẩm mới</h2>
            <Link href="/auth/login" className="text-white/90 hover:text-white text-sm font-semibold">Xem tất cả →</Link>
          </div>

          {/* Category chips */}
          {isAuthenticated && categories.length > 0 && (
            <div className="mb-5 flex flex-wrap gap-2">
              <button
                onClick={() => setCategory("")}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition ${
                  activeCategory === ""
                    ? "bg-white text-purple-700 border-white"
                    : "bg-white/10 text-white/90 border-white/20 hover:bg-white/15"
                }`}
              >
                Tất cả
              </button>
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold border transition ${
                    activeCategory === c
                      ? "bg-white text-purple-700 border-white"
                      : "bg-white/10 text-white/90 border-white/20 hover:bg-white/15"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 h-48 animate-pulse" />
              ))}
            </div>
          ) : limited.length === 0 ? (
            <div className="text-white/80">Chưa có sản phẩm nào.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {pageItems.map((p) => (
                <Link key={p._id} href={`/auth/login`} className="group rounded-2xl overflow-hidden bg-white/95 dark:bg-white/10 backdrop-blur-xl border border-white/20 dark:border-white/10 hover:translate-y-[-4px] hover:shadow-2xl transition-all relative">
                  <div className="relative h-44 bg-gradient-to-br from-purple-100 via-pink-100 to-indigo-100">
                    {p.image ? (
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-purple-600/60">Không có ảnh</div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    {!isAuthenticated && (
                      <span className="absolute top-3 left-3 z-10 px-3 py-1 text-xs font-bold rounded-full bg-amber-500 text-white shadow">
                        Giới hạn
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 dark:text-white line-clamp-1">{p.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mt-1">{p.description}</p>
                    <div className="mt-3 text-lg font-extrabold bg-gradient-to-r from-emerald-500 to-green-600 bg-clip-text text-transparent">
                      ${p.price}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
          {isAuthenticated && limited.length > itemsPerPage && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-xl border border-white/20 text-white/90 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Trước
              </button>
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 5).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 rounded-lg text-sm font-semibold ${
                      page === currentPage ? "bg-white text-purple-700" : "border border-white/20 text-white/90 hover:bg-white/10"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-xl border border-white/20 text-white/90 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Tiếp
              </button>
            </div>
          )}

          {!isAuthenticated && (
            <div className="mt-8 bg-white/10 border border-white/20 rounded-2xl p-6 text-white/90">
              <p className="mb-4">Bạn đang xem một phần danh sách. Đăng nhập hoặc tạo tài khoản để xem tất cả sản phẩm.</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/auth/login" className="inline-flex justify-center items-center px-5 py-3 rounded-xl bg-white text-purple-700 font-bold hover:bg-white/90">Đăng nhập để xem tất cả</Link>
                <Link href="/auth/register" className="inline-flex justify-center items-center px-5 py-3 rounded-xl border-2 border-white/70 text-white font-semibold hover:bg-white/10">Tạo tài khoản</Link>
              </div>
            </div>
          )}

          {/* Blurred teaser for more content */}
          {!isAuthenticated && filtered.length > pageItems.length && (
            <div className="mt-6 relative rounded-2xl overflow-hidden border border-white/20">
              <div className="h-40 bg-gradient-to-r from-white/10 to-white/5 blur-sm" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                <p className="text-white font-bold text-lg">Còn {filtered.length - pageItems.length} sản phẩm nữa</p>
                <p className="text-white/80 text-sm mb-4">Đăng nhập để khám phá toàn bộ bộ sưu tập</p>
                <div className="flex gap-3">
                  <Link href="/auth/login" className="px-4 py-2 rounded-xl bg-white text-purple-700 font-bold hover:bg-white/90">Đăng nhập</Link>
                  <Link href="/auth/register" className="px-4 py-2 rounded-xl border-2 border-white/70 text-white font-semibold hover:bg-white/10">Đăng ký</Link>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-8 text-white/80 text-sm flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} ShopLite. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="#" className="hover:underline">Điều khoản</Link>
            <Link href="#" className="hover:underline">Bảo mật</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
