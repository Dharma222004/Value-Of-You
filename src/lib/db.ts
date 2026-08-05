import { supabase } from "@/lib/supabase";

/**
 * Primary Database Client Export
 * Directly references live Supabase PostgreSQL database client.
 */
export const db = supabase;
export default db;
