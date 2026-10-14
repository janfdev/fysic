"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Disc3, Lock, Mail, User, Loader2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Gagal mendaftar");
      }

      router.push("/app");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat pendaftaran");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white flex flex-col justify-center items-center px-4 py-12 selection:bg-[#1ed760] selection:text-black">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-4 group">
            <div className="w-10 h-10 rounded-full bg-[#1ed760] flex items-center justify-center text-black group-hover:scale-105 transition-transform shadow-[0_2px_12px_rgba(30,215,96,0.3)]">
              <Disc3 className="w-6 h-6 fill-black stroke-black" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-white">fysic</span>
          </Link>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Daftar Akun Fysic</h1>
          <p className="text-xs text-[#b3b3b3] mt-1">
            Buat playlist mandiri dan nikmati sequential playback tanpa iklan
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#181818] border border-[#282828] rounded-2xl p-6 sm:p-8 shadow-[0_8px_24px_rgba(0,0,0,0.5)]">
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-[#f3727f]/10 border border-[#f3727f]/20 text-xs text-[#f3727f] font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#b3b3b3] uppercase tracking-wider mb-2">
                Nama Lengkap
              </label>
              <div className="relative flex items-center">
                <User className="w-4 h-4 text-[#727272] absolute left-4 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama Lengkap"
                  className="w-full pl-11 pr-4 py-3 rounded-full bg-[#121212] border border-[#383838] text-white text-sm focus:outline-none focus:border-[#1ed760] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#b3b3b3] uppercase tracking-wider mb-2">
                Alamat Email
              </label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-[#727272] absolute left-4 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="pendengar@fysic.com"
                  className="w-full pl-11 pr-4 py-3 rounded-full bg-[#121212] border border-[#383838] text-white text-sm focus:outline-none focus:border-[#1ed760] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#b3b3b3] uppercase tracking-wider mb-2">
                Kata Sandi
              </label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-[#727272] absolute left-4 pointer-events-none" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  className="w-full pl-11 pr-4 py-3 rounded-full bg-[#121212] border border-[#383838] text-white text-sm focus:outline-none focus:border-[#1ed760] transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-full font-bold bg-[#1ed760] hover:bg-[#1fdf64] hover:scale-[1.02] active:scale-[0.98] text-black text-xs uppercase tracking-wider transition-all disabled:opacity-50 mt-2 shadow-[0_4px_16px_rgba(30,215,96,0.3)] flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                  <span>Mendaftarkan...</span>
                </>
              ) : (
                <span>Daftar Sekarang</span>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#282828] text-center text-xs text-[#b3b3b3]">
            <span>Sudah memiliki akun? </span>
            <Link href="/login" className="font-bold text-white hover:underline hover:text-[#1ed760]">
              Masuk di sini
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
