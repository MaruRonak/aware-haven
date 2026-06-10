ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS safety_score INTEGER NOT NULL DEFAULT 75,
  ADD COLUMN IF NOT EXISTS language TEXT NOT NULL DEFAULT 'en',
  ADD COLUMN IF NOT EXISTS location_enabled BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS avatar_url TEXT;

CREATE TABLE IF NOT EXISTS public.quiz_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  total INTEGER NOT NULL,
  topic TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.quiz_scores TO authenticated;
GRANT ALL ON public.quiz_scores TO service_role;
ALTER TABLE public.quiz_scores ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "own quiz all" ON public.quiz_scores;
CREATE POLICY "own quiz all" ON public.quiz_scores FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);