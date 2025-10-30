"use client";

import { useAuth } from "@/app/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const publicRoutes = ["/login", "/signup"];
  const privateRoutes = ["/", "/profile"];

  useEffect(() => {
    if (!token && privateRoutes.includes(pathname)) {
      router.replace("/login");
    }
    if (token && publicRoutes.includes(pathname)) {
      router.replace("/");
    }
  }, [token, pathname, router]);

  if (!token && privateRoutes.includes(pathname)) {
    return (
      <div className="flex h-screen items-center justify-center text-zinc-500 dark:text-zinc-400">
      </div>
    );
  }

  return <>{children}</>;
}
