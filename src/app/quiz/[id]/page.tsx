"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, useSearchParams } from "next/navigation"
import Link from "next/link"

interface QuizQuestion {
  id: number
  question: string
  options: string[]
  correct: number
  explanation: string
}

const DEMO_QUESTIONS: Record<string, QuizQuestion[]> = {
  "1": [
    {
      id: 1,
      question: "Apakah organ pernafasan utama bagi manusia?",
      options: ["Jantung", "Paru-paru", "Hati", "Buah pinggang"],
      correct: 1,
      explanation: "Paru-paru adalah organ utama sistem pernafasan manusia.",
    },
    {
      id: 2,
      question: "Semasa menarik nafas, udara memasuki badan melalui...",
      options: ["Hidung → Trakea → Paru-paru", "Mulut → Perut → Jantung", "Hidung → Otak → Paru-paru", "Kulit → Darah → Paru-paru"],
      correct: 0,
      explanation: "Udara masuk melalui hidung, turun ke trakea, kemudian ke paru-paru.",
    },
    {
      id: 3,
      question: "Haiwan manakah bernafas menggunakan insang?",
      options: ["Kucing", "Burung", "Ikan", "Ular"],
      correct: 2,
      explanation: "Ikan bernafas menggunakan insang untuk menyerap oksigen dari air.",
    },
    {
      id: 4,
      question: "Berapakah kadar pernafasan normal manusia dewasa seminit?",
      options: ["5-10 kali", "12-20 kali", "30-40 kali", "50-60 kali"],
      correct: 1,
      explanation: "Kadar pernafasan normal manusia dewasa adalah 12-20 kali seminit.",
    },
    {
      id: 5,
      question: "Gas apakah yang diserap oleh darah dari udara semasa pernafasan?",
      options: ["Nitrogen", "Karbon dioksida", "Oksigen", "Helium"],
      correct: 2,
      explanation: "Oksigen diserap oleh darah dari udara dalam paru-paru.",
    },
  ],
  "3": [
    {
      id: 1,
      question: "Apakah yang diperlukan untuk melengkapkan litar elektrik?",
      options: ["Wayar sahaja", "Bateri, wayar, dan mentol (litar lengkap)", "Mentol sahaja", "Suis sahaja"],
      correct: 1,
      explanation: "Litar lengkap memerlukan sumber kuasa (bateri), konduktor (wayar), dan beban (mentol).",
    },
    {
      id: 2,
      question: "Apakah fungsi suis dalam litar elektrik?",
      options: ["Menambah kuasa", "Membuka dan menutup litar", "Menyimpan tenaga", "Menukar warna mentol"],
      correct: 1,
      explanation: "Suis berfungsi untuk membuka dan menutup litar elektrik.",
    },
    {
      id: 3,
      question: "Antara berikut, yang manakah konduktor elektrik yang baik?",
      options: ["Kayu", "Plastik", "Kuprum (tembaga)", "Getah"],
      correct: 2,
      explanation: "Kuprum adalah konduktor elektrik yang sangat baik. Kayu, plastik, dan getah adalah penebat.",
    },
    {
      id: 4,
      question: "Apakah yang berlaku apabila dua kutub utara magnet didekatkan?",
      options: ["Tertarik", "Tolak-menolak", "Tiada kesan", "Bercantum"],
      correct: 1,
      explanation: "Kutub yang sama pada magnet akan tolak-menolak.",
    },
    {
      id: 5,
      question: "Elektromagnet dihasilkan apabila...",
      options: ["Besi dipanaskan", "Arus elektrik mengalir melalui gegelung wayar", "Magnet dipukul", "Air mengalir"],
      correct: 1,
      explanation: "Elektromagnet terhasil apabila arus elektrik mengalir melalui gegelung wayar yang dililit pada teras besi.",
    },
  ],
  "5": [
    {
      id: 1,
      question: "Antara berikut, yang manakah asid?",
      options: ["Air sabun", "Cuka", "Air garam", "Susu magnesia"],
      correct: 1,
      explanation: "Cuka mengandungi asid asetik dan mempunyai rasa masam.",
    },
    {
      id: 2,
      question: "Apakah warna kertas litmus dalam larutan alkali?",
      options: ["Merah", "Biru", "Hijau", "Kuning"],
      correct: 1,
      explanation: "Kertas litmus bertukar menjadi biru dalam larutan alkali.",
    },
    {
      id: 3,
      question: "Proses pengaratan besi memerlukan...",
      options: ["Hanya oksigen", "Hanya air", "Oksigen dan air", "Hanya cahaya matahari"],
      correct: 2,
      explanation: "Pengaratan berlaku apabila besi terdedah kepada oksigen dan air.",
    },
    {
      id: 4,
      question: "Apakah cara terbaik untuk mencegah pengaratan?",
      options: ["Biarkan besi dalam air", "Cat atau galvanisasi (salut zink)", "Panaskan besi", "Tutup dengan kain"],
      correct: 1,
      explanation: "Mengecat atau galvanisasi (menyalut dengan zink) adalah cara mencegah pengaratan.",
    },
    {
      id: 5,
      question: "Antara berikut, yang manakah kaedah pengawetan makanan?",
      options: ["Membiarkan di luar", "Penjerukan (pengasinan)", "Merendam dalam air", "Mendedah kepada cahaya"],
      correct: 1,
      explanation: "Penjerukan menggunakan garam adalah kaedah tradisional pengawetan makanan.",
    },
  ],
}

function getQuestionsForTopic(topicId: string): QuizQuestion[] {
  return DEMO_QUESTIONS[topicId] || DEMO_QUESTIONS["1"] || []
}

export default function QuizPlayPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const topicId = (params.id as string) || "1"
  const topicName = searchParams.get("name") || "Kuiz Sains"

  const [questions] = useState(() => getQuestionsForTopic(topicId))
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [answers, setAnswers] = useState<{ correct: boolean }[]>([])
  const [timeLeft, setTimeLeft] = useState(30)
  const [quizFinished, setQuizFinished] = useState(false)
  const [streak, setStreak] = useState(0)

  const currentQuestion = questions[currentIndex]

  useEffect(() => {
    if (quizFinished || showResult) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimeout()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [currentIndex, quizFinished, showResult])

  const handleTimeout = useCallback(() => {
    if (showResult) return
    setShowResult(true)
    setSelectedAnswer(null)
    setAnswers((prev) => [...prev, { correct: false }])
  }, [showResult])

  const handleAnswer = (optionIndex: number) => {
    if (showResult) return

    setSelectedAnswer(optionIndex)
    setShowResult(true)

    const isCorrect = optionIndex === currentQuestion.correct
    if (isCorrect) {
      const timeBonus = Math.ceil(timeLeft / 3)
      setScore((prev) => prev + 10 + timeBonus)
      setStreak((prev) => prev + 1)
    } else {
      setStreak(0)
    }

    setAnswers((prev) => [...prev, { correct: isCorrect }])
  }

  const nextQuestion = () => {
    setSelectedAnswer(null)
    setShowResult(false)
    setTimeLeft(30)

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1)
    } else {
      setQuizFinished(true)
    }
  }

  if (quizFinished) {
    const correctCount = answers.filter((a) => a.correct).length
    const xpEarned = score
    const percent = Math.round((correctCount / questions.length) * 100)
    const isPerfect = correctCount === questions.length

    return (
      <div className="mx-auto max-w-lg px-4 pt-8 pb-6">
        <div className="card p-6 text-center">
          <div className="bounce-in mb-4 text-6xl">
            {isPerfect ? "🏆" : percent >= 70 ? "🌟" : "💪"}
          </div>
          <h1 className="text-2xl font-extrabold text-sains-green">
            {isPerfect ? "SEMPURNA!" : percent >= 70 ? "Hebat!" : "Teruskan Usaha!"}
          </h1>
          <p className="mt-2 text-gray-500">
            Anda jawab {correctCount} / {questions.length} soalan dengan betul
          </p>

          <div className="mt-6 rounded-2xl bg-emerald-50 p-4">
            <p className="text-sm text-gray-500">Skor</p>
            <p className="text-4xl font-extrabold text-sains-green">{score}</p>
            <p className="text-sm font-medium text-sains-orange">
              +{xpEarned} XP diperolehi!
            </p>
          </div>

          <div className="mt-4 rounded-2xl bg-white/60 p-4">
            <p className="text-sm font-bold text-gray-600">
              {percent}% betul
            </p>
            <div className="xp-bar mt-2">
              <div
                className="xp-bar-fill"
                style={{
                  width: `${percent}%`,
                  background:
                    percent >= 80
                      ? "linear-gradient(90deg, #10b981, #34d399)"
                      : percent >= 50
                        ? "linear-gradient(90deg, #f59e0b, #fbbf24)"
                        : "linear-gradient(90deg, #ef4444, #f87171)",
                }}
              />
            </div>
          </div>

          {streak >= 3 && (
            <div className="mt-4 rounded-xl bg-amber-50 p-3">
              <p className="font-bold text-sains-orange">
                🔥 Kombo {streak} berturut-turut!
              </p>
            </div>
          )}

          <div className="mt-6 flex flex-col gap-3">
            <Link
              href={`/quiz/${topicId}?name=${encodeURIComponent(topicName)}`}
              className="btn-primary text-center"
            >
              Cuba Lagi 🔄
            </Link>
            <Link
              href="/quiz"
              className="rounded-xl border-2 border-emerald-500 px-6 py-3 text-center font-bold text-emerald-600"
            >
              Topik Lain 📚
            </Link>
            <Link
              href="/dashboard"
              className="rounded-xl border-2 border-gray-300 px-6 py-3 text-center font-bold text-gray-500"
            >
              Dashboard 🏠
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!currentQuestion) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Tiada soalan untuk topik ini.</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-lg px-4 pt-6 pb-6">
      <div className="mb-4 flex items-center justify-between">
        <Link href="/quiz" className="text-sm font-medium text-gray-400">
          ← Keluar
        </Link>
        <span className="text-sm font-bold text-gray-500">
          {currentIndex + 1} / {questions.length}
        </span>
        <span className="text-sm font-bold text-emerald-600">
          ⭐ {score}
        </span>
      </div>

      <div className="mb-1 text-xs font-medium text-gray-400">
        Soalan {currentIndex + 1} dari {questions.length}
      </div>

      <div className="xp-bar mb-4">
        <div
          className="xp-bar-fill"
          style={{
            width: `${((currentIndex + 1) / questions.length) * 100}%`,
            background: "linear-gradient(90deg, #059669, #10b981)",
          }}
        />
      </div>

      {streak >= 2 && (
        <div className="mb-3 text-center">
          <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-bold text-amber-600">
            🔥 Kombo x{streak}!
          </span>
        </div>
      )}

      <div className="mb-4 flex items-center justify-center gap-2">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-full text-lg font-extrabold ${
            timeLeft <= 5
              ? "animate-pulse bg-red-100 text-red-600"
              : timeLeft <= 10
                ? "bg-amber-100 text-amber-600"
                : "bg-emerald-100 text-emerald-600"
          }`}
        >
          {timeLeft}
        </div>
        <span className="text-sm text-gray-400">saat</span>
      </div>

      <div className="card mb-4 p-5">
        <h2 className="text-lg font-bold text-gray-800 leading-relaxed">
          {currentQuestion.question}
        </h2>
      </div>

      <div className="grid gap-3">
        {currentQuestion.options.map((option, idx) => {
          let buttonStyle =
            "card-game bg-white/85 p-4 text-left font-medium text-gray-700 border-2 border-transparent"

          if (showResult) {
            if (idx === currentQuestion.correct) {
              buttonStyle =
                "card-game bg-emerald-50 p-4 text-left font-medium text-emerald-700 border-2 border-emerald-400"
            } else if (idx === selectedAnswer && idx !== currentQuestion.correct) {
              buttonStyle =
                "card-game bg-red-50 p-4 text-left font-medium text-red-600 border-2 border-red-300"
            } else {
              buttonStyle =
                "card-game bg-white/50 p-4 text-left font-medium text-gray-400 border-2 border-transparent opacity-60"
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleAnswer(idx)}
              disabled={showResult}
              className={buttonStyle}
            >
              <span className="mr-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-500">
                {String.fromCharCode(65 + idx)}
              </span>
              {option}
            </button>
          )
        })}
      </div>

      {showResult && (
        <div className="mt-4 card p-4 bounce-in">
          <p
            className={`text-sm font-bold ${
              selectedAnswer === currentQuestion.correct
                ? "text-emerald-600"
                : "text-red-500"
            }`}
          >
            {selectedAnswer === currentQuestion.correct
              ? "✅ Betul! +10 mata"
              : selectedAnswer === null
                ? "⏰ Masa tamat!"
                : "❌ Salah!"}
          </p>
          <p className="mt-1 text-sm text-gray-600">
            {currentQuestion.explanation}
          </p>
          <button
            onClick={nextQuestion}
            className="btn-primary mt-3 w-full text-sm"
          >
            {currentIndex + 1 < questions.length ? "Soalan Seterusnya →" : "Lihat Keputusan 🎉"}
          </button>
        </div>
      )}
    </div>
  )
}
