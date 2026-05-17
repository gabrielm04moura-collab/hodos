import Link from "next/link";
import dados from "../../../data/perguntas.json";

const emojis: Record<string, string> = {
  mundo_1: "🌍",
  mundo_2: "👑",
  mundo_3: "✝️",
  mundo_4: "🕊️",
};

const cores: Record<string, string> = {
  mundo_1: "from-amber-400 to-orange-500",
  mundo_2: "from-violet-500 to-purple-700",
  mundo_3: "from-sky-400 to-blue-600",
  mundo_4: "from-emerald-400 to-green-600",
};

export default function Mapa() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/" className="text-slate-400 hover:text-slate-600 text-sm">← Início</Link>
        <h1 className="text-3xl font-bold text-indigo-700">Mapa da Jornada</h1>
      </div>

      <div className="flex flex-col gap-6">
        {dados.mundos.map((mundo) => (
          <div key={mundo.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className={`bg-gradient-to-r ${cores[mundo.id] ?? "from-slate-400 to-slate-600"} px-6 py-5`}>
              <div className="flex items-center gap-3">
                <span className="text-4xl">{emojis[mundo.id] ?? "📖"}</span>
                <div>
                  <h2 className="text-white font-bold text-xl">{mundo.nome}</h2>
                  <p className="text-white/80 text-sm">{mundo.descricao}</p>
                </div>
              </div>
            </div>

            <div className="divide-y divide-slate-50">
              {mundo.licoes.map((licao) => (
                <Link
                  key={licao.id}
                  href={`/licao/${licao.id}`}
                  className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm">
                      {licao.ordem}
                    </span>
                    <span className="font-medium text-slate-700 group-hover:text-indigo-600 transition-colors">
                      {licao.nome}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">{licao.perguntas.length} perguntas</span>
                    <span className="text-slate-300 group-hover:text-indigo-400 transition-colors">→</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
