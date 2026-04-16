import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error(
    'Missing SUPABASE_URL or SUPABASE_KEY.\n' +
    'Copy .env.example to .env and fill in your credentials.'
  );
  process.exit(1);
}

export const supabase = createClient(supabaseUrl, supabaseKey);
