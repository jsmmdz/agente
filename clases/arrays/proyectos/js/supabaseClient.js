/* supabaseClient.js */
// Pega aquí tu Project URL y tu anon public key
// (Project Settings → API, en el panel de Supabase).
// Usa SOLO la "anon public key": la "service_role" nunca va en el navegador.
const SUPABASE_URL      = "https://nxuznjgtaoikmwehntes.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54dXpuamd0YW9pa213ZWhudGVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI0Mjg4NDQsImV4cCI6MjEwODAwNDg0NH0.M36uv9026qH1kf4L22FCrnkJe3Iq2BRML4L4gAhnac8";

// El script del CDN crea una variable global "supabase" que trae
// la función createClient(). La usamos para crear NUESTRO propio
// cliente, y lo guardamos en una variable con otro nombre (db) para
// no confundirla con el objeto global de la librería.
const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
