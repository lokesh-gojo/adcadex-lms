const { createClient } = require('@supabase/supabase-js');
const { Pool } = require('pg');
const config = require('../config');

// Initialize Supabase Client (REST / Realtime / Auth / Storage)
let supabase = null;
if (config.supabase.url && (config.supabase.serviceRoleKey || config.supabase.anonKey)) {
  const key = config.supabase.serviceRoleKey || config.supabase.anonKey;
  supabase = createClient(config.supabase.url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}

// Initialize PostgreSQL Connection Pool (for direct SQL / DDL migrations)
let pgPool = null;
const dbUrl = process.env.DATABASE_URL;
if (dbUrl) {
  pgPool = new Pool({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false }
  });
}

/**
 * Health & connection check for Supabase / PostgreSQL
 */
async function checkSupabaseConnection() {
  const results = {
    configured: Boolean(supabase || pgPool),
    supabaseClientReady: Boolean(supabase),
    pgPoolReady: Boolean(pgPool),
    message: ''
  };

  if (!results.configured) {
    results.message = 'Supabase environment variables (SUPABASE_URL / SUPABASE_ANON_KEY or DATABASE_URL) are not set. Using local persistent storage.';
    return results;
  }

  try {
    if (pgPool) {
      const client = await pgPool.connect();
      const res = await client.query('SELECT current_database(), now() as current_time;');
      client.release();
      results.database = res.rows[0].current_database;
      results.timestamp = res.rows[0].current_time;
      results.message = `Successfully connected to PostgreSQL database '${results.database}' on Supabase!`;
      return results;
    }

    if (supabase) {
      // Test Supabase REST endpoint
      const { data, error } = await supabase.from('users').select('count', { count: 'exact', head: true });
      if (error && error.code !== 'PGRST116' && !error.message.includes('relation "users" does not exist')) {
        throw error;
      }
      results.message = 'Successfully connected to Supabase project via REST API!';
      return results;
    }
  } catch (err) {
    results.error = err.message;
    results.message = `Failed connecting to Supabase: ${err.message}`;
  }

  return results;
}

module.exports = {
  supabase,
  pgPool,
  checkSupabaseConnection
};
