"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { User, Lock, AlertCircle, Car, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion"; 

export default function LoginPage() {
  const { login, loading, error } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(username, password);
  };

  // --- ANIMATION VARIANTS ---
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  return (
    <div className="min-h-screen w-full flex bg-[#E3FDFD] overflow-hidden">
      
      {/* --- BAGIAN KIRI: BRANDING (Hidden di Mobile) --- */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-16 text-white overflow-hidden bg-gradient-to-br from-[#71C9CE] to-[#A6E3E9]">
        
        {/* Animated Background Blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ rotate: 360, scale: [1, 1.2, 1] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-[20%] -left-[10%] w-[600px] h-[600px] bg-white/10 rounded-full blur-[80px]"
          />
          <motion.div
            animate={{ rotate: -360, scale: [1, 1.3, 1] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[10%] -right-[10%] w-[500px] h-[500px] bg-[#E3FDFD]/20 rounded-full blur-[100px]"
          />
        </div>

        {/* Logo Area */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="relative z-10 flex items-center gap-4"
        >
          <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 shadow-lg shadow-[#71C9CE]/30">
            <Car className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-black tracking-tight drop-shadow-sm">SiParkir</h1>
        </motion.div>

        {/* Hero Text */}
        <div className="relative z-10 max-w-lg mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-5xl font-black mb-6 leading-tight drop-shadow-sm"
          >
            Smart Parking <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-[#E3FDFD]">
              Management
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-white/90 text-lg leading-relaxed font-medium"
          >
            Optimalkan operasional parkir Anda dengan sistem monitoring real-time dan manajemen tarif yang efisien.
          </motion.p>
        </div>

        {/* Footer Branding */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="relative z-10 flex items-center gap-2 text-sm text-white font-bold bg-white/10 w-fit px-5 py-2.5 rounded-full backdrop-blur-md border border-white/20"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Sistem Terenkripsi & Aman</span>
        </motion.div>
      </div>

      {/* --- BAGIAN KANAN: FORM LOGIN --- */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12 lg:p-24 relative">
        
        {/* Dekorasi Blob Kanan (CSS Only) */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#CBF1F5]/50 rounded-full blur-[120px] pointer-events-none" />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md space-y-8 bg-white/60 backdrop-blur-2xl p-10 rounded-[2.5rem] shadow-2xl shadow-[#71C9CE]/10 border border-white relative z-10"
        >
          {/* Header Mobile (Logo hanya muncul di mobile) */}
          <motion.div variants={fadeInUp} className="text-center">
            <div className="lg:hidden mx-auto w-16 h-16 bg-gradient-to-tr from-[#71C9CE] to-[#A6E3E9] rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-[#71C9CE]/40">
              <Car className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">
              Selamat Datang
            </h2>
            <p className="mt-2 text-sm text-gray-500 font-medium">
              Masuk untuk mengakses dashboard admin.
            </p>
          </motion.div>

          {/* Error Alert */}
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="p-4 rounded-2xl bg-red-50/80 border border-red-100 flex items-start gap-3 overflow-hidden"
            >
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div className="text-sm text-red-600">
                <span className="font-bold block mb-0.5">Akses Ditolak</span>
                {error}
              </div>
            </motion.div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <motion.div variants={fadeInUp} className="space-y-5">
              <Input
                id="username"
                label="Username"
                type="text"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                startIcon={User}
                required
                autoComplete="username"
                className="bg-white" // Override glass style for clearer input
              />

              <div className="space-y-2">
                <Input
                  id="password"
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  startIcon={Lock}
                  required
                  autoComplete="current-password"
                  className="bg-white"
                />
              </div>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Button
                type="submit"
                fullWidth
                size="lg"
                isLoading={loading}
                className="h-14 text-base font-bold shadow-xl shadow-[#71C9CE]/30 hover:shadow-[#71C9CE]/50 hover:-translate-y-1 transition-all duration-300 rounded-2xl"
              >
                Sign In
              </Button>
            </motion.div>
          </form>

          {/* Footer Copyright */}
          <motion.div
            variants={fadeInUp}
            className="mt-8 text-center border-t border-gray-100/50 pt-6"
          >
            <p className="text-xs text-gray-400 font-medium">
              &copy; {new Date().getFullYear()} SiParkir Parking System.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}