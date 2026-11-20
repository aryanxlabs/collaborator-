// Supabase client for the Collaborator frontend.
//
// The frontend talks DIRECTLY to Supabase (Postgres) — there is no custom
// backend server. These two values are publishable client settings, not
// secrets, but they still come from the environment so no key ever lives
// in the source. Set them in `.env` (see `.env.example`) or in Vercel
// (Project Settings → Environment Variables).
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

export const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'placeholder-anon-key')

// Error thrown when the app tries to talk to Supabase but the two
// environment variables were never set.
export function configError() {
  const err = new Error('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.')
  err.code = 'SUPABASE_NOT_CONFIGURED'
  return err
}
