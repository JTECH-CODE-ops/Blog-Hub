import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bihwyxeeeolbjhrngsco.supabase.co'                                 
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpaHd5eGVlZW9sYmpocm5nc2NvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzUyNzE4MywiZXhwIjoyMDczMTAzMTgzfQ.Zu1KclykR10XtiZOyHP89z69U9qNH1yDLPBmWhOR_VU';

// const supabaseSecret = 'sb_secret_JtnCO1bb1St_uXDR1Yjhvg_e1oQQsyj';

const supabase1 = createClient(supabaseUrl, supabaseKey);

export default supabase1;