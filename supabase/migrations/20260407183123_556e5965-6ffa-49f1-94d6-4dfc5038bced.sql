
-- Create lawyers table (public data)
CREATE TABLE public.lawyers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  specialty TEXT NOT NULL,
  location TEXT NOT NULL,
  rating NUMERIC(2,1) NOT NULL DEFAULT 4.5,
  reviews INTEGER NOT NULL DEFAULT 0,
  available BOOLEAN NOT NULL DEFAULT true,
  image TEXT NOT NULL DEFAULT '',
  experience TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.lawyers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lawyers are viewable by authenticated users"
ON public.lawyers FOR SELECT TO authenticated USING (true);

-- Create violation_reports table
CREATE TABLE public.violation_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  reference_id TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  category TEXT NOT NULL DEFAULT 'General',
  status TEXT NOT NULL DEFAULT 'Submitted',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.violation_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own reports"
ON public.violation_reports FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own reports"
ON public.violation_reports FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Create waste_logs table
CREATE TABLE public.waste_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  category TEXT NOT NULL,
  confidence NUMERIC(4,1) NOT NULL,
  disposal TEXT,
  impact TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.waste_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own waste logs"
ON public.waste_logs FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own waste logs"
ON public.waste_logs FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Seed lawyers data
INSERT INTO public.lawyers (name, specialty, location, rating, reviews, available, image, experience) VALUES
  ('Dr. Priya Sharma', 'Environmental Litigation', 'Mumbai, India', 4.9, 128, true, 'PS', '15 years'),
  ('James O''Brien', 'Waste Management Law', 'London, UK', 4.8, 96, true, 'JO', '12 years'),
  ('Anika Chen', 'Climate Policy', 'Singapore', 4.7, 74, false, 'AC', '10 years'),
  ('Carlos Mendez', 'Environmental Compliance', 'Mexico City, MX', 4.9, 110, true, 'CM', '18 years'),
  ('Sarah Williams', 'Green Energy Regulation', 'New York, US', 4.6, 63, true, 'SW', '8 years'),
  ('Raj Patel', 'Pollution Control Law', 'Delhi, India', 4.8, 89, false, 'RP', '14 years');
