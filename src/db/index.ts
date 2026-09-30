import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// This defaults to a dummy string if missing so the app doesn't crash during build
const sql = neon(process.env.DATABASE_URL || 'postgresql://dummy:dummy@dummy.neon.tech/dummy?sslmode=require');
export const db = drizzle(sql, { schema });
