import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bihwyxeeeolbjhrngsco.supabase.co'                                 
const supabaseKey = import.meta.env.VITE_SUPABASE;



const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;