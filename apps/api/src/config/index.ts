import { config } from 'dotenv';
import { z } from 'zod';

config();

const envSchema = z.object({
  PORT: z.string().default('3000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
  
  DATABASE_URL: z.string().min(1),
  REDIS_URL: z.string().min(1),
  
  JWT_SECRET: z.string().min(1),
  JWT_EXPIRY: z.string().default('24h'),
  
  S3_BUCKET: z.string().min(1),
  S3_REGION: z.string().min(1),
  S3_ACCESS_KEY: z.string().min(1),
  S3_SECRET_KEY: z.string().min(1),
  S3_ENDPOINT: z.string().optional(),
  
  NAPAMS_BASE_URL: z.string().min(1),
  NAPAMS_CLIENT_ID: z.string().min(1),
  NAPAMS_CLIENT_SECRET: z.string().min(1),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('Invalid environment variables:', _env.error.format());
  process.exit(1);
}

export const env = _env.data;
