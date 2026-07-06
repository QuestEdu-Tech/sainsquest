-- SainsQuest Database Schema
-- Run in Supabase SQL Editor

-- 1. Profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  points INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  experience INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  last_quiz_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger: auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 2. Topics
CREATE TABLE topics (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  name_ms TEXT NOT NULL,
  description TEXT,
  icon TEXT DEFAULT '📚',
  grade_level INTEGER NOT NULL CHECK (grade_level BETWEEN 1 AND 6),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Questions
CREATE TABLE questions (
  id BIGSERIAL PRIMARY KEY,
  topic_id BIGINT REFERENCES topics(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_answer INTEGER NOT NULL,
  explanation TEXT,
  points INTEGER DEFAULT 10,
  grade_level INTEGER NOT NULL CHECK (grade_level BETWEEN 1 AND 6),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Quiz Attempts
CREATE TABLE quiz_attempts (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  topic_id BIGINT REFERENCES topics(id) ON DELETE CASCADE,
  score INTEGER DEFAULT 0,
  total_questions INTEGER NOT NULL,
  correct_answers INTEGER DEFAULT 0,
  xp_earned INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Badges
CREATE TABLE badges (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT DEFAULT '🏅',
  criteria_type TEXT NOT NULL,
  criteria_value INTEGER NOT NULL
);

-- 6. User Badges (earned badges)
CREATE TABLE user_badges (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id BIGINT REFERENCES badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

-- Indexes for performance
CREATE INDEX idx_questions_topic_id ON questions(topic_id);
CREATE INDEX idx_questions_grade_level ON questions(grade_level);
CREATE INDEX idx_quiz_attempts_user_id ON quiz_attempts(user_id);
CREATE INDEX idx_quiz_attempts_topic_id ON quiz_attempts(topic_id);
CREATE INDEX idx_user_badges_user_id ON user_badges(user_id);

-- Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Topics are viewable by authenticated users" ON topics
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Questions are viewable by authenticated users" ON questions
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can view own attempts" ON quiz_attempts
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own attempts" ON quiz_attempts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Badges are viewable by everyone" ON badges
  FOR SELECT USING (true);

CREATE POLICY "User badges are viewable by everyone" ON user_badges
  FOR SELECT USING (true);

-- Insert demo topics
INSERT INTO topics (name, name_ms, description, icon, grade_level) VALUES
('Manusia & Haiwan', 'Manusia & Haiwan', 'Organ pernafasan, sistem badan, dan habitat', '🫁', 4),
('Tumbuhan', 'Tumbuhan', 'Fotosintesis, pembiakan, dan gerak balas tumbuhan', '🌿', 4),
('Elektrik & Magnet', 'Elektrik & Magnet', 'Litar elektrik, magnet, dan elektromagnet', '⚡', 5),
('Tenaga', 'Tenaga', 'Bentuk tenaga, transformasi tenaga, dan sumber tenaga', '🔋', 5),
('Bahan & Campuran', 'Bahan & Campuran', 'Asid, alkali, pengaratan, dan pengawetan', '🧪', 6),
('Daya & Gerakan', 'Daya & Gerakan', 'Daya geseran, kelajuan, dan mesin ringkas', '🚀', 6);

-- Insert demo questions for Topic 1: Manusia & Haiwan
INSERT INTO questions (topic_id, question_text, options, correct_answer, explanation, points, grade_level) VALUES
(1, 'Apakah organ pernafasan utama bagi manusia?', '["Jantung", "Paru-paru", "Hati", "Buah pinggang"]', 1, 'Paru-paru adalah organ utama sistem pernafasan manusia.', 10, 4),
(1, 'Semasa menarik nafas, udara memasuki badan melalui...', '["Hidung → Trakea → Paru-paru", "Mulut → Perut → Jantung", "Hidung → Otak → Paru-paru", "Kulit → Darah → Paru-paru"]', 0, 'Udara masuk melalui hidung, turun ke trakea, kemudian ke paru-paru.', 10, 4),
(1, 'Haiwan manakah bernafas menggunakan insang?', '["Kucing", "Burung", "Ikan", "Ular"]', 2, 'Ikan bernafas menggunakan insang untuk menyerap oksigen dari air.', 10, 4),
(1, 'Berapakah kadar pernafasan normal manusia dewasa seminit?', '["5-10 kali", "12-20 kali", "30-40 kali", "50-60 kali"]', 1, 'Kadar pernafasan normal manusia dewasa adalah 12-20 kali seminit.', 10, 4),
(1, 'Gas apakah yang diserap oleh darah dari udara semasa pernafasan?', '["Nitrogen", "Karbon dioksida", "Oksigen", "Helium"]', 2, 'Oksigen diserap oleh darah dari udara dalam paru-paru.', 10, 4);

-- Insert demo badges
INSERT INTO badges (name, description, icon, criteria_type, criteria_value) VALUES
('Saintis Muda', 'Selesaikan kuiz pertama anda!', '🔬', 'quizzes_completed', 1),
('Kuiz Rajin', 'Selesaikan 5 kuiz', '📝', 'quizzes_completed', 5),
('Pakar Sains', 'Jawab 50 soalan dengan betul', '🧠', 'correct_answers', 50),
('Pakar Tenaga', 'Dapat skor sempurna dalam topik Tenaga', '⚡', 'perfect_score', 1),
('Juara Sains', 'Kumpul 1000 point', '🏆', 'points', 1000),
('Streak 7 Hari', 'Main 7 hari berturut-turut', '🔥', 'streak', 7);
