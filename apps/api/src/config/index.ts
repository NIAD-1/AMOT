import { config } from 'dotenv';
import { z } from 'zod';

config();

const envSchema = z.object({
  PORT: z.string().default('3000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('production'),
  CORS_ORIGIN: z.string().default('*'),
  
  DATABASE_URL: z.string().default('postgresql://neondb_owner:npg_ljoY0OFURmd6@ep-late-resonance-ado8573f-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require'),
  REDIS_URL: z.string().default('redis://localhost:6379'),
  
  JWT_SECRET: z.string().default('amot-super-secure-production-jwt-key-2026'),
  JWT_EXPIRY: z.string().default('24h'),
  
  S3_BUCKET: z.string().default('amot-vault'),
  S3_REGION: z.string().default('us-east-1'),
  S3_ACCESS_KEY: z.string().default('mock-key'),
  S3_SECRET_KEY: z.string().default('mock-secret'),
  S3_ENDPOINT: z.string().optional(),
  
  NAPAMS_BASE_URL: z.string().default('https://napams.nafdac.gov.ng/api/v1'),
  NAPAMS_CLIENT_ID: z.string().default('amot-client-id'),
  NAPAMS_CLIENT_SECRET: z.string().default('amot-client-secret'),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.warn('Environment variables warnings:', _env.error.format());
}

export const env = _env.success ? _env.data : envSchema.parse({});
