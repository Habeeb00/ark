import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    '❌ Supabase credentials missing! Please ensure you have a .env file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY, and restart your dev server.'
  );
}

export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : new Proxy({}, {
      get: (target, prop) => {
        throw new Error(
          `Supabase client accessed but credentials are missing. Please verify that your .env file contains VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY, and restart your dev server.`
        );
      }
    });
