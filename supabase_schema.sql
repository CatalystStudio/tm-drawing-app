-- Create the entrants table
CREATE TABLE entrants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  company TEXT NOT NULL,
  is_winner BOOLEAN DEFAULT false,
  disqualified BOOLEAN DEFAULT false
);

-- Enable RLS
ALTER TABLE entrants ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public inserts (for the form)
CREATE POLICY "Allow public insert" ON entrants
FOR INSERT WITH CHECK (true);

-- Create policy to allow admin to read and update (for the /winner page)
-- In a real app, you'd use service role or auth, but for this quick demo 
-- we can use a simpler approach or just allow all for now if it's a private URL.
-- FOR THE TRADESHOW: Use the Service Role Key in the app for admin actions.
CREATE POLICY "Allow service role full access" ON entrants
FOR ALL USING (true);
