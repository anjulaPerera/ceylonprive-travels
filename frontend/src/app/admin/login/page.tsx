"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import toast from "react-hot-toast";

const loginSchema = z.object({
  email: z.string().email("Valid email required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      toast.success("Welcome back!");
    } catch {
      toast.error("Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-12">
          <div className="font-serif text-3xl font-light tracking-[0.15em] text-gradient-gold mb-1">
            CeylonPrivé
          </div>
          <div className="text-[10px] tracking-[0.4em] text-cream-dark uppercase font-sans font-light mb-8">
            Travels
          </div>
          <div className="flex items-center justify-center gap-3 text-cream-dark">
            <Lock size={14} className="text-gold" />
            <span className="text-xs tracking-widest uppercase font-sans">
              Guide Portal
            </span>
          </div>
        </div>

        {/* Form */}
        <div className="border border-gold/20 p-8 bg-navy-light">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-xs tracking-widest uppercase text-gold font-sans mb-2">
                Email Address
              </label>
              <input
                {...register("email")}
                type="email"
                className={cn(
                  "w-full bg-navy border px-4 py-3 text-cream font-sans font-light text-sm focus:outline-none transition-colors",
                  errors.email
                    ? "border-red-500/50"
                    : "border-gold/20 focus:border-gold",
                )}
                placeholder="admin@ceylonprive.com"
                autoComplete="email"
              />
              {errors.email && (
                <p className="text-red-400 text-xs font-sans mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs tracking-widest uppercase text-gold font-sans mb-2">
                Password
              </label>
              <input
                {...register("password")}
                type="password"
                className={cn(
                  "w-full bg-navy border px-4 py-3 text-cream font-sans font-light text-sm focus:outline-none transition-colors",
                  errors.password
                    ? "border-red-500/50"
                    : "border-gold/20 focus:border-gold",
                )}
                placeholder="••••••••"
                autoComplete="current-password"
              />
              {errors.password && (
                <p className="text-red-400 text-xs font-sans mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                "w-full py-4 flex items-center justify-center gap-3 text-sm tracking-[0.2em] uppercase font-sans transition-all duration-300",
                isLoading
                  ? "bg-gold/30 text-gold/50 cursor-not-allowed"
                  : "bg-gold text-navy hover:bg-gold-light",
              )}
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Authenticating...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-cream-dark/40 text-xs font-sans mt-6 tracking-wider">
          CeylonPrivé Travels — Private Access Only
        </p>
      </div>
    </div>
  );
}
