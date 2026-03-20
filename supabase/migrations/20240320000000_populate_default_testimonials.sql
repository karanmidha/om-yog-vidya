-- Populate default testimonials from design
-- These are the 3 testimonials shown in screen_4.png design mockup

INSERT INTO testimonials (
  id,
  name,
  email,
  content,
  rating,
  practice_style,
  status,
  submitted_at
) VALUES
(
  gen_random_uuid(),
  'Sarah Jenkins',
  'sarah.jenkins@example.com',
  'This yoga practice has completely transformed my relationship with stress and anxiety. The gentle guidance and peaceful environment helped me find inner calm I never thought possible. Each session leaves me feeling renewed and centered.',
  5,
  'Vinyasa',
  'approved',
  '2024-01-15 10:30:00+00'
),
(
  gen_random_uuid(),
  'David Miller',
  'david.miller@example.com',
  'As someone new to yoga, I was nervous about starting. The instructor''s patience and clear explanations made me feel welcome from day one. Hatha yoga has improved my flexibility and given me tools for mindfulness that I use daily.',
  4,
  'Hatha',
  'approved',
  '2024-02-01 14:15:00+00'
),
(
  gen_random_uuid(),
  'Elena Kovac',
  'elena.kovac@example.com',
  'The Vinyasa flow classes are absolutely magical! I love how each sequence builds upon the last, creating a beautiful dance of movement and breath. This practice has become an essential part of my weekly routine.',
  5,
  'Vinyasa',
  'approved',
  '2024-02-20 09:45:00+00'
)
ON CONFLICT DO NOTHING;

-- Add a note column for additional testimonial metadata if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='testimonials' AND column_name='student_type') THEN
    ALTER TABLE testimonials ADD COLUMN student_type TEXT;
  END IF;
END $$;

-- Update student types for the default testimonials
UPDATE testimonials
SET student_type = 'Member for 2 years'
WHERE name = 'Sarah Jenkins';

UPDATE testimonials
SET student_type = 'Hatha Yoga Student'
WHERE name = 'David Miller';

UPDATE testimonials
SET student_type = 'Vinyasa Enthusiast'
WHERE name = 'Elena Kovac';