"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import dadosRaw from "../../../../data/perguntas.json";
import { createClient } from "@/lib/supabase/client";

interface Pergunta {
  id: string;
  dificuldade: number;
  enunciado: string;
  alternativas: string[];
  correta: number;
  explicacao: string;
  referencia: string;
}

interface Licao {
  id: string;
  ordem: number;
  nome: string;
  perguntas: Pergunta[];
}

function encontrarLicao(id: string): Licao | null {
  for (const mundo of dadosRaw.mundos) {
    const licao = mundo.licoes.find((l) => l.id === id);
    if (licao) return licao as Licao;
  }
  return null;
}

export default function LicaoPage() {
  const params = useParams();
  const router = useRouter();
  const licao = encontrarLicao(params.id as string);
  const supabase = createClient();

  const [atual, setAtual] = useState(0);
  const [selecionada, setSelecionada] = useState<number | null>(null);
  const [acertos, setAcertos] = useState(0);
  const [finalizada, setFinalizada] = useState(false);

  if (!licao) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-slate-500">Lição não encontrada.</p>
        <button onClick={() => router.push("/mapa")} className="mt-4 text-indigo-600 underline">
          Voltar ao mapa
        </button>
      </main>
    );
  }

  const pergunta = licao.perguntas[atual];
  const total = licao.perguntas.length;
  const progresso = Math.round((atual / total) * 100);

  async function salvarProgresso(acertosFinais: number) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const xpGanho = acertosFinais * 10;

    await supabase.from("user_progress").insert({
      user_id: user.id,
      licao_id: licao!.id,
      acertos: acertosFinais,
      total,
    });

    const { data: perfil } = await supabase
      .from("profiles")
      .select("xp, ofensiva, ultima_atividade")
      .eq("id", user.id)
      .single();

    const hoje = new Date().toISOString().split("T")[0];
    const ontem = new Date(Date.now() - 86400000).toISOString().split("T")[0];
    const novaOfensiva = perfil?.ultima_atividade === ontem
      ? (perfil.ofensiva ?? 0) + 1
      : perfil?.ultima_atividade === hoje
      ? perfil.ofensiva ?? 1
      : 1;

    await supabase.from("profiles").update({
      xp: (perfil?.xp ?? 0) + xpGanho,
      ofensiva: novaOfensiva,
      ultima_atividade: hoje,
    }).eq("id", user.id);
  }

  function confirmar() {
    if (selecionada === null) return;
    if (selecionada === pergunta.correta) setAcertos((a) => a + 1);
  }

  async function avancar() {
    if (atual + 1 >= total) {
      await salvarProgresso(selecionada === pergunta.correta ? acertos + 1 : acertos);
      setFinalizada(true);
    } else {
      setAtual((a) => a + 1);
      setSelecionada(null);
    }
  }

  const respondeu = selecionada !== null;
  const acertou = selecionada === pergunta.correta;

  if (finalizada) {
    const acertosFinais = selecionada === pergunta.correta ? acertos + 1 : acertos;
    const pct = Math.round((acertosFinais / total) * 100);
    const xpGanho = acertosFinais * 10;

    return (
      <main className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <div className="text-6xl mb-4">{pct >= 70 ? "🏆" : "📖"}</div>
        <h2 className="text-2xl font-bold text-indigo-700 mb-2">Lição concluída!</h2>
        <p className="text-slate-500 mb-1">{licao.nome}</p>
        <p className="text-4xl font-bold text-indigo-600 my-4">{acertosFinais}/{total}</p>
        <p className="text-green-600 font-semibold mb-1">+{xpGanho} XP</p>
        <p className="text-slate-500 mb-8 text-sm">
          {pct >= 70 ? "Ótimo trabalho! Continue assim." : "Continue praticando, você vai melhorar!"}
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => router.push("/perfil")}
            className="border border-indigo-300 text-indigo-600 px-6 py-3 rounded-xl font-medium hover:bg-indigo-50 transition-colors"
          >
            Ver perfil
          </button>
          <button
            onClick={() => router.push("/mapa")}
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors"
          >
            Próxima lição
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-xl mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.push("/mapa")} className="text-slate-400 hover:text-slate-600 text-sm">
          ← Mapa
        </button>
        <span className="text-sm text-slate-500 font-medium">{licao.nome}</span>
      </div>

      <div className="w-full bg-slate-200 rounded-full h-2 mb-6">
        <div className="bg-indigo-500 h-2 rounded-full transition-all" style={{ width: `${progresso}%` }} />
      </div>

      <p className="text-xs text-slate-400 mb-1">
        Pergunta {atual + 1} de {total} · {"★".repeat(pergunta.dificuldade)}{"☆".repeat(3 - pergunta.dificuldade)}
      </p>
      <h2 className="text-xl font-semibold text-slate-800 mb-6 leading-snug">{pergunta.enunciado}</h2>

      <div className="flex flex-col gap-3 mb-6">
        {pergunta.alternativas.map((alt, i) => {
          let estilo = "border border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50";
          if (respondeu) {
            if (i === pergunta.correta) estilo = "border-2 border-green-500 bg-green-50";
            else if (i === selecionada) estilo = "border-2 border-red-400 bg-red-50";
            else estilo = "border border-slate-100 bg-slate-50 opacity-60";
          } else if (selecionada === i) {
            estilo = "border-2 border-indigo-500 bg-indigo-50";
          }

          return (
            <button
              key={i}
              onClick={() => !respondeu && setSelecionada(i)}
              className={`text-left px-4 py-3 rounded-xl transition-colors ${estilo}`}
            >
              <span className="text-slate-700">{alt}</span>
            </button>
          );
        })}
      </div>

      {respondeu && (
        <div className={`rounded-xl px-4 py-3 mb-6 ${acertou ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
          <p className={`font-semibold mb-1 ${acertou ? "text-green-700" : "text-red-600"}`}>
            {acertou ? "Correto!" : "Incorreto"}
          </p>
          <p className="text-slate-600 text-sm">{pergunta.explicacao}</p>
          <p className="text-slate-400 text-xs mt-1">{pergunta.referencia}</p>
        </div>
      )}

      {!respondeu ? (
        <button
          onClick={confirmar}
          disabled={selecionada === null}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold py-3 rounded-xl transition-colors"
        >
          Confirmar
        </button>
      ) : (
        <button
          onClick={avancar}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-colors"
        >
          {atual + 1 >= total ? "Ver resultado" : "Próxima →"}
        </button>
      )}
    </main>
  );
}
