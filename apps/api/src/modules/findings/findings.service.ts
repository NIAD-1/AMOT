import { db } from '../../db';
import * as schema from '../../db/schema';
import { eq, and, count, asc } from 'drizzle-orm';
import { AuditService } from '../audit/audit.service';
import { NotificationsService } from '../notifications/notifications.service';

export class FindingsService {
  static async getByObservation(observationId: number) {
    const [finding] = await db.select().from(schema.observationFindings).where(eq(schema.observationFindings.observationId, observationId)).limit(1);
    return finding;
  }

  static async createOrUpdate(observationId: number, data: any, userId: number, role: string) {
    const existing = await this.getByObservation(observationId);
    let result;

    if (existing) {
      const [updated] = await db.update(schema.observationFindings)
        .set({ ...data, adjudicatedBy: userId, updatedAt: new Date() })
        .where(eq(schema.observationFindings.id, existing.id)).returning();
      result = updated;
      await AuditService.createLog(userId, role, 'N/A', 'UPDATE_FINDING', 'observationFindings', existing.id, existing, updated);
    } else {
      const [inserted] = await db.insert(schema.observationFindings)
        .values({ ...data, observationId, adjudicatedBy: userId }).returning();
      result = inserted;
      await AuditService.createLog(userId, role, 'N/A', 'CREATE_FINDING', 'observationFindings', inserted.id, null, inserted);
    }

    return result;
  }

  static async escalate(findingId: number, userId: number, role: string, notes: string) {
    const [finding] = await db.select().from(schema.observationFindings).where(eq(schema.observationFindings.id, findingId)).limit(1);
    if (!finding) throw new Error('Finding not found');

    const [updated] = await db.update(schema.observationFindings)
      .set({ escalationStatus: 'ESCALATED', updatedAt: new Date(), detectedDiscrepancies: { ...finding.detectedDiscrepancies as object, escalationNotes: notes } })
      .where(eq(schema.observationFindings.id, findingId)).returning();

    await AuditService.createLog(userId, role, 'N/A', 'ESCALATE_FINDING', 'observationFindings', findingId, finding, updated);

    // Notify supervisors
    const supervisors = await db.select().from(schema.users).where(eq(schema.users.role, 'SUPERVISOR'));
    for (const supervisor of supervisors) {
      await NotificationsService.create(supervisor.id, 'ESCALATION', 'Finding Escalated', `Finding for observation ${finding.observationId} was escalated.`, { findingId });
    }

    return updated;
  }

  static async listPendingReview(page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const query = db.select().from(schema.observationFindings)
      .where(eq(schema.observationFindings.regulatoryDecision, 'PENDING_REVIEW'))
      .limit(limit).offset(offset).orderBy(asc(schema.observationFindings.createdAt));
    
    const countQuery = db.select({ total: count() }).from(schema.observationFindings).where(eq(schema.observationFindings.regulatoryDecision, 'PENDING_REVIEW'));
    const [data, [{ total }]] = await Promise.all([query, countQuery]);
    return { data, total, page, limit };
  }

  static async listEscalated(page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const query = db.select().from(schema.observationFindings)
      .where(eq(schema.observationFindings.escalationStatus, 'ESCALATED'))
      .limit(limit).offset(offset).orderBy(asc(schema.observationFindings.updatedAt));
    
    const countQuery = db.select({ total: count() }).from(schema.observationFindings).where(eq(schema.observationFindings.escalationStatus, 'ESCALATED'));
    const [data, [{ total }]] = await Promise.all([query, countQuery]);
    return { data, total, page, limit };
  }

  static async getDashboardCounts() {
    const decisions = await db.select({ status: schema.observationFindings.regulatoryDecision, count: count() })
      .from(schema.observationFindings).groupBy(schema.observationFindings.regulatoryDecision);
    
    const escalations = await db.select({ status: schema.observationFindings.escalationStatus, count: count() })
      .from(schema.observationFindings).groupBy(schema.observationFindings.escalationStatus);

    return { decisions, escalations };
  }
}
