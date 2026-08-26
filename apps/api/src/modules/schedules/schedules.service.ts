import { db } from '../../db';
import * as schema from '../../db/schema';
import { eq, and, count, desc, asc, lte, gte } from 'drizzle-orm';
import { AuditService } from '../audit/audit.service';
import { NotificationsService } from '../notifications/notifications.service';

export class SchedulesService {
  static async list(page = 1, limit = 20, filters?: any) {
    const offset = (page - 1) * limit;
    const conditions = [];
    if (filters?.assignedOfficerId) conditions.push(eq(schema.monitoringSchedules.assignedOfficerId, filters.assignedOfficerId));
    if (filters?.status) conditions.push(eq(schema.monitoringSchedules.status, filters.status));
    if (filters?.dateFrom) conditions.push(gte(schema.monitoringSchedules.scheduleDate, new Date(filters.dateFrom)));
    if (filters?.dateTo) conditions.push(lte(schema.monitoringSchedules.scheduleDate, new Date(filters.dateTo)));

    const query = db.select({
      id: schema.monitoringSchedules.id,
      scheduleDate: schema.monitoringSchedules.scheduleDate,
      targetProduct: schema.monitoringSchedules.targetProduct,
      medium: schema.monitoringSchedules.medium,
      targetLocation: schema.monitoringSchedules.targetLocation,
      status: schema.monitoringSchedules.status,
      officer: {
        id: schema.users.id,
        firstName: schema.users.firstName,
        lastName: schema.users.lastName,
      }
    }).from(schema.monitoringSchedules)
      .leftJoin(schema.users, eq(schema.monitoringSchedules.assignedOfficerId, schema.users.id))
      .where(conditions.length ? and(...conditions) : undefined)
      .limit(limit).offset(offset).orderBy(desc(schema.monitoringSchedules.scheduleDate));
      
    const countQuery = db.select({ total: count() }).from(schema.monitoringSchedules).where(conditions.length ? and(...conditions) : undefined);
    const [data, [{ total }]] = await Promise.all([query, countQuery]);
    return { data, total, page, limit };
  }

  static async getMyAssignments(userId: number, dateFrom?: string, dateTo?: string) {
    const conditions = [eq(schema.monitoringSchedules.assignedOfficerId, userId)];
    if (dateFrom) conditions.push(gte(schema.monitoringSchedules.scheduleDate, new Date(dateFrom)));
    if (dateTo) conditions.push(lte(schema.monitoringSchedules.scheduleDate, new Date(dateTo)));

    return await db.select().from(schema.monitoringSchedules)
      .where(and(...conditions))
      .orderBy(asc(schema.monitoringSchedules.scheduleDate));
  }

  static async getById(id: number) {
    const [schedule] = await db.select().from(schema.monitoringSchedules).where(eq(schema.monitoringSchedules.id, id)).limit(1);
    return schedule;
  }

  static async updateStatus(id: number, status: string, userId: number, role: string) {
    const old = await this.getById(id);
    const [updated] = await db.update(schema.monitoringSchedules).set({ status, updatedAt: new Date() }).where(eq(schema.monitoringSchedules.id, id)).returning();
    await AuditService.createLog(userId, role, 'N/A', 'UPDATE_SCHEDULE_STATUS', 'monitoringSchedules', id, old, updated);
    return updated;
  }

  static async createBatch(assignments: any[], importId: number) {
    const values = assignments.map(a => ({
      importBatchId: importId,
      scheduleDate: new Date(a.date),
      assignedOfficerId: a.officerId,
      targetProduct: a.product,
      medium: a.medium,
      targetLocation: a.location,
      status: 'PENDING'
    }));

    const inserted = await db.insert(schema.monitoringSchedules).values(values).returning();
    
    // Notify officers
    const officerMap = new Map();
    for (const item of inserted) {
      if (!officerMap.has(item.assignedOfficerId)) {
        officerMap.set(item.assignedOfficerId, 0);
      }
      officerMap.set(item.assignedOfficerId, officerMap.get(item.assignedOfficerId) + 1);
    }

    for (const [officerId, c] of officerMap.entries()) {
      await NotificationsService.create(officerId, 'SCHEDULE', 'New Assignments', `You have been assigned ${c} new monitoring tasks.`);
    }

    return inserted;
  }
}
