/*
  # Create breach checks table

  1. New Tables
    - `breach_checks`
      - `id` (bigint, primary key, auto-increment)
      - `participant_id` (uuid, linked to registrations)
      - `email` (text, the checked email)
      - `breach_count` (integer, number of breaches found)
      - `paste_count` (integer, number of pastes found)
      - `breaches_data` (jsonb, detailed breach information)
      - `data_types_exposed` (text array, types of data compromised)
      - `total_accounts_affected` (bigint, sum of all breach counts)
      - `most_recent_breach_date` (date, date of most recent breach)
      - `checked_at` (timestamp)
      - `created_at` (timestamp)
  
  2. Security
    - Enable RLS on `breach_checks` table
    - Add policy for service role to manage data
    - Add policy for authenticated users to read data

  3. Indexes
    - Add index on participant_id for faster lookups
    - Add index on email for searching
    - Add index on checked_at for time-based queries
*/

CREATE TABLE IF NOT EXISTS breach_checks (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  participant_id uuid,
  email text NOT NULL,
  breach_count integer DEFAULT 0,
  paste_count integer DEFAULT 0,
  breaches_data jsonb DEFAULT '[]'::jsonb,
  data_types_exposed text[] DEFAULT ARRAY[]::text[],
  total_accounts_affected bigint DEFAULT 0,
  most_recent_breach_date date,
  checked_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE breach_checks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage breach checks"
  ON breach_checks
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can read breach checks"
  ON breach_checks
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anonymous users can read breach checks"
  ON breach_checks
  FOR SELECT
  TO anon
  USING (true);

CREATE INDEX IF NOT EXISTS idx_breach_checks_participant_id ON breach_checks(participant_id);
CREATE INDEX IF NOT EXISTS idx_breach_checks_email ON breach_checks(email);
CREATE INDEX IF NOT EXISTS idx_breach_checks_checked_at ON breach_checks(checked_at DESC);