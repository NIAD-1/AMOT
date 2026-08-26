import { db } from '../../db';
import * as schema from '../../db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../../config';

export class AuthService {
  static async login(email: string, passwordHashAttempt: string) {
    const [user] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, email))
      .limit(1);

    if (!user || !user.isActive) {
      throw new Error('Invalid credentials');
    }

    const isValid = await bcrypt.compare(passwordHashAttempt, user.passwordHash);
    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    const payload = {
      id: user.id,
      role: user.role,
      email: user.email,
    };

    const token = jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRY });

    const { passwordHash, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }

  static async register(data: any) {
    const { email, password, firstName, lastName, role } = data;
    const existing = await db.select().from(schema.users).where(eq(schema.users.email, email)).limit(1);
    if (existing.length > 0) throw new Error('Email already registered');

    const hashedPassword = await bcrypt.hash(password, 10);
    const [user] = await db.insert(schema.users).values({
      email,
      passwordHash: hashedPassword,
      firstName,
      lastName,
      role,
      isActive: true,
    }).returning();

    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  static async getMe(userId: number) {
    const [user] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, userId))
      .limit(1);
    if (!user) throw new Error('User not found');
    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
