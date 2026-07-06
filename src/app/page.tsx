"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

export default function HomePage() {
  const [user, setUser] = useState<{ email?: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <div className="bounce-in mb-8">
        <div className="text-7xl">🧪</div>
      </div>

      <h1 className="text-4xl font-extrabold tracking-tight text-sains-green">
        SainsQuest
      </h1>
      <p className="mt-3 text-lg font-semibold text-gray-600">
        Belajar Sains Macam Main Game! 🎮
      </p>
      <p className="mt-2 max-w-sm text-sm text-gray-500">
        Jawab kuiz, kutip point, unlock badge, dan lawan kawan-kawan untuk jadi
        Juara Sains! Untuk murid Darjah 4, 5 & 6.
      </p>

      <div className="mt-8 flex gap-3">
        {user ? (
          <Link href="/dashboard" className="btn-primary text-lg px-8 py-3">
            Mula Belajar 🚀
          </Link>
        ) : (
          <>
            <Link href="/auth/login" className="btn-primary text-base">
              Log Masuk
            </Link>
            <Link
              href="/auth/register"
              className="rounded-xl border-2 border-emerald-500 px-6 py-3 font-bold text-emerald-600 transition-all hover:bg-emerald-50"
            >
              Daftar
            </Link>
          </>
        )}
      </div>

      <div className="mt-12 grid grid-cols-3 gap-4 max-w-sm">
        {[
          { emoji: "📚", label: "Topik Sains" },
          { emoji: "⭐", label: "Point & Badge" },
          { emoji: "🏆", label: "Leaderboard" },
        ].map((item) => (
          <div
            key={item.label}
            className="flex flex-col items-center gap-1 rounded-2xl bg-white/70 p-3 shadow-sm"
          >
            <span className="text-2xl">{item.emoji}</span>
            <span className="text-xs font-semibold text-gray-600">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
