require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const { checkSupabaseConnection } = require('./supabaseClient');

const SCHEMA_PATH = path.join(__dirname, 'schema.sql');

async function runMigration() {
  console.log('====================================================');
  console.log('🚀 ACADEX LMS — SUPABASE DATABASE MIGRATION RUNNER');
  console.log('====================================================');

  const connectionStatus = await checkSupabaseConnection();
  console.log('Connection Status:', connectionStatus.message);

  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.log('\n💡 To run migrations automatically against your Supabase project:');
    console.log('1. Open your Supabase Dashboard: https://supabase.com/dashboard/project/_/settings/database');
    console.log('2. Copy your Connection String (URI format):');
    console.log('   postgresql://postgres.[project-ref]:[YOUR-PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true');
    console.log('3. Add DATABASE_URL to your server/.env file.');
    console.log('\nAlternatively, execute schema.sql directly in the Supabase Dashboard:');
    console.log(`- Open the SQL Editor in Supabase: https://supabase.com/dashboard/project/_/sql/new`);
    console.log(`- Copy and paste the entire contents of:\n  ${SCHEMA_PATH}`);
    console.log('- Click "RUN" to instantiate all 18 tables.\n');
    return;
  }

  const pool = new Pool({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false }
  });

  try {
    const client = await pool.connect();
    console.log('Connected to Supabase PostgreSQL database.');

    console.log(`Reading SQL schema file from: ${SCHEMA_PATH}...`);
    const sql = fs.readFileSync(SCHEMA_PATH, 'utf8');

    console.log('Executing schema migration DDL...');
    await client.query(sql);
    console.log('✅ Schema migration succeeded! All 18 tables and relationships instantiated.');

    // Check count of users
    const userRes = await client.query('SELECT count(*) FROM users;');
    console.log(`Existing users in Supabase: ${userRes.rows[0].count}`);

    client.release();
    await pool.end();
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    process.exit(1);
  }
}

if (require.main === module) {
  runMigration();
}

module.exports = runMigration;
