import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rskpzniuukktaitpkwog.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJza3B6bml1dWtrdGFpdHBrd29nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDIzNzM5NjcsImV4cCI6MjAxNzk0OTk2N30.EJHdxGLaXLjOKdpZF3XiVg8ZH_8ejpLesB-_PLeNK_g'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})