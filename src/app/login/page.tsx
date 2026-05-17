"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function Login() {
  const [email, setEmail] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const supabase = createClient();

  async function entrarComEmail() {
    if (!email) return;
    setCarregando(true);
    await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${location.origin}/auth/callback` },
    });
    setEnviado(true);
    setCarregando(false);
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">✝️</div>
          <h1 className="text-3xl font-bold text-indigo-700">Hodos</h1>
          <p className="text-slate-500 mt-1 text-sm">Entre para salvar seu progresso</p>
        </div>

        {enviado ? (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
            <div className="text-3xl mb-2">📧</div>
            <p className="font-semibold text-green-800">Link enviado!</p>
            <p className="text-green-700 text-sm mt-1">Verifique seu e-mail e clique no link para entrar.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && entrarComEmail()}
              className="border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
            <button
              onClick={entrarComEmail}
              disabled={carregando || !email}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              {carregando ? "Enviando..." : "Entrar com Magic Link"}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
