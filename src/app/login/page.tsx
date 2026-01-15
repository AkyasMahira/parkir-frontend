"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { User, Lock, AlertCircle, Car, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const { login, loading, error } = useAuth();

  // Local state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(username, password);
  };

  return (
    <div className="min-h-screen w-full flex bg-white">
      {/* --- BAGIAN KIRI: BRANDING / VISUAL (Hidden di Mobile) --- */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-600 relative flex-col justify-between p-12 text-white overflow-hidden">
        {/* Background Pattern / Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-800 z-0" />
        <div className="absolute inset-0 opacity-10 bg-[url('/pattern.svg')] z-0" />{" "}
        {/* Opsional: Pattern */}
        {/* Logo Area */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
            <Car className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">SiParkir</h1>
        </div>
        {/* Hero Text */}
        <div className="relative z-10 max-w-lg">
          <h2 className="text-4xl font-bold mb-4 leading-tight">
            Kelola Sistem Parkir dengan Lebih Cerdas.
          </h2>
          <p className="text-blue-100 text-lg leading-relaxed">
            Platform manajemen parkir terintegrasi untuk memantau transaksi,
            keamanan, dan pendapatan secara real-time.
          </p>
        </div>
        {/* Footer Branding */}
        <div className="relative z-10 flex items-center gap-2 text-sm text-blue-200">
          <ShieldCheck className="w-5 h-5" />
          <span>Sistem Terenkripsi & Aman</span>
        </div>
      </div>

      {/* --- BAGIAN KANAN: FORM LOGIN --- */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 sm:p-12 lg:p-24 bg-gray-50/50">
        <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          {/* Header Mobile (Logo hanya muncul di mobile disini) */}
          <div className="text-center">
            <div className="lg:hidden mx-auto w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white mb-4 shadow-lg shadow-blue-500/30">
              <Car className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
              Selamat Datang
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Silakan masukkan kredensial akun Anda.
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="p-4 rounded-lg bg-red-50 border border-red-100 flex items-start gap-3 animate-in slide-in-from-top-2 duration-300">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div className="text-sm text-red-600">
                <span className="font-semibold block mb-0.5">Gagal Masuk</span>
                {error}
              </div>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <Input
                id="username"
                label="Username"
                type="text"
                placeholder="Ex: Doombundel"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                startIcon={User} // Menggunakan fitur startIcon dari Input kita
                required
                autoComplete="username"
              />

              <div className="space-y-1">
                <Input
                  id="password"
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  startIcon={Lock} // Menggunakan fitur startIcon
                  required
                  autoComplete="current-password"
                />
                {/* Forgot Password Link (Visual Only) */}
                <div className="flex justify-end">
                  <Link
                    href="/forgot-password"
                    className="text-xs font-medium text-blue-600 hover:text-blue-500 hover:underline"
                  >
                    Lupa password?
                  </Link>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              fullWidth
              size="lg"
              isLoading={loading}
              className="shadow-lg shadow-blue-600/20"
            >
              Masuk ke Dashboard
            </Button>
          </form>

          {/* Footer Copyright */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400">
              &copy; {new Date().getFullYear()} SiParkir. All rights
              reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
