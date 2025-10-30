"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAuth } from "@/app/context/AuthContext";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const router = useRouter();
  const { token, user } = useAuth();
  const [data, setData] = useState<{ name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/users/profile`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setData(res.data.user);
      } catch {
        toast.error("Failed to fetch profile info");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const updateProfile = async () => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/users/update-profile`,
        { name: data?.name, email: data?.email },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Profile updated!");
      if (user?.email === data?.email) {
        router.push("/profile");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Profile update failed");
    }
  };

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/users/change-password`,
        { oldPassword, newPassword },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Password updated!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Password update failed");
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex h-screen items-center justify-center text-zinc-500 dark:text-zinc-400"
      />
    );
  }

  if (!data) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex h-screen items-center justify-center text-zinc-500 dark:text-zinc-400"
      >
        No user data found
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-100 via-zinc-200 to-zinc-300 dark:from-zinc-950 dark:via-zinc-900 dark:to-black p-4"
    >
      <button
        onClick={() => router.back()}
        className="absolute top-10 left-8 md:hidden flex items-center gap-1 text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white transition"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>

      <motion.main
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-5xl rounded-2xl bg-white p-8 shadow-md dark:bg-zinc-900"
      >
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center mb-10"
        >
          <div className="flex items-center justify-center w-24 h-24 rounded-full bg-zinc-300 dark:bg-zinc-700 text-4xl font-semibold text-white">
            {data.name?.charAt(0)}
          </div>
          <h1 className="mt-4 text-3xl font-semibold text-black dark:text-white">
            {data.name}
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">{data.email}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-4"
          >
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={data.email} readOnly />
            </div>
            <Button
              className="w-full mt-2"
              onClick={updateProfile}
              disabled={user?.name === data?.name}
            >
              Update Profile
            </Button>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-4"
            onSubmit={changePassword}
          >
            <div className="flex flex-col mb-2">
              <Label htmlFor="oldPassword" className="mb-1">
                Old Password
              </Label>
              <div className="relative">
                <Input
                  id="oldPassword"
                  type={showOldPassword ? "text" : "password"}
                  placeholder="Enter old password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex flex-col mb-2">
              <Label htmlFor="newPassword" className="mb-1">
                New Password
              </Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex flex-col mb-2">
              <Label htmlFor="confirmPassword" className="mb-1">
                Confirm New Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            <Button
              className="w-full mt-2"
              type="submit"
              disabled={
                oldPassword === "" || newPassword === "" || confirmPassword === ""
              }
            >
              Update Password
            </Button>
          </motion.form>
        </div>
      </motion.main>
    </motion.div>
  );
}
