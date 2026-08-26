import { db } from '../../db';
import * as schema from '../../db/schema';
import { and, desc, eq, gte, lte } from 'drizzle-orm';

export class AuditService {
  static async createLog(
    actorId: number,
    actorRole: string,
    ipAddress: string,
    action: string,
    targetEntity: string,
    targetId: string | number,
    oldState?: any,
    newState?: any
  ) {
    await db.insert(schema.auditLogs).values({
      actorId,
      actorRole,
      ipAddress,
      action,
      targetEntity,
      targetId: String(targetId),
      oldState,
      newState,
    });
  }

  static async list(
    filters: {
      actorId?: number;
      action?: string;
      targetEntity?: string;
      targetId?: string;
      dateFrom?: Date;
      dateTo?: Date;
    },
    page = 1,
    limit = 20
  ) {
    const conditions = [];
    if (filters.actorId) conditions.push(eq(schema.auditLogs.actorId, filters.actorId));
    if (filters.action) conditions.push(eq(schema.auditLogs.action, filters.action));
    if (filters.targetEntity) conditions.push(eq(schema.auditLogs.targetEntity, filters.targetEntity));
    if (filters.targetId) conditions.push(eq(schema.auditLogs.targetId, filters.targetId));
    if (filters.dateFrom) conditions.push(gte(schema.auditLogs.createdAt, filters.dateFrom));
    if (filters.dateTo) conditions.push(lte(schema.auditLogs.createdAt, filters.dateTo));

    const query = db
      .select()
      .from(schema.auditLogs)
      .where(and(...conditions))
      .orderBy(desc(schema.auditLogs.createdAt))
      .limit(limit)
      .offset((page - 1) * limit);

    const data = await query;
    return { data, page, limit };
  }
}
