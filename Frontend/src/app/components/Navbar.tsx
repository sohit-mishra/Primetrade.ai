"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white dark:bg-zinc-900 shadow-md border-b border-zinc-200 dark:border-zinc-800">
      <div className="flex items-center gap-2">
        <Link href="/">
          <Image
            className="dark:invert"
            src="/logo.svg"
            alt="Task logo"
            width={100}
            height={20}
            priority
          />
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <Link
          href="/profile"
          className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white font-medium"
        >
          {user?.name || "Profile"}
        </Link>
        <Button variant="outline" onClick={logout}>
          Logout
        </Button>
      </div>
    </nav>
  );
}
