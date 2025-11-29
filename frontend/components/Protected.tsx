"use client";

import { useBlogStore } from "@/store/blogStore";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user: isAuthenticated } = useUserStore()
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);

  // Ensure Zustand is hydrated first
  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated && !isAuthenticated) {
      router.push("/login");
    }
  }, [hydrated, isAuthenticated, router]);

  if (!hydrated) {
    // You can show a loader here
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-violet-600"></div>
      </div>
    );
  }

  return <>{isAuthenticated ? children : null}</>;
}
