export interface Profile {
  id: string
  username: string
  avatar_url: string | null
  points: number
  level: number
  experience: number
  streak: number
  created_at: string
}

export interface Topic {
  id: string
  name: string
  name_ms: string
  description: string
  icon: string
  grade_level: number
  question_count: number
}

export interface Question {
  id: string
  topic_id: string
  question_text: string
  options: string[]
  correct_answer: number
  explanation: string
  points: number
  grade_level: number
}

export interface QuizAttempt {
  id: string
  user_id: string
  topic_id: string
  score: number
  total_questions: number
  correct_answers: number
  xp_earned: number
  completed_at: string
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  criteria_type: string
  criteria_value: number
}

export interface LeaderboardEntry {
  username: string
  points: number
  level: number
  avatar_url: string | null
}
