import { db } from '../../db';
import * as schema from '../../db/schema';
import { eq, count, and, desc, asc, lte, gte } from 'drizzle-orm';
import { NotificationsService } from '../notifications/notifications.service';

export class NotificationsService {
  static async create(userId: number, type: string, title: string, body: string, metadata?: any) {
    const [notification] = await db.insert(schema.notifications).values({
      userId, type, title, body, metadata,
    }).returning();
    return notification;
  }

  static async listForUser(userId: number, page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const query = db.select().from(schema.notifications)
      .where(eq(schema.notifications.userId, userId))
      .limit(limit).offset(offset).orderBy(desc(schema.notifications.createdAt));
    
    const countQuery = db.select({ total: count() }).from(schema.notifications).where(eq(schema.notifications.userId, userId));
    const [data, [{ total }]] = await Promise.all([query, countQuery]);
    return { data, total, page, limit };
  }

  static async markRead(id: number, userId: number) {
    const [updated] = await db.update(schema.notifications).set({ isRead: true })
      .where(and(eq(schema.notifications.id, id), eq(schema.notifications.userId, userId))).returning();
    return updated;
  }

  static async markAllRead(userId: number) {
    await db.update(schema.notifications).set({ isRead: true }).where(eq(schema.notifications.userId, userId));
  }

  static async getUnreadCount(userId: number) {
    const [{ c }] = await db.select({ c: count() }).from(schema.notifications)
      .where(and(eq(schema.notifications.userId, userId), eq(schema.notifications.isRead, false)));
    return c;
  }
}
