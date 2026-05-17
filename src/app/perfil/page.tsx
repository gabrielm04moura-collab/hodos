import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import LogoutButton from "./LogoutButton";

const emblemas = [
  { id: "primeiro_passo", nome: "Primeiro Passo", emoji: "👣", desc: "Completou a primeira lição" },
  { id: "coracao_davi", nome: "Coração de Davi", emoji: "❤️", desc: "7 dias seguidos estudando" },
  { id: "sabedoria_salomao", nome: "Sabedoria de Salomão", emoji: "👑", desc: "100% de acerto em uma lição" },
  { id: "fe_abraao", nome: "Fé de Abraão", emoji: "⭐", desc: "30 dias de ofensiva" },
];

export default async function Perfil() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: perfil } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: progresso } = await supabase
    .from("user_progress")
    .select("*")
    .eq("user_id", user.id);

  const licoesCompletas = progresso?.length ?? 0;
  const xp = perfil?.xp ?? 0;
  const ofensiva = perfil?.ofensiva ?? 0;
  const nome = perfil?.nome ?? user.email?.split("@")[0] ?? "Jogador";

  return (
    <main className="max-w-xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <Link href="/mapa" className="text-slate-400 hover:text-slate-600 text-sm">← Mapa</Link>
        <LogoutButton />
      </div>

      <div className="bg-gradient-to-br from-indigo-500 to-purple-700 rounded-2xl p-6 text-white mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-3xl">
            {nome[0]?.toUpperCase() ?? "?"}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{nome}</h1>
            <p className="text-white/70 text-sm">{user.email}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-slate-100">
          <div className="text-3xl font-bold text-indigo-600">{xp}</div>
          <div className="text-xs text-slate-500 mt-1">XP Total</div>
        </div>
        <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-slate-100">
          <div className="text-3xl font-bold text-orange-500">{ofensiva}</div>
          <div className="text-xs text-slate-500 mt-1">🔥 Ofensiva</div>
        </div>
        <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-slate-100">
          <div className="text-3xl font-bold text-green-600">{licoesCompletas}</div>
          <div className="text-xs text-slate-500 mt-1">Lições</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 mb-6">
        <h2 className="font-semibold text-slate-700 mb-4">Emblemas</h2>
        <div className="grid grid-cols-2 gap-3">
          {emblemas.map((e) => {
            const conquistado = licoesCompletas > 0 && e.id === "primeiro_passo";
            return (
              <div
                key={e.id}
                className={`flex items-center gap-3 p-3 rounded-xl ${conquistado ? "bg-indigo-50 border border-indigo-200" : "bg-slate-50 opacity-50"}`}
              >
                <span className="text-2xl">{e.emoji}</span>
                <div>
                  <p className="text-sm font-medium text-slate-700">{e.nome}</p>
                  <p className="text-xs text-slate-400">{e.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {progresso && progresso.length > 0 && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <h2 className="font-semibold text-slate-700 mb-4">Histórico</h2>
          <div className="flex flex-col gap-2">
            {progresso.map((p: { licao_id: string; acertos: number; total: number }) => (
              <div key={p.licao_id} className="flex items-center justify-between text-sm">
                <span className="text-slate-600">{p.licao_id.replace(/_/g, " ")}</span>
                <span className="text-indigo-600 font-medium">{p.acertos}/{p.total}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
