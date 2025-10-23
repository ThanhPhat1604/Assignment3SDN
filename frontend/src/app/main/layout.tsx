"use client";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import { ProductProvider } from "@/contexts/ProductContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <p className="text-center mt-10 text-gray-500">Loading...</p>;
  }

  return (
    <ErrorBoundary>
      <ProductProvider>
        <div className="min-h-screen">
          <Navbar />
          <nav className="flex justify-between bg-purple-600 text-white px-6 py-3">
            <span>Welcome, {session?.user?.name || "User"}</span>
            <button
              onClick={() => signOut({ callbackUrl: "/auth/login" })}
              className="bg-white text-purple-600 px-3 py-1 rounded-md"
            >
              Logout
            </button>
          </nav>
          <main className="p-6">{children}</main>
        </div>
      </ProductProvider>
    </ErrorBoundary>
  );
}
