import { createClient } from "@supabase/supabase-js";

// Cliente de Supabase para uso SOLO en el servidor (service_role).
// El browser nunca toca Supabase directo. Todo pasa por server components y API routes.
const supabaseUrl = process.env.SUPABASE_URL || "";
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export function getServiceClient() {
  return createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
