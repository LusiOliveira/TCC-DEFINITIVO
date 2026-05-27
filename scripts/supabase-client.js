// =============================================
// SUPABASE CLIENT - EletroLight
// =============================================

const SUPABASE_URL = 'https://qwwpyrakxdrzimjnaczf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3d3B5cmFreGRyemltam5hY3pmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1NzA1NjMsImV4cCI6MjA5NTE0NjU2M30.qMILfRuviGJDL9Ye7NH_rJbMBJQHFj6Nd0tu9qlYQnI';

// Cria cliente Supabase
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Exporta para uso global
window.supabaseClient = supabaseClient;
