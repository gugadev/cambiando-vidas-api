import { createClient } from "@supabase/supabase-js";
import { env } from "../infra/env";

const supabase = createClient(env.supabaseProject, env.supabaseApiKey);

export { supabase };
