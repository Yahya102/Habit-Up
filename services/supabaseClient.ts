
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://midgvvmpieavyfhmusby.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pZGd2dm1waWVhdnlmaG11c2J5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc4NTAzMDUsImV4cCI6MjA4MzQyNjMwNX0.hI3eRJiBZoljzDTBCTLFqRn25ZghjLyDJa_M2G8Cl0s';

export const supabase = createClient(supabaseUrl, supabaseKey);
