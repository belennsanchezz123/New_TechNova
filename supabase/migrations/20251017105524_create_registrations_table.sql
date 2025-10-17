/*
  # Create registrations table for LYNX platform evaluation

  ## Overview
  This migration creates the main table for storing user registration data during the LYNX platform evaluation simulation.

  ## Tables Created
  
  ### `registrations`
  Stores participant registration attempts and security choices during the simulation.
  
  #### Columns:
  - `id` (bigint, primary key, auto-increment) - Unique identifier for each registration
  - `participant_id` (uuid, nullable) - Anonymous participant identifier for tracking across sessions
  - `username` (text, required) - Username chosen by participant
  - `service` (text, required) - Service name (e.g., 'mail', 'drive', 'events')
  - `password_strength` (text, nullable) - Strength of password chosen ('weak', 'medium', 'strong')
  - `password_reuse_count` (integer, default 0) - Number of times password was reused across services
  - `mfa_enabled` (boolean, default false) - Whether multi-factor authentication was enabled
  - `created_at` (timestamptz, default now()) - Timestamp of registration (UTC)
  - `created_at_madrid` (timestamp, generated) - Timestamp in Europe/Madrid timezone

  #### Constraints:
  - Primary key on `id`
  - Unique constraint on (`username`, `service`) - prevents duplicate registrations
  - Unique index on (`participant_id`, `service`) where participant_id is not null

  #### Indexes:
  - Index on `participant_id` for efficient participant queries
  - Unique index on (`participant_id`, `service`) for preventing duplicate participant registrations

  ## Security
  
  ### Row Level Security (RLS)
  - RLS is ENABLED on the registrations table
  - Policy "Allow public insert" - Allows anonymous users to insert registration data
  - Policy "Allow public select" - Allows anonymous users to read registration data
  
  Note: These permissive policies are appropriate for this research study where data is anonymized
  and the goal is to collect participant behavior during the simulation.

  ## Permissions
  - Full access granted to: anon, authenticated, service_role
*/

-- Create the registrations table
CREATE TABLE IF NOT EXISTS public.registrations (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    participant_id uuid,
    username text NOT NULL,
    service text NOT NULL,
    password_strength text,
    password_reuse_count integer DEFAULT 0,
    mfa_enabled boolean DEFAULT false,
    created_at timestamptz DEFAULT now() NOT NULL,
    created_at_madrid timestamp GENERATED ALWAYS AS (created_at AT TIME ZONE 'Europe/Madrid') STORED
);

-- Add unique constraint to prevent duplicate registrations
ALTER TABLE public.registrations
    ADD CONSTRAINT registrations_username_service_uniq UNIQUE (username, service);

-- Create indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_registrations_participant ON public.registrations USING btree (participant_id);

CREATE UNIQUE INDEX IF NOT EXISTS registrations_participant_service_uniq 
    ON public.registrations USING btree (participant_id, service) 
    WHERE (participant_id IS NOT NULL);

-- Enable Row Level Security
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- Create policies for anonymous access (appropriate for research study)
CREATE POLICY "Allow public insert" 
    ON public.registrations 
    FOR INSERT 
    TO anon 
    WITH CHECK (true);

CREATE POLICY "Allow public select" 
    ON public.registrations 
    FOR SELECT 
    TO anon 
    USING (true);

CREATE POLICY "Allow public update" 
    ON public.registrations 
    FOR UPDATE 
    TO anon 
    USING (true)
    WITH CHECK (true);

-- Grant permissions to all roles
GRANT ALL ON TABLE public.registrations TO anon;
GRANT ALL ON TABLE public.registrations TO authenticated;
GRANT ALL ON TABLE public.registrations TO service_role;

GRANT ALL ON SEQUENCE public.registrations_id_seq TO anon;
GRANT ALL ON SEQUENCE public.registrations_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.registrations_id_seq TO service_role;