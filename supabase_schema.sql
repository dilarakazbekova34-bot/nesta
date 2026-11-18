-- =====================================================================
-- NESTA — FULL-STACK HEALTHTECH ECOSYSTEM
-- Production PostgreSQL Database Schema for Supabase
-- =====================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================================
-- 2. ENUM TYPES
-- =====================================================================
CREATE TYPE user_family_role AS ENUM ('mother', 'father', 'guardian', 'pediatrician', 'expectant');
CREATE TYPE family_access_level AS ENUM ('owner', 'editor', 'viewer');
CREATE TYPE profile_mode_type AS ENUM ('pregnancy', 'child', 'planning');
CREATE TYPE triage_level_type AS ENUM ('green', 'yellow', 'red');
CREATE TYPE article_status_type AS ENUM ('draft', 'pending_review', 'peer_reviewed', 'published', 'needs_update', 'archived');
CREATE TYPE doc_category_type AS ENUM ('lab_tests', 'ultrasound', 'doctor_notes', 'vaccination', 'prescriptions', 'screening');

-- =====================================================================
-- 3. CORE FAMILY & USER PROFILES
-- =====================================================================

-- Families table
CREATE TABLE IF NOT EXISTS public.families (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL DEFAULT 'Моя семья',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Profiles (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    phone VARCHAR(50),
    preferred_language VARCHAR(10) DEFAULT 'ru',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Family Members & Shared Access
CREATE TABLE IF NOT EXISTS public.family_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_id UUID NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role user_family_role NOT NULL DEFAULT 'mother',
    access_level family_access_level NOT NULL DEFAULT 'owner',
    relationship VARCHAR(100) NOT NULL DEFAULT 'Мама',
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(family_id, user_id)
);

-- Child Profiles
CREATE TABLE IF NOT EXISTS public.child_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_id UUID NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    gender VARCHAR(10) NOT NULL CHECK (gender IN ('female', 'male')),
    birth_date DATE NOT NULL,
    birth_weight NUMERIC(5,3) NOT NULL, -- in kg
    birth_height NUMERIC(4,1) NOT NULL, -- in cm
    blood_type VARCHAR(20) DEFAULT 'A (II) Rh+',
    allergies TEXT[] DEFAULT ARRAY[]::TEXT[],
    pediatrician_name VARCHAR(255),
    clinic VARCHAR(255),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Growth Measurements (WHO Standards)
CREATE TABLE IF NOT EXISTS public.growth_measurements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    child_id UUID NOT NULL REFERENCES public.child_profiles(id) ON DELETE CASCADE,
    measured_date DATE NOT NULL,
    age_months INTEGER NOT NULL CHECK (age_months >= 0 AND age_months <= 36),
    weight NUMERIC(5,2) NOT NULL, -- kg
    height NUMERIC(4,1) NOT NULL, -- cm
    head_circumference NUMERIC(4,1), -- cm
    who_weight_percentile NUMERIC(4,1),
    who_height_percentile NUMERIC(4,1),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Child Health Diary Entries
CREATE TABLE IF NOT EXISTS public.diary_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    child_id UUID NOT NULL REFERENCES public.child_profiles(id) ON DELETE CASCADE,
    logged_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('feeding', 'sleep', 'diaper', 'temperature', 'medication', 'mood')),
    entry_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    title VARCHAR(255) NOT NULL,
    details TEXT NOT NULL,
    numeric_value NUMERIC(6,2),
    unit VARCHAR(30),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Appointments & General Family Calendar
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_id UUID NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    target_person VARCHAR(255) NOT NULL,
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    clinic VARCHAR(255),
    doctor_name VARCHAR(255),
    details TEXT,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================================
-- 4. PREGNANCY SPECIFIC TABLES
-- =====================================================================

-- Pregnancy Profiles
CREATE TABLE IF NOT EXISTS public.pregnancy_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_id UUID NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
    mother_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    due_date DATE NOT NULL,
    last_menstrual_period DATE,
    conception_date DATE,
    current_week INTEGER NOT NULL DEFAULT 4 CHECK (current_week >= 1 AND current_week <= 44),
    trimester INTEGER NOT NULL DEFAULT 1 CHECK (trimester IN (1, 2, 3)),
    is_active BOOLEAN DEFAULT TRUE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Fetal 3D Models & Weekly Content (Public Knowledge)
CREATE TABLE IF NOT EXISTS public.pregnancy_weekly_content (
    week_number INTEGER PRIMARY KEY CHECK (week_number >= 1 AND week_number <= 42),
    trimester INTEGER NOT NULL CHECK (trimester IN (1, 2, 3)),
    fruit_comparison VARCHAR(100) NOT NULL,
    fruit_emoji VARCHAR(10) NOT NULL,
    fetal_weight_estimate VARCHAR(50) NOT NULL,
    fetal_length_estimate VARCHAR(50) NOT NULL,
    fetal_development_text TEXT NOT NULL,
    organ_highlights TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    maternal_changes TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    maternal_symptoms TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    clinical_recommendations TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    verified_source VARCHAR(255) NOT NULL,
    source_url TEXT NOT NULL,
    model_3d_asset_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pregnancy Mom's Diary
CREATE TABLE IF NOT EXISTS public.pregnancy_diary (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pregnancy_id UUID NOT NULL REFERENCES public.pregnancy_profiles(id) ON DELETE CASCADE,
    gestational_week INTEGER NOT NULL,
    entry_date DATE NOT NULL,
    mood VARCHAR(50) NOT NULL,
    weight_kg NUMERIC(5,2),
    sleep_hours NUMERIC(3,1),
    symptoms TEXT[] DEFAULT ARRAY[]::TEXT[],
    notes TEXT NOT NULL,
    photo_storage_path TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Fetal Movement Sessions (Cardiff Counter)
CREATE TABLE IF NOT EXISTS public.pregnancy_movements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pregnancy_id UUID NOT NULL REFERENCES public.pregnancy_profiles(id) ON DELETE CASCADE,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    movement_count INTEGER NOT NULL CHECK (movement_count >= 1),
    duration_minutes INTEGER NOT NULL,
    passed_norm BOOLEAN DEFAULT TRUE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pregnancy Screenings & Clinical Events
CREATE TABLE IF NOT EXISTS public.pregnancy_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pregnancy_id UUID NOT NULL REFERENCES public.pregnancy_profiles(id) ON DELETE CASCADE,
    gestational_week INTEGER NOT NULL,
    event_date DATE NOT NULL,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL, -- screening, lab, doctor, personal
    details TEXT,
    is_mandatory BOOLEAN DEFAULT FALSE,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Hospital Bag Checklist Items
CREATE TABLE IF NOT EXISTS public.hospital_bag_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pregnancy_id UUID NOT NULL REFERENCES public.pregnancy_profiles(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL, -- docs, mom, baby, discharge, partner
    item_name VARCHAR(255) NOT NULL,
    is_checked BOOLEAN DEFAULT FALSE,
    is_mandatory BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================================
-- 5. MEDICAL ARCHIVE & DOCUMENTS (Private Supabase Storage)
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.medical_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_id UUID NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
    child_id UUID REFERENCES public.child_profiles(id) ON DELETE CASCADE,
    pregnancy_id UUID REFERENCES public.pregnancy_profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    category doc_category_type NOT NULL,
    document_date DATE NOT NULL,
    doctor_name VARCHAR(255),
    clinic VARCHAR(255),
    file_storage_path TEXT NOT NULL, -- Private Supabase Storage Bucket Path
    file_type VARCHAR(20) NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    ocr_extracted_text TEXT,
    ai_summary TEXT,
    structured_findings JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- National Immunization Records
CREATE TABLE IF NOT EXISTS public.vaccinations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    child_id UUID NOT NULL REFERENCES public.child_profiles(id) ON DELETE CASCADE,
    vaccine_name VARCHAR(150) NOT NULL,
    disease_target VARCHAR(255) NOT NULL,
    recommended_age_months INTEGER NOT NULL,
    applied_date DATE,
    batch_number VARCHAR(100),
    clinic VARCHAR(255),
    status VARCHAR(30) NOT NULL DEFAULT 'planned' CHECK (status IN ('done', 'planned', 'overdue')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================================
-- 6. MEDICAL LIBRARY & VERIFIED SOURCES (Separated & Public)
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.medical_sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    organization_type VARCHAR(100) NOT NULL,
    official_website TEXT NOT NULL,
    country VARCHAR(100) DEFAULT 'International',
    is_verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.medical_articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    summary TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    cover_image_url TEXT,
    read_time_minutes INTEGER NOT NULL DEFAULT 5,
    content_paragraphs TEXT[] NOT NULL,
    source_id UUID REFERENCES public.medical_sources(id) ON DELETE SET NULL,
    primary_source_name VARCHAR(255) NOT NULL,
    primary_source_url TEXT NOT NULL,
    verified_by_specialist VARCHAR(255) NOT NULL,
    status article_status_type NOT NULL DEFAULT 'published',
    warning_alert TEXT,
    kazakhstan_specific BOOLEAN DEFAULT FALSE,
    relevant_weeks INTEGER[],
    relevant_child_months INTEGER[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_verified_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_favorites (
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    article_id UUID NOT NULL REFERENCES public.medical_articles(id) ON DELETE CASCADE,
    saved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (user_id, article_id)
);

-- =====================================================================
-- 7. AI ASSISTANT CONVERSATIONS & SYMPTOM TRIAGE
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL DEFAULT 'Медицинская консультация',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender VARCHAR(20) NOT NULL CHECK (sender IN ('user', 'assistant')),
    content TEXT NOT NULL,
    structured_card JSONB,
    attachment_info JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.symptom_assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    assessed_for VARCHAR(100) NOT NULL,
    symptoms TEXT[] NOT NULL,
    temperature NUMERIC(4,1),
    duration VARCHAR(50),
    triage_level triage_level_type NOT NULL,
    summary TEXT NOT NULL,
    observation_advice TEXT[] NOT NULL,
    red_flags TEXT[] NOT NULL,
    emergency_instructions TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================================
-- 8. INDEXES FOR HIGH QUERY PERFORMANCE
-- =====================================================================
CREATE INDEX IF NOT EXISTS idx_family_members_user ON public.family_members(user_id);
CREATE INDEX IF NOT EXISTS idx_family_members_family ON public.family_members(family_id);
CREATE INDEX IF NOT EXISTS idx_child_profiles_family ON public.child_profiles(family_id);
CREATE INDEX IF NOT EXISTS idx_growth_child ON public.growth_measurements(child_id);
CREATE INDEX IF NOT EXISTS idx_diary_child ON public.diary_entries(child_id);
CREATE INDEX IF NOT EXISTS idx_preg_profile_family ON public.pregnancy_profiles(family_id);
CREATE INDEX IF NOT EXISTS idx_preg_diary_pregnancy ON public.pregnancy_diary(pregnancy_id);
CREATE INDEX IF NOT EXISTS idx_preg_movements_pregnancy ON public.pregnancy_movements(pregnancy_id);
CREATE INDEX IF NOT EXISTS idx_med_docs_family ON public.medical_documents(family_id);
CREATE INDEX IF NOT EXISTS idx_med_articles_category ON public.medical_articles(category);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.messages(conversation_id);

-- =====================================================================
-- 9. ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.families ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.child_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.growth_measurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diary_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pregnancy_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pregnancy_diary ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pregnancy_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pregnancy_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hospital_bag_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vaccinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.symptom_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;

-- Public tables (Medical knowledge is accessible to all)
ALTER TABLE public.medical_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pregnancy_weekly_content ENABLE ROW LEVEL SECURITY;

-- 9.1 Public Knowledge Read Policies
CREATE POLICY "Public articles are viewable by everyone" 
ON public.medical_articles FOR SELECT USING (status = 'published' OR status = 'peer_reviewed');

CREATE POLICY "Public sources are viewable by everyone" 
ON public.medical_sources FOR SELECT USING (is_verified = TRUE);

CREATE POLICY "Weekly pregnancy content is public" 
ON public.pregnancy_weekly_content FOR SELECT USING (TRUE);

-- 9.2 Profile Policies
CREATE POLICY "Users can view and edit their own profile" 
ON public.profiles FOR ALL USING (auth.uid() = id);

-- 9.3 Family Member Security Helper Function
CREATE OR REPLACE FUNCTION public.user_belongs_to_family(f_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.family_members
        WHERE family_id = f_id AND user_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9.4 Family Data Policies
CREATE POLICY "Family members can view their family"
ON public.families FOR SELECT USING (public.user_belongs_to_family(id));

CREATE POLICY "Family members can view all family participants"
ON public.family_members FOR SELECT USING (public.user_belongs_to_family(family_id));

CREATE POLICY "Family members can access child profiles"
ON public.child_profiles FOR ALL USING (public.user_belongs_to_family(family_id));

CREATE POLICY "Family members can access pregnancy profiles"
ON public.pregnancy_profiles FOR ALL USING (public.user_belongs_to_family(family_id));

CREATE POLICY "Family members can access medical documents"
ON public.medical_documents FOR ALL USING (public.user_belongs_to_family(family_id));

-- 9.5 Private User Data Policies
CREATE POLICY "Users can manage their own conversations"
ON public.conversations FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage messages in their conversations"
ON public.messages FOR ALL USING (
    EXISTS (SELECT 1 FROM public.conversations WHERE id = conversation_id AND user_id = auth.uid())
);

CREATE POLICY "Users can manage their symptom assessments"
ON public.symptom_assessments FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their favorite articles"
ON public.user_favorites FOR ALL USING (auth.uid() = user_id);

-- =====================================================================
-- 10. SUPABASE STORAGE BUCKET CONFIGURATION (Private Medical Docs)
-- =====================================================================
-- INSERT INTO storage.buckets (id, name, public) VALUES ('medical-documents', 'medical-documents', FALSE);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('pregnancy-photos', 'pregnancy-photos', FALSE);
