-- 1. Create the entrants table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS entrants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  company TEXT NOT NULL,
  is_winner BOOLEAN DEFAULT false,
  disqualified BOOLEAN DEFAULT false
);

-- 2. Enable RLS
ALTER TABLE entrants ENABLE ROW LEVEL SECURITY;

-- 3. Policy Setup (Safely recreate policies)
DROP POLICY IF EXISTS "Allow public insert" ON entrants;
CREATE POLICY "Allow public insert" ON entrants FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public select" ON entrants;
CREATE POLICY "Allow public select" ON entrants FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public update" ON entrants;
CREATE POLICY "Allow public update" ON entrants FOR UPDATE USING (true);
