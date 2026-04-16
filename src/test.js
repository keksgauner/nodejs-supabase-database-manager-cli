import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://test.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "key";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);


const { data, error } = await supabase
  .from('profiles')
  .select('*');

  console.log('Data:', data);
  console.log('Error:', error);