import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://hqpahqdxhosexamjmgnl.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhxcGFocWR4aG9zZXhhbWptZ25sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUxNDY2MTEsImV4cCI6MjA1MDcyMjYxMX0.RtM2fYVDCUTyd1uEaPJDIop9ikt4n0gjAPhiX29U_kM";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
