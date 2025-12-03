import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bihwyxeeeolbjhrngsco.supabase.co'                                 
const supabaseKey = import.meta.env.VITE_SUPABASE;

// const supabaseSecret = 'sb_secret_JtnCO1bb1St_uXDR1Yjhvg_e1oQQsyj';

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;