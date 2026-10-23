-- =========================================================================
-- EduTrack Database Schema for Supabase
-- Separate tables for Student, Teacher, and Admin accounts
--
-- How to apply:
-- 1. Go to Supabase Dashboard (Project: bijklibeveykmyjbzcik)
-- 2. Open SQL Editor -> Click 'New query'
-- 3. Paste this entire file and click 'Run'
-- =========================================================================

-- 1. Separate Table: Students Profile
CREATE TABLE IF NOT EXISTS public.students_profile (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    student_id TEXT UNIQUE NOT NULL,
    department TEXT NOT NULL DEFAULT 'Computer Science',
    year TEXT NOT NULL DEFAULT 'Freshman',
    gpa NUMERIC(3, 2) NOT NULL DEFAULT 4.00,
    attendance_rate NUMERIC(5, 2) NOT NULL DEFAULT 100.00,
    status TEXT NOT NULL DEFAULT 'Active',
    last_sign_in TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Separate Table: Teachers Profile
CREATE TABLE IF NOT EXISTS public.teachers_profile (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL DEFAULT 'Faculty Instructor',
    department TEXT NOT NULL DEFAULT 'Computer Science',
    office_location TEXT DEFAULT 'Science Hall 3-B',
    office_hours TEXT DEFAULT 'Mon/Wed 2:00 - 4:00 PM',
    phone TEXT DEFAULT '+1 (555) 019-2834',
    last_sign_in TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Separate Table: Admins Profile
CREATE TABLE IF NOT EXISTS public.admins_profile (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL DEFAULT 'Academic Administrator',
    department TEXT NOT NULL DEFAULT 'Academic Affairs',
    access_level TEXT NOT NULL DEFAULT 'Super Admin',
    last_sign_in TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Academic Courses Table
CREATE TABLE IF NOT EXISTS public.courses (
    id TEXT PRIMARY KEY,
    code TEXT NOT NULL,
    title TEXT NOT NULL,
    credits INTEGER NOT NULL DEFAULT 3,
    department TEXT NOT NULL,
    instructor_name TEXT NOT NULL,
    room TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Attendance Records Table
CREATE TABLE IF NOT EXISTS public.attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id TEXT NOT NULL,
    course_id TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'late', 'excused')),
    date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Academic Grades Table
CREATE TABLE IF NOT EXISTS public.grades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id TEXT NOT NULL,
    course_id TEXT NOT NULL,
    assessment_title TEXT NOT NULL,
    score NUMERIC(5, 2) NOT NULL,
    total_points NUMERIC(5, 2) NOT NULL,
    weight NUMERIC(5, 2) NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE public.students_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grades ENABLE ROW LEVEL SECURITY;

-- Create Open Access Policies for the Client Anon Key (for development and direct writes)
DROP POLICY IF EXISTS "Public Read/Write Access for students_profile" ON public.students_profile;
CREATE POLICY "Public Read/Write Access for students_profile" ON public.students_profile FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Read/Write Access for teachers_profile" ON public.teachers_profile;
CREATE POLICY "Public Read/Write Access for teachers_profile" ON public.teachers_profile FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Read/Write Access for admins_profile" ON public.admins_profile;
CREATE POLICY "Public Read/Write Access for admins_profile" ON public.admins_profile FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Read/Write Access for courses" ON public.courses;
CREATE POLICY "Public Read/Write Access for courses" ON public.courses FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Read/Write Access for attendance" ON public.attendance;
CREATE POLICY "Public Read/Write Access for attendance" ON public.attendance FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Read/Write Access for grades" ON public.grades;
CREATE POLICY "Public Read/Write Access for grades" ON public.grades FOR ALL USING (true) WITH CHECK (true);

-- Helpful indexes for rapid email lookups
CREATE INDEX IF NOT EXISTS idx_students_profile_email ON public.students_profile(email);
CREATE INDEX IF NOT EXISTS idx_teachers_profile_email ON public.teachers_profile(email);
CREATE INDEX IF NOT EXISTS idx_admins_profile_email ON public.admins_profile(email);
