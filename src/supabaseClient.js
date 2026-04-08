import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://jnbxshersmaijfklkyyc.supabase.co'
const supabaseAnonKey = 'sb_publishable_6BxzZbp1tlIO4kvZQlvbPw_OlDW2dUU'
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
