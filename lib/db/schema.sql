-- ============================================================
-- GSF Platform — PostgreSQL Database Schema
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- ENUM TYPES
-- ============================================================

CREATE TYPE user_role AS ENUM ('student', 'expert', 'admin');
CREATE TYPE idea_status AS ENUM ('draft', 'validating', 'validated', 'archived');
CREATE TYPE idea_stage AS ENUM ('problem', 'persona', 'validation', 'pitch');
CREATE TYPE track_type AS ENUM ('explorer', 'builder', 'founder');
CREATE TYPE cohort_status AS ENUM ('upcoming', 'active', 'completed');
CREATE TYPE availability_status AS ENUM ('available', 'busy', 'unavailable');
CREATE TYPE session_status AS ENUM ('scheduled', 'completed', 'cancelled');

-- ============================================================
-- USERS TABLE
-- ============================================================

CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_id      VARCHAR(255) UNIQUE NOT NULL,
  name          VARCHAR(255) NOT NULL,
  email         VARCHAR(255) UNIQUE NOT NULL,
  role          user_role NOT NULL DEFAULT 'student',
  cohort_id     UUID,
  avatar_url    TEXT,
  bio           TEXT,
  onboarding    JSONB,               -- Stores onboarding answers
  is_active     BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- AVAILABILITY SLOTS TABLE
-- ============================================================

CREATE TABLE availability_slots (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  expert_clerk_id   VARCHAR(255) NOT NULL,
  expert_name       VARCHAR(255) NOT NULL,
  start_at          TIMESTAMPTZ NOT NULL,
  end_at            TIMESTAMPTZ NOT NULL,
  timezone          VARCHAR(100) DEFAULT 'Asia/Kolkata',
  notes             TEXT DEFAULT '',
  is_booked         BOOLEAN DEFAULT FALSE,
  booked_by_clerk_id VARCHAR(255),
  booked_session_id UUID,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- NOTIFICATIONS TABLE (email log)
-- ============================================================

CREATE TABLE notifications (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id    UUID,
  to_email      VARCHAR(255) NOT NULL,
  type          VARCHAR(100) NOT NULL, -- booking_confirmation | reminder | recording_ready
  status        VARCHAR(50) NOT NULL DEFAULT 'pending',
  payload       JSONB DEFAULT '{}',
  sent_at       TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_session ON notifications(session_id);

-- ============================================================
-- SESSION FEEDBACK TABLE (ratings & reviews)
-- ============================================================

CREATE TABLE session_feedback (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id        UUID NOT NULL,
  founder_clerk_id  VARCHAR(255) NOT NULL,
  expert_clerk_id   VARCHAR(255) NOT NULL,
  rating            INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  feedback          TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_session_feedback_session ON session_feedback(session_id);
CREATE INDEX idx_session_feedback_expert ON session_feedback(expert_clerk_id);

-- ============================================================
-- COHORTS TABLE
-- ============================================================

CREATE TABLE cohorts (
  cohort_id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name               VARCHAR(255) NOT NULL,
  description        TEXT,
  track_type         track_type NOT NULL,
  status             cohort_status NOT NULL DEFAULT 'upcoming',
  mentor_id          UUID REFERENCES users(id) ON DELETE SET NULL,
  max_students       INT NOT NULL DEFAULT 30,
  enrolled_students  INT NOT NULL DEFAULT 0,
  start_date         DATE NOT NULL,
  end_date           DATE,
  created_at         TIMESTAMPTZ DEFAULT NOW(),
  updated_at         TIMESTAMPTZ DEFAULT NOW()
);

-- Add FK now that cohorts exists
ALTER TABLE users ADD CONSTRAINT fk_users_cohort
  FOREIGN KEY (cohort_id) REFERENCES cohorts(cohort_id) ON DELETE SET NULL;

-- ============================================================
-- IDEAS TABLE
-- ============================================================

CREATE TABLE ideas (
  idea_id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id            UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title              VARCHAR(500) NOT NULL,
  description        TEXT,
  problem_statement  TEXT,
  target_customer    JSONB,             -- Customer persona data
  validation_items   JSONB,             -- Checklist items
  status             idea_status NOT NULL DEFAULT 'draft',
  stage              idea_stage NOT NULL DEFAULT 'problem',
  mentor_feedback    TEXT,
  is_public          BOOLEAN DEFAULT FALSE,
  tags               TEXT[],
  created_at         TIMESTAMPTZ DEFAULT NOW(),
  updated_at         TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- EXPERTS TABLE
-- ============================================================

CREATE TABLE experts (
  expert_id      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id        UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  title          VARCHAR(255),
  company        VARCHAR(255),
  domain         TEXT[] NOT NULL DEFAULT '{}',
  bio            TEXT,
  linkedin_url   TEXT,
  website_url    TEXT,
  availability   availability_status NOT NULL DEFAULT 'available',
  rating         DECIMAL(2,1) DEFAULT 0.0,
  session_count  INT DEFAULT 0,
  is_approved    BOOLEAN DEFAULT FALSE,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SESSIONS TABLE
-- ============================================================

CREATE TABLE sessions (
  session_id     UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  expert_id      UUID NOT NULL REFERENCES experts(expert_id) ON DELETE CASCADE,
  student_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  cohort_id      UUID REFERENCES cohorts(cohort_id) ON DELETE SET NULL,
  scheduled_at   TIMESTAMPTZ NOT NULL,
  duration       INT NOT NULL DEFAULT 30,  -- minutes
  status         session_status NOT NULL DEFAULT 'scheduled',
  notes          TEXT,
  meeting_url    TEXT,
  recording_url  TEXT,
  recording_ready_at TIMESTAMPTZ,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- FEEDBACK TABLE
-- ============================================================

CREATE TABLE feedback (
  feedback_id    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id     UUID REFERENCES sessions(session_id) ON DELETE SET NULL,
  idea_id        UUID REFERENCES ideas(idea_id) ON DELETE SET NULL,
  from_user_id   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  to_user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message        TEXT NOT NULL,
  rating         INT CHECK (rating >= 1 AND rating <= 5),
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- MODULES TABLE
-- ============================================================

CREATE TABLE modules (
  module_id      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cohort_id      UUID NOT NULL REFERENCES cohorts(cohort_id) ON DELETE CASCADE,
  title          VARCHAR(255) NOT NULL,
  description    TEXT,
  order_index    INT NOT NULL,
  content        JSONB,               -- Rich content blocks
  resources      JSONB,               -- Links, files, videos
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- STUDENT PROGRESS TABLE
-- ============================================================

CREATE TABLE student_progress (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id        UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  module_id      UUID NOT NULL REFERENCES modules(module_id) ON DELETE CASCADE,
  completed_at   TIMESTAMPTZ,
  progress_pct   INT DEFAULT 0,       -- 0-100
  notes          TEXT,
  UNIQUE (user_id, module_id)
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_clerk_id ON users(clerk_id);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_cohort ON users(cohort_id);
CREATE INDEX idx_availability_expert ON availability_slots(expert_clerk_id, start_at);
CREATE INDEX idx_availability_future ON availability_slots(is_booked, start_at);
CREATE INDEX idx_ideas_user ON ideas(user_id);
CREATE INDEX idx_ideas_status ON ideas(status);
CREATE INDEX idx_sessions_expert ON sessions(expert_id);
CREATE INDEX idx_sessions_student ON sessions(student_id);
CREATE INDEX idx_sessions_scheduled ON sessions(scheduled_at);
CREATE INDEX idx_modules_cohort ON modules(cohort_id, order_index);
CREATE INDEX idx_progress_user ON student_progress(user_id);

-- ============================================================
-- ARTICLES TABLE (insights publishing)
-- ============================================================

CREATE TABLE articles (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_clerk_id VARCHAR(255) NOT NULL,
  author_name     VARCHAR(255) NOT NULL,
  title           VARCHAR(500) NOT NULL,
  category        VARCHAR(100) NOT NULL,
  body            TEXT NOT NULL,
  status          VARCHAR(50) NOT NULL DEFAULT 'draft', -- draft | published
  published_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_articles_status ON articles(status);
CREATE INDEX idx_articles_author ON articles(author_clerk_id);
CREATE INDEX idx_articles_published ON articles(published_at DESC);

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER availability_slots_updated_at BEFORE UPDATE ON availability_slots
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER cohorts_updated_at BEFORE UPDATE ON cohorts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER ideas_updated_at BEFORE UPDATE ON ideas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER experts_updated_at BEFORE UPDATE ON experts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER sessions_updated_at BEFORE UPDATE ON sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER articles_updated_at BEFORE UPDATE ON articles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
