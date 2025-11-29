"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { loginSchema, loginUser } from "@/schema/user.schema";
import { Suspense } from "react";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<loginUser>({ resolver: zodResolver(loginSchema) });

  const { login, loading } = useUserStore();

  const router = useRouter();

  const onSubmit = async (data: loginUser) => {
    try {
      await login(data);
      toast.success("Login successfully");
      router.push("/");
    } catch (error: any) {
      console.log("Error in login handler", error);
      toast.error("login failed");
    }
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
    <section className="flex items-center justify-center min-h-screen bg-linear-to-br from-blue-50 via-purple-50 to-white px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 md:p-10 border border-gray-100">
        {/* Heading */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold bg-linear-to-r from-blue-600 to-purple-700 bg-clip-text text-transparent">
            Welcome Back!
          </h1>
          <p className="text-zinc-500 font-medium mt-2">
            Log in to continue generating content
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          {/* Email Field */}
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="email"
              className="text-sm font-semibold text-gray-700"
            >
              Email Address
            </Label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <Input
                id="email"
                type="email"
                placeholder="john@gmail.com"
                {...register("email")}
                required
                className="pl-10 h-12 text-base border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-purple-600 transition-all"
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="password"
              className="text-sm font-semibold text-gray-700"
            >
              Password
            </Label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                {...register("password")}
                className="pl-10 h-12 text-base border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-purple-600 transition-all"
                required
              />
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          <Button
            disabled={loading}
            className="w-full h-12 text-lg font-semibold text-white bg-linear-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 shadow-md hover:shadow-lg transition-all"
          >
            {loading ? "Login In..." : "Log In"}
          </Button>

          <p className="text-center text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-purple-700 font-semibold hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </section>
    </Suspense>
  );
};

export default Login;
