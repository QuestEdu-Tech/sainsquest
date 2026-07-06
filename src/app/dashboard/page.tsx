"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import type { Profile, Topic } from "@/types"

const DEMO_TOPICS: Topic[] = [
  {
    id: "1",
    name: "Manusia & Haiwan",
    name_ms: "Manusia & Haiwan",
    description: "Organ pernafasan, sistem badan, dan habitat",
    icon: "🫁",
    grade_level: 4,
    question_count: 10,
  },
  {
    id: "2",
    name: "Tumbuhan",
    name_ms: "Tumbuhan",
    description: "Fotosintesis, pembiakan, dan gerak balas tumbuhan",
    icon: "🌿",
    grade_level: 4,
    question_count: 8,
  },
  {
    id: "3",
    name: "Elektrik & Magnet",
    name_ms: "Elektrik & Magnet",
    description: "Litar elektrik, magnet, dan elektromagnet",
    icon: "⚡",
    grade_level: 5,
    question_count: 12,
  },
  {
    id: "4",
    name: "Tenaga",
    name_ms: "Tenaga",
    description: "Bentuk tenaga, transformasi tenaga, dan sumber tenaga",
    icon: "🔋",
    grade_level: 5,
    question_count: 10,
  },
  {
    id: "5",
    name: "Bahan & Campuran",
    name_ms: "Bahan & Campuran",
    description: "Asid, alkali, pengaratan, dan pengawetan",
    icon: "🧪",
    grade_level: 6,
    question_count: 10,
  },
  {
    id: "6",
    name: "Daya & Gerakan",
    name_ms: "Daya & Gerakan",
    description: "Daya geseran, kelajuan, dan mesin ringkas",
    icon: "🚀",
    grade_level: 6,
    question_count: 8,
  },
]

const DEMO_BADGES = [
  { name: "Saintis Muda", icon: "🔬", earned: true },
  { name: "Kuiz Rajin", icon: "📝", earned: true },
  { name: "Pakar Tenaga", icon: "⚡", earned: false },
  { name: "Juara Sains", icon: "🏆", earned: false },
]

export default function DashboardPage() {
  const [user, setUser] = useState<{ email?: string; user_metadata?: { username?: string } } | null>(null)
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

  const username = user?.user_metadata?.username || user?.email?.split("@")[0] || "Saintis"
  const level = 3
  const xp = 145
  const xpToNext = 200
  const xpPercent = (xp / xpToNext) * 100
  const points = 520
  const streak = 3

  return (
    <div className="mx-auto max-w-lg px-4 pt-8 pb-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Selamat datang,</p>
          <h1 className="text-2xl font-extrabold text-sains-green">
            {username}! 👋
          </h1>
        </div>
        <div className="flex items-center gap-2 rounded-2xl bg-white/80 px-4 py-2 shadow-sm">
          <span className="text-xl">🔥</span>
          <span className="text-lg font-bold text-sains-orange">{streak} hari</span>
        </div>
      </div>

      <div className="card mb-6 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Level
            </p>
            <p className="text-3xl font-extrabold text-sains-purple">{level}</p>
          </div>
          <div className="flex-1 px-4">
            <p className="mb-1 text-xs font-medium text-gray-500">
              {xp} / {xpToNext} XP
            </p>
            <div className="xp-bar">
              <div
                className="xp-bar-fill"
                style={{ width: `${xpPercent}%` }}
              />
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Point
            </p>
            <p className="text-3xl font-extrabold text-sains-orange">
              {points}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="mb-3 text-lg font-bold text-gray-700">Badge</h2>
        <div className="flex gap-3">
          {DEMO_BADGES.map((badge) => (
            <div
              key={badge.name}
              className={`flex flex-col items-center gap-1 rounded-2xl px-4 py-3 text-center ${
                badge.earned
                  ? "bg-white/80 shadow-sm"
                  : "bg-gray-100/50 opacity-50"
              }`}
            >
              <span className="text-2xl">{badge.earned ? badge.icon : "🔒"}</span>
              <span className="text-[10px] font-semibold text-gray-600 leading-tight">
                {badge.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <h2 className="mb-3 text-lg font-bold text-gray-700">Topik Sains</h2>
      <div className="grid gap-3">
        {DEMO_TOPICS.map((topic, i) => (
          <Link
            key={topic.id}
            href={`/quiz/${topic.id}?name=${encodeURIComponent(topic.name_ms)}`}
            className="card-game flex items-center gap-4 bg-white/85 p-4"
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <span className="text-3xl">{topic.icon}</span>
            <div className="flex-1">
              <h3 className="font-bold text-gray-800">{topic.name_ms}</h3>
              <p className="text-xs text-gray-500">
                Darjah {topic.grade_level} · {topic.question_count} soalan
              </p>
            </div>
            <span className="text-xl text-gray-300">▶</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
