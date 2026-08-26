import { db } from '../../db';
import * as schema from '../../db/schema';
import { eq, and, count, gte, desc } from 'drizzle-orm';
import { AuditService } from '../audit/audit.service';
import { NotificationsService } from '../notifications/notifications.service';

export class AlertsService {
  static async create(data: any, userId: number, role: string) {
    const [alert] = await db.insert(schema.surveillanceAlerts).values({
      ...data,
      createdBy: userId,
    }).returning();

    await AuditService.createLog(userId, role, 'N/A', 'CREATE_ALERT', 'surveillanceAlerts', alert.id, null, alert);

    // Notify all field officers
    const fieldOfficers = await db.select().from(schema.users).where(eq(schema.users.role, 'FIELD_OFFICER'));
    for (const officer of fieldOfficers) {
      await NotificationsService.create(officer.id, 'ALERT', alert.title, alert.description, { alertId: alert.id });
    }

    return alert;
  }

  static async list(page = 1, limit = 20, activeOnly = false) {
    const offset = (page - 1) * limit;
    const now = new Date();
    
    let condition = undefined;
    if (activeOnly) {
      condition = gte(schema.surveillanceAlerts.endDate, now);
    }

    const query = db.select().from(schema.surveillanceAlerts)
      .where(condition)
      .limit(limit).offset(offset).orderBy(desc(schema.surveillanceAlerts.createdAt));
      
    const countQuery = db.select({ total: count() }).from(schema.surveillanceAlerts).where(condition);
    const [data, [{ total }]] = await Promise.all([query, countQuery]);
    return { data, total, page, limit };
  }

  static async getById(id: number) {
    const [alert] = await db.select().from(schema.surveillanceAlerts).where(eq(schema.surveillanceAlerts.id, id)).limit(1);
    if (!alert) throw new Error('Alert not found');

    const [{ c }] = await db.select({ c: count() }).from(schema.alertAcknowledgements).where(eq(schema.alertAcknowledgements.alertId, id));
    return { ...alert, acknowledgementsCount: c };
  }

  static async acknowledge(alertId: number, userId: number) {
    const existing = await db.select().from(schema.alertAcknowledgements).where(
      and(eq(schema.alertAcknowledgements.alertId, alertId), eq(schema.alertAcknowledgements.userId, userId))
    ).limit(1);

    if (existing.length > 0) {
      const [updated] = await db.update(schema.alertAcknowledgements)
        .set({ acknowledgedAt: new Date() })
        .where(eq(schema.alertAcknowledgements.id, existing[0].id)).returning();
      return updated;
    } else {
      const [inserted] = await db.insert(schema.alertAcknowledgements)
        .values({ alertId, userId, viewedAt: new Date(), acknowledgedAt: new Date() }).returning();
      return inserted;
    }
  }

  static async getAcknowledgements(alertId: number) {
    return await db.select({
      id: schema.alertAcknowledgements.id,
      viewedAt: schema.alertAcknowledgements.viewedAt,
      acknowledgedAt: schema.alertAcknowledgements.acknowledgedAt,
      user: {
        id: schema.users.id,
        firstName: schema.users.firstName,
        lastName: schema.users.lastName,
      }
    }).from(schema.alertAcknowledgements)
      .leftJoin(schema.users, eq(schema.alertAcknowledgements.userId, schema.users.id))
      .where(eq(schema.alertAcknowledgements.alertId, alertId));
  }
}
