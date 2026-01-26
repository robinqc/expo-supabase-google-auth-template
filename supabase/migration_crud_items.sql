-- ================================================
-- CRUD Items Table Migration
-- ================================================
-- This migration creates the crud_items table with RLS policies
-- Run this in your Supabase SQL Editor

-- Create the crud_items table
CREATE TABLE IF NOT EXISTS crud_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'General',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('active', 'archived', 'draft')),
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE crud_items ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own items" ON crud_items;
DROP POLICY IF EXISTS "Users can create their own items" ON crud_items;
DROP POLICY IF EXISTS "Users can update their own items" ON crud_items;
DROP POLICY IF EXISTS "Users can delete their own items" ON crud_items;

-- Create RLS Policies
CREATE POLICY "Users can view their own items" 
  ON crud_items FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own items" 
  ON crud_items FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own items" 
  ON crud_items FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own items" 
  ON crud_items FOR DELETE 
  USING (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS crud_items_user_id_idx ON crud_items(user_id);
CREATE INDEX IF NOT EXISTS crud_items_user_created_at_idx ON crud_items(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS crud_items_status_idx ON crud_items(status);
CREATE INDEX IF NOT EXISTS crud_items_category_idx ON crud_items(category);

-- Create or replace function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop trigger if exists and create new one
DROP TRIGGER IF EXISTS update_crud_items_updated_at ON crud_items;
CREATE TRIGGER update_crud_items_updated_at
  BEFORE UPDATE ON crud_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ================================================
-- Optional: Insert sample data for testing
-- ================================================
-- Uncomment the following lines to add sample data
-- Replace 'YOUR_USER_ID' with your actual user ID from auth.users

/*
INSERT INTO crud_items (user_id, title, subtitle, description, category, status) VALUES
  ('YOUR_USER_ID', 'Design System', 'Update color palette and typography', 'Comprehensive update to the global design system including new color tokens, typography scale, and component library updates.', 'Design', 'active'),
  ('YOUR_USER_ID', 'Q1 Report', 'Financial summary for stakeholders', 'Quarterly financial report with revenue analysis, expense breakdown, and projections for Q2.', 'Finance', 'draft'),
  ('YOUR_USER_ID', 'User Research', 'Interview notes from 10 participants', 'Detailed findings from user interviews conducted to understand pain points and feature requests.', 'Research', 'active'),
  ('YOUR_USER_ID', 'Marketing Assets', 'Social media templates for Q2', 'Collection of social media post templates, banners, and promotional graphics for Q2 campaigns.', 'Marketing', 'active'),
  ('YOUR_USER_ID', 'Legacy Code', 'Cleanup deprecated components', 'Remove old unused components and refactor legacy code to improve maintainability.', 'Engineering', 'archived');
*/