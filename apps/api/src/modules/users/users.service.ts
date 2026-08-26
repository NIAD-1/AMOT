import { db } from '../../db';
import * as schema from '../../db/schema';
import { eq, or, ilike, count } from 'drizzle-orm';
import { AuditService } from '../audit/audit.service';

export class UsersService {
  static async list(page = 1, limit = 20, search?: string) {
    const offset = (page - 1) * limit;
    const baseQuery = db.select().from(schema.users);
    
    let whereCondition = undefined;
    if (search) {
      whereCondition = or(
        ilike(schema.users.firstName, `%${search}%`),
        ilike(schema.users.lastName, `%${search}%`),
        ilike(schema.users.email, `%${search}%`)
      );
    }
    
    const query = baseQuery.where(whereCondition).limit(limit).offset(offset);
    const countQuery = db.select({ total: count() }).from(schema.users).where(whereCondition);

    const [data, [{ total }]] = await Promise.all([query, countQuery]);
    return { data: data.map(u => { const { passwordHash, ...rest } = u; return rest; }), total, page, limit };
  }

  static async getById(id: number) {
    const [user] = await db.select().from(schema.users).where(eq(schema.users.id, id)).limit(1);
    if (!user) throw new Error('User not found');
    const { passwordHash, ...rest } = user;
    return rest;
  }

  static async update(id: number, data: Partial<{ firstName: string; lastName: string; role: any; isActive: boolean }>, actorId: number) {
    const old = await this.getById(id);
    const [updated] = await db.update(schema.users).set({ ...data, updatedAt: new Date() }).where(eq(schema.users.id, id)).returning();
    
    await AuditService.createLog(actorId, 'admin', 'N/A', 'UPDATE_USER', 'users', id, old, updated);
    
    const { passwordHash, ...rest } = updated;
    return rest;
  }

  static async delete(id: number, actorId: number) {
    const old = await this.getById(id);
    const [deleted] = await db.update(schema.users).set({ isActive: false, updatedAt: new Date() }).where(eq(schema.users.id, id)).returning();
    
    await AuditService.createLog(actorId, 'admin', 'N/A', 'DELETE_USER', 'users', id, old, { isActive: false });
    
    return deleted;
  }
}
