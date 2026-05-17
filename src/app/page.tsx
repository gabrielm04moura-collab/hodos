import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
      <div className="mb-6 text-7xl">✝️</div>
      <h1 className="text-5xl font-bold text-indigo-700 mb-3">Hodos</h1>
      <p className="text-slate-500 italic text-lg mb-2">
        "Eu sou o caminho, a verdade e a vida." — João 14:6
      </p>
      <p className="text-slate-600 max-w-md mt-4 mb-10 text-base leading-relaxed">
        Aprenda a Bíblia de um jeito novo: trilhas temáticas, perguntas, ofensivas diárias e ligas.
        Tudo isso avançando pela Palavra.
      </p>
      <Link
        href="/mapa"
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-4 rounded-2xl text-lg transition-colors shadow-md"
      >
        Começar jornada
      </Link>
      <p className="mt-6 text-slate-400 text-sm">Gratuito. Sem anúncios. Para a glória de Deus.</p>
    </main>
  );
}
