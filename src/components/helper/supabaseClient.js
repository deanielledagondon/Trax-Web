import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
export const supabase = createClient(
    'https://swqywqargpfwcyvpqhkn.supabase.co', 
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3cXl3cWFyZ3Bmd2N5dnBxaGtuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTg1MjIyMDEsImV4cCI6MjAzNDA5ODIwMX0.3_L7BZgiAtekcGXJhGJvWPUVj6DwVMPqV6FxffenFa4'
    );