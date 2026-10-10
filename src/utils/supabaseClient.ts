import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://lpfpxubveubdcfvhquyt.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxwZnB4dWJ2ZXViZGNmdmhxdXl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE1OTI3OTIsImV4cCI6MjEwNzE2ODc5Mn0.IlilAv-fEgJzeOC4X1HnEiu4vd15qaY_OzA1sY9Qo90';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
