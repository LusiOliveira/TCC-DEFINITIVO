// =============================================
// SUPABASE CLIENT - EletroLight
// =============================================

const SUPABASE_URL = 'https://nkddathnxrdazohoxfpi.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rZGRhdGhueHJkYXpvaG94ZnBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1MzA2ODUsImV4cCI6MjA5MTEwNjY4NX0.RyMChIPE4YHVeErYOLYtL25xkj--ek_jmJQWqrpPFwY';

// Cria cliente Supabase
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Exporta para uso global
window.supabaseClient = supabaseClient;
