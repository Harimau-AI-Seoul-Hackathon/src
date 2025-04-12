/*
  # Create facilities table for emergency locations

  1. New Tables
    - `facilities`
      - `id` (bigint, primary key)
      - `name` (text)
      - `type` (text)
      - `latitude` (double precision)
      - `longitude` (double precision)
      - `address` (text)
      - `phone` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `facilities` table
    - Add policy for authenticated users to read facilities data
*/

CREATE TABLE facilities (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name text NOT NULL,
  type text NOT NULL,
  latitude double precision NOT NULL,
  longitude double precision NOT NULL,
  address text NOT NULL,
  phone text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE facilities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read facilities"
  ON facilities
  FOR SELECT
  TO authenticated
  USING (true);