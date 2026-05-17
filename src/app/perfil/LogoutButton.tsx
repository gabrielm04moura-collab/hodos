"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  async function sair() {
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <button onClick={sair} className="text-sm text-slate-400 hover:text-red-500 transition-colors">
      Sair
    </button>
  );
}
