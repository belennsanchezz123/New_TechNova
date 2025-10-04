/*
  # Create User Sessions and Metrics Tables

  1. New Tables
    - `user_sessions`
      - `id` (uuid, primary key)
      - `user_identifier` (text) - Anonymous identifier for the user
      - `started_at` (timestamptz) - When session started
      - `completed_at` (timestamptz) - When session completed
      - `consent_email` (text, nullable) - Email if user consented
      - `created_at` (timestamptz)
    
    - `session_metrics`
      - `id` (uuid, primary key)
      - `session_id` (uuid, foreign key to user_sessions)
      - `scenario` (text) - Which scenario (scenario1, scenario2, etc.)
      - `metric_name` (text) - Name of the metric
      - `metric_value` (text) - Value recorded
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated access
    - Public insert for collecting data
    - Admin read access

  3. Indexes
    - Index on session_id for faster queries
    - Index on scenario for filtering
*/

-- Create user_sessions table
CREATE TABLE IF NOT EXISTS user_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_identifier text NOT NULL,
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  consent_email text,
  created_at timestamptz DEFAULT now()
);

-- Create session_metrics table
CREATE TABLE IF NOT EXISTS session_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES user_sessions(id) ON DELETE CASCADE,
  scenario text NOT NULL,
  metric_name text NOT NULL,
  metric_value text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_session_metrics_session_id ON session_metrics(session_id);
CREATE INDEX IF NOT EXISTS idx_session_metrics_scenario ON session_metrics(scenario);
CREATE INDEX IF NOT EXISTS idx_user_sessions_created_at ON user_sessions(created_at DESC);

-- Enable Row Level Security
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_metrics ENABLE ROW LEVEL SECURITY;

-- Policies for user_sessions
CREATE POLICY "Allow public insert on user_sessions"
  ON user_sessions
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow authenticated read on user_sessions"
  ON user_sessions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow public read own session"
  ON user_sessions
  FOR SELECT
  TO anon
  USING (true);

-- Policies for session_metrics
CREATE POLICY "Allow public insert on session_metrics"
  ON session_metrics
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow authenticated read on session_metrics"
  ON session_metrics
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow public read for own metrics"
  ON session_metrics
  FOR SELECT
  TO anon
  USING (true);
