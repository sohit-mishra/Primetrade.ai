"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";

export default function LoginPage() {
  const { setUser, setToken } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/users/login`,
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      toast.success("Login successful!");
      setUser(res.data.user)
      setToken(res.data.token)
      localStorage.setItem("token", res.data.token);
      router.push("/");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-100 via-zinc-200 to-zinc-300 dark:from-zinc-950 dark:via-zinc-900 dark:to-black">
      <motion.main
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex w-full max-w-md flex-col items-center justify-center rounded-2xl bg-white p-8 shadow-md dark:bg-zinc-900"
      >
        <h1 className="mb-6 text-3xl font-semibold text-black dark:text-white">
          Login
        </h1>

        <form onSubmit={handleLogin} className="w-full space-y-4">
          <div className="flex flex-col mb-2">
            <Label htmlFor="email" className="mb-1">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col mb-2">
            <Label htmlFor="password" className="mb-1">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading || email === '' || password === ''} >
            {loading ? "Logging In..." : "Login"}
          </Button>
        </form>

        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          Don’t have an account?{" "}
          <span
            onClick={() => router.push("/signup")}
            className="cursor-pointer text-blue-600 hover:underline"
          >
            Sign Up
          </span>
        </p>
      </motion.main>
    </div>
  );
}
