/*
  # Create Registrations Table

  1. New Tables
    - `registrations`
      - `id` (uuid, primary key)
      - `username` (text, not null)
      - `service` (text, not null) - Which Lynx service (lynx_mail, lynx_drive, lynx_events)
      - `password_strength` (text) - Strength rating of the password
      - `mfa_enabled` (boolean, default false) - Whether MFA was enabled
      - `created_at` (timestamptz, default now())
      
  2. Security
    - Enable RLS on registrations table
    - Add policy for public insert (to allow anonymous users to register)
    - Add policy for authenticated read access
    - Add policy for public read access (for checking duplicates)

  3. Constraints
    - Unique constraint on username + service combination
    
  4. Important Notes
    - This table tracks user registrations across different Lynx services
    - Each user can have one account per service
    - Username + service combination must be unique to prevent duplicates
*/

-- Create registrations table
CREATE TABLE IF NOT EXISTS registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text NOT NULL,
  service text NOT NULL,
  password_strength text DEFAULT '',
  mfa_enabled boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  UNIQUE(username, service)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_registrations_username_service ON registrations(username, service);
CREATE INDEX IF NOT EXISTS idx_registrations_created_at ON registrations(created_at DESC);

-- Enable Row Level Security
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Policy for public insert (allow anonymous registration)
CREATE POLICY "Allow public insert on registrations"
  ON registrations
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Policy for public select (allow checking for duplicates)
CREATE POLICY "Allow public read on registrations"
  ON registrations
  FOR SELECT
  TO anon
  USING (true);

-- Policy for authenticated read
CREATE POLICY "Allow authenticated read on registrations"
  ON registrations
  FOR SELECT
  TO authenticated
  USING (true);
