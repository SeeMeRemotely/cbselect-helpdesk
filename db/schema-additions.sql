-- ============================================================
-- CB Select Helpdesk — schema additions
-- Run these in the Supabase SQL Editor (one time)
-- ============================================================

-- 1. Add view_token to tickets so we can generate magic links
--    gen_random_uuid() auto-fills a token for every existing row too.
ALTER TABLE tickets
  ADD COLUMN IF NOT EXISTS view_token uuid NOT NULL DEFAULT gen_random_uuid();

-- Make it unique (for safe lookup)
CREATE UNIQUE INDEX IF NOT EXISTS tickets_view_token_idx ON tickets (view_token);

-- 2. Knowledgebase articles table (drop first to avoid partial-schema issues)
DROP TABLE IF EXISTS kb_articles;

CREATE TABLE kb_articles (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug         text NOT NULL UNIQUE,
  title        text NOT NULL,
  category     text NOT NULL DEFAULT 'General',
  body         text NOT NULL,
  active       boolean NOT NULL DEFAULT true,
  sort_order   integer NOT NULL DEFAULT 0,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

-- 3. Seed the printer-driver article
INSERT INTO kb_articles (title, slug, category, body, active, sort_order)
VALUES (
  'Install Office Printer Drivers',
  'install-office-printer-drivers',
  'Printer Drivers',
  'Use the printer driver page to download the correct copier or printer driver for your office.

Visit https://drivers.rewithcb.com to download the installer for your location.

These drivers are Windows installer files (.exe). Your browser may ask for permission to keep or run the file — this is expected. Only download drivers from the official CB Select printer driver page.',
  true,
  10
);
