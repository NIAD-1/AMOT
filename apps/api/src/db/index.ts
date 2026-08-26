import { neon } from '@neondatabase/serverless';
import { drizzle as drizzleNeon } from 'drizzle-orm/neon-http';
import { drizzle as drizzlePg } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/amot';

export const db = connectionString.includes('neon.tech') || connectionString.includes('sslmode=')
  ? drizzleNeon(neon(connectionString), { schema })
  : drizzlePg(postgres(connectionString), { schema });
