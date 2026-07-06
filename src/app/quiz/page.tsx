import Link from "next/link"
import type { Topic } from "@/types"

const TOPICS: Topic[] = [
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

export default function QuizListPage() {
  return (
    <div className="mx-auto max-w-lg px-4 pt-8 pb-6">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-sains-green">
          Pilih Topik 🧪
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Pilih topik untuk mula kuiz. Dapatkan skor tertinggi!
        </p>
      </div>

      <div className="mb-6 flex gap-2">
        {[4, 5, 6].map((grade) => (
          <button
            key={grade}
            className="rounded-xl bg-white/80 px-4 py-2 text-sm font-semibold text-gray-600 shadow-sm transition-all hover:bg-emerald-100 hover:text-emerald-700"
          >
            Darjah {grade}
          </button>
        ))}
      </div>

      <div className="grid gap-3">
        {TOPICS.map((topic, i) => (
          <Link
            key={topic.id}
            href={`/quiz/${topic.id}?name=${encodeURIComponent(topic.name_ms)}`}
            className="card-game flex items-center gap-4 bg-white/85 p-4"
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <span className="text-3xl">{topic.icon}</span>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-gray-800">{topic.name_ms}</h3>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                  Darjah {topic.grade_level}
                </span>
              </div>
              <p className="text-xs text-gray-500">{topic.description}</p>
              <p className="mt-1 text-xs font-medium text-gray-400">
                {topic.question_count} soalan
              </p>
            </div>
            <span className="text-xl text-gray-300">▶</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
