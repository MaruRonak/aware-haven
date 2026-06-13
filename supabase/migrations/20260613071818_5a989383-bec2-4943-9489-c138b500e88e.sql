
-- incident_reports
CREATE TYPE public.incident_category AS ENUM ('harassment','stalking','theft','assault','cyber','suspicious','other');
CREATE TYPE public.incident_status AS ENUM ('open','investigating','resolved','closed');

CREATE TABLE public.incident_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  category public.incident_category NOT NULL DEFAULT 'other',
  title text NOT NULL,
  description text,
  latitude double precision,
  longitude double precision,
  address text,
  evidence_url text,
  is_anonymous boolean NOT NULL DEFAULT false,
  status public.incident_status NOT NULL DEFAULT 'open',
  occurred_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.incident_reports TO authenticated;
GRANT ALL ON public.incident_reports TO service_role;
ALTER TABLE public.incident_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own incident_reports all" ON public.incident_reports
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER trg_incident_reports_updated_at BEFORE UPDATE ON public.incident_reports
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- safe_zones
CREATE TABLE public.safe_zones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  label text NOT NULL,
  latitude double precision NOT NULL,
  longitude double precision NOT NULL,
  radius_meters integer NOT NULL DEFAULT 150,
  address text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.safe_zones TO authenticated;
GRANT ALL ON public.safe_zones TO service_role;
ALTER TABLE public.safe_zones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own safe_zones all" ON public.safe_zones
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER trg_safe_zones_updated_at BEFORE UPDATE ON public.safe_zones
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- trusted_circle
CREATE TABLE public.trusted_circle (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  phone text NOT NULL,
  email text,
  relation text,
  can_track_location boolean NOT NULL DEFAULT true,
  notify_on_sos boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.trusted_circle TO authenticated;
GRANT ALL ON public.trusted_circle TO service_role;
ALTER TABLE public.trusted_circle ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own trusted_circle all" ON public.trusted_circle
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER trg_trusted_circle_updated_at BEFORE UPDATE ON public.trusted_circle
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- location_history
CREATE TABLE public.location_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  latitude double precision NOT NULL,
  longitude double precision NOT NULL,
  accuracy_meters double precision,
  speed double precision,
  battery_level integer,
  recorded_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_location_history_user_time ON public.location_history (user_id, recorded_at DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.location_history TO authenticated;
GRANT ALL ON public.location_history TO service_role;
ALTER TABLE public.location_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own location_history all" ON public.location_history
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
