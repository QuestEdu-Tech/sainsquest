import type { LeaderboardEntry } from "@/types"

const DEMO_LEADERBOARD: LeaderboardEntry[] = [
  { username: "Saintis_Ali", points: 2850, level: 12, avatar_url: null },
  { username: "BioQueen88", points: 2720, level: 11, avatar_url: null },
  { username: "FizikPro", points: 2590, level: 10, avatar_url: null },
  { username: "ChemMaster", points: 2410, level: 9, avatar_url: null },
  { username: "EcoWarrior", points: 2280, level: 9, avatar_url: null },
  { username: "LabHero", points: 2150, level: 8, avatar_url: null },
  { username: "AtomGirl", points: 1980, level: 7, avatar_url: null },
  { username: "SpaceKid", points: 1840, level: 7, avatar_url: null },
  { username: "DinoFan", points: 1720, level: 6, avatar_url: null },
  { username: "RockStar", points: 1590, level: 6, avatar_url: null },
]

const MEDALS = ["🥇", "🥈", "🥉"]

export default function LeaderboardPage() {
  return (
    <div className="mx-auto max-w-lg px-4 pt-8 pb-6">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-sains-green">
          Papan Pendahulu 🏆
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Top 10 saintis dengan point tertinggi!
        </p>
      </div>

      <div className="card mb-6 p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-500">
            Kedudukan Anda
          </span>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-700">
            #15 - 520 point
          </span>
        </div>
      </div>

      <div className="space-y-2">
        {DEMO_LEADERBOARD.map((entry, index) => (
          <div
            key={entry.username}
            className={`card-game flex items-center gap-3 bg-white/85 p-3 ${
              index < 3 ? "border-l-4 border-l-amber-400" : ""
            }`}
          >
            <div className="flex h-9 w-9 items-center justify-center text-lg font-bold">
              {MEDALS[index] || (
                <span className="text-sm text-gray-400">#{index + 1}</span>
              )}
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-lg">
              {entry.avatar_url ? (
                <img
                  src={entry.avatar_url}
                  alt=""
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                "👤"
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-800">
                {entry.username}
              </p>
              <p className="text-xs text-gray-400">Level {entry.level}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-extrabold text-sains-orange">
                {entry.points.toLocaleString()}
              </p>
              <p className="text-[10px] font-medium text-gray-400">POINT</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-xl bg-amber-50 p-4 text-center">
        <p className="text-sm font-bold text-sains-orange">
          💡 Tip: Jawab kuiz setiap hari untuk naikkan ranking!
        </p>
      </div>
    </div>
  )
}
