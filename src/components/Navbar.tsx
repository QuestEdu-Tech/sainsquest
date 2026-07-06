"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<{ email?: string } | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/auth/login")
    router.refresh()
  }

  if (!user) return null

  const links = [
    { href: "/dashboard", label: "Utama" },
    { href: "/quiz", label: "Kuiz" },
    { href: "/leaderboard", label: "Ranking" },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t-4 border-emerald-500 bg-white/95 backdrop-blur shadow-[0_-4px_20px_rgba(0,0,0,0.08)] safe-area-bottom">
      <div className="mx-auto flex max-w-lg items-center justify-around py-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex flex-col items-center gap-0.5 rounded-xl px-4 py-1.5 text-xs font-semibold transition-all duration-200 ${
              pathname.startsWith(link.href)
                ? "scale-110 text-emerald-600"
                : "text-gray-400 hover:text-emerald-500"
            }`}
          >
            <span className="text-xl">
              {link.href === "/dashboard" && "🏠"}
              {link.href === "/quiz" && "🧪"}
              {link.href === "/leaderboard" && "🏆"}
            </span>
            {link.label}
          </Link>
        ))}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center gap-0.5 rounded-xl px-4 py-1.5 text-xs font-semibold text-gray-400 transition-all duration-200 hover:text-red-500"
        >
          <span className="text-xl">🚪</span>
          Keluar
        </button>
      </div>
    </nav>
  )
}
