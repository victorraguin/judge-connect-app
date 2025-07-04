/*
  # Schéma initial pour MTG Judge Connect

  1. Nouvelles Tables
    - `profiles` - Profils utilisateurs avec rôles (user/judge/admin)
    - `judge_info` - Informations spécifiques aux juges (niveau, spécialités, etc.)
    - `questions` - Questions posées par les utilisateurs
    - `conversations` - Conversations entre utilisateurs et juges
    - `messages` - Messages dans les conversations
    - `ratings` - Évaluations des conversations
    - `disputes` - Gestion des désaccords
    - `rewards` - Système de récompenses pour les juges
    - `notifications` - Notifications push

  2. Sécurité
    - Enable RLS sur toutes les tables
    - Politiques pour chaque rôle (user, judge, admin)
    - Sécurité des données sensibles

  3. Fonctionnalités
    - Système de points et récompenses
    - Gestion des conflits
    - Historique complet des conversations
    - Notifications en temps réel
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('user', 'judge', 'admin');
CREATE TYPE judge_level AS ENUM ('L1', 'L2', 'L3');
CREATE TYPE question_status AS ENUM ('waiting_for_judge', 'assigned', 'in_progress', 'completed', 'disputed', 'resolved');
CREATE TYPE conversation_status AS ENUM ('active', 'ended', 'disputed');
CREATE TYPE message_type AS ENUM ('text', 'image', 'system');
CREATE TYPE dispute_status AS ENUM ('pending', 'under_review', 'resolved');

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  avatar_url text,
  role user_role DEFAULT 'user' NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  last_seen timestamptz DEFAULT now(),
  is_online boolean DEFAULT false,
  notification_preferences jsonb DEFAULT '{"push": true, "email": true}'::jsonb
);

-- Judge specific information
CREATE TABLE IF NOT EXISTS judge_info (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  judge_level judge_level NOT NULL,
  specialties text[] DEFAULT '{}',
  languages text[] DEFAULT '{"English"}',
  total_points integer DEFAULT 0,
  total_questions_answered integer DEFAULT 0,
  average_rating numeric(3,2) DEFAULT 0.0,
  average_response_time interval DEFAULT '0 minutes',
  badges text[] DEFAULT '{}',
  bio text,
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Questions table
CREATE TABLE IF NOT EXISTS questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  category text NOT NULL,
  image_url text,
  status question_status DEFAULT 'waiting_for_judge' NOT NULL,
  assigned_judge_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  assigned_at timestamptz,
  completed_at timestamptz,
  timeout_at timestamptz DEFAULT (now() + interval '8 minutes') NOT NULL
);

-- Conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id uuid REFERENCES questions(id) ON DELETE CASCADE UNIQUE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  judge_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  status conversation_status DEFAULT 'active' NOT NULL,
  started_at timestamptz DEFAULT now() NOT NULL,
  ended_at timestamptz,
  last_message_at timestamptz DEFAULT now() NOT NULL
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES conversations(id) ON DELETE CASCADE NOT NULL,
  sender_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content text,
  message_type message_type DEFAULT 'text' NOT NULL,
  image_url text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now() NOT NULL,
  read_at timestamptz
);

-- Ratings table
CREATE TABLE IF NOT EXISTS ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES conversations(id) ON DELETE CASCADE UNIQUE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  judge_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  rating integer CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  feedback text,
  is_accepted boolean NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Disputes table
CREATE TABLE IF NOT EXISTS disputes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES conversations(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  judge_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  user_justification text NOT NULL,
  judge_justification text,
  admin_notes text,
  status dispute_status DEFAULT 'pending' NOT NULL,
  resolved_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  resolved_at timestamptz
);

-- Rewards table
CREATE TABLE IF NOT EXISTS rewards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  judge_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  points_earned integer NOT NULL,
  reason text NOT NULL,
  conversation_id uuid REFERENCES conversations(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  type text NOT NULL,
  data jsonb DEFAULT '{}'::jsonb,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE judge_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON profiles
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- Judge info policies
CREATE POLICY "Anyone can view judge info" ON judge_info
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Judges can update own info" ON judge_info
  FOR UPDATE TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('judge', 'admin'))
    AND user_id = auth.uid()
  );

CREATE POLICY "Admins can manage judge info" ON judge_info
  FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Questions policies
CREATE POLICY "Users can view own questions" ON questions
  FOR SELECT TO authenticated USING (
    user_id = auth.uid() OR 
    assigned_judge_id = auth.uid() OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Users can create questions" ON questions
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY "Judges can update assigned questions" ON questions
  FOR UPDATE TO authenticated USING (
    assigned_judge_id = auth.uid() OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Conversations policies
CREATE POLICY "Participants can view conversations" ON conversations
  FOR SELECT TO authenticated USING (
    user_id = auth.uid() OR 
    judge_id = auth.uid() OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Judges can create conversations" ON conversations
  FOR INSERT TO authenticated WITH CHECK (
    judge_id = auth.uid() AND
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('judge', 'admin'))
  );

CREATE POLICY "Participants can update conversations" ON conversations
  FOR UPDATE TO authenticated USING (
    user_id = auth.uid() OR judge_id = auth.uid() OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Messages policies
CREATE POLICY "Conversation participants can view messages" ON messages
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM conversations 
      WHERE id = conversation_id 
      AND (user_id = auth.uid() OR judge_id = auth.uid())
    ) OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Conversation participants can send messages" ON messages
  FOR INSERT TO authenticated WITH CHECK (
    sender_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM conversations 
      WHERE id = conversation_id 
      AND (user_id = auth.uid() OR judge_id = auth.uid())
    )
  );

-- Ratings policies
CREATE POLICY "Participants can view ratings" ON ratings
  FOR SELECT TO authenticated USING (
    user_id = auth.uid() OR 
    judge_id = auth.uid() OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Users can create ratings" ON ratings
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- Disputes policies
CREATE POLICY "Participants and admins can view disputes" ON disputes
  FOR SELECT TO authenticated USING (
    user_id = auth.uid() OR 
    judge_id = auth.uid() OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Participants can create disputes" ON disputes
  FOR INSERT TO authenticated WITH CHECK (
    user_id = auth.uid() OR judge_id = auth.uid()
  );

CREATE POLICY "Admins can update disputes" ON disputes
  FOR UPDATE TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Rewards policies
CREATE POLICY "Judges can view own rewards" ON rewards
  FOR SELECT TO authenticated USING (
    judge_id = auth.uid() OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "System can create rewards" ON rewards
  FOR INSERT TO authenticated WITH CHECK (true);

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE TO authenticated USING (user_id = auth.uid());

CREATE POLICY "System can create notifications" ON notifications
  FOR INSERT TO authenticated WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_online ON profiles(is_online);
CREATE INDEX IF NOT EXISTS idx_judge_info_available ON judge_info(is_available);
CREATE INDEX IF NOT EXISTS idx_questions_status ON questions(status);
CREATE INDEX IF NOT EXISTS idx_questions_timeout ON questions(timeout_at);
CREATE INDEX IF NOT EXISTS idx_conversations_status ON conversations(status);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id, created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id, read);

-- Create functions for automatic updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_judge_info_updated_at BEFORE UPDATE ON judge_info
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to auto-timeout questions
CREATE OR REPLACE FUNCTION handle_question_timeout()
RETURNS void AS $$
BEGIN
  UPDATE questions 
  SET status = 'completed'
  WHERE status = 'waiting_for_judge' 
  AND timeout_at < now();
END;
$$ language 'plpgsql' SECURITY DEFINER;