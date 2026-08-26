import { db } from '../../db';
import * as schema from '../../db/schema';
import { eq, count, desc } from 'drizzle-orm';
import { AuditService } from '../audit/audit.service';

export class NapamsService {
  static async getStatus() {
    const [{ total }] = await db.select({ total: count() }).from(schema.napamsApprovals);
    const [lastSync] = await db.select().from(schema.napamsSyncJobs).orderBy(desc(schema.napamsSyncJobs.completedAt)).limit(1);
    
    return {
      connectionStatus: 'CONNECTED', // Mocked for now
      lastSyncTime: lastSync?.completedAt || null,
      totalRecords: total,
      nextScheduledSync: new Date(Date.now() + 24 * 60 * 60 * 1000), // Mocked for tomorrow
    };
  }

  static async getSyncHistory(page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const query = db.select().from(schema.napamsSyncJobs).limit(limit).offset(offset).orderBy(desc(schema.napamsSyncJobs.createdAt));
    const countQuery = db.select({ total: count() }).from(schema.napamsSyncJobs);
    
    const [data, [{ total }]] = await Promise.all([query, countQuery]);
    return { data, total, page, limit };
  }

  static async triggerSync(type: string, userId: number, role: string) {
    const [job] = await db.insert(schema.napamsSyncJobs).values({
      syncType: type,
      status: 'RUNNING',
      recordsProcessed: 0,
      recordsCreated: 0,
      recordsUpdated: 0,
      recordsFailed: 0,
      startedAt: new Date()
    }).returning();

    await AuditService.createLog(userId, role, 'N/A', 'TRIGGER_SYNC', 'napamsSyncJobs', job.id, null, job);
    
    // Note: Actual sync logic would happen asynchronously via a queue
    // For now we just return the job
    return job;
  }

  static async verifySingleRecord(approvalNumber: string, userId: number, role: string) {
    const [approval] = await db.select().from(schema.napamsApprovals).where(eq(schema.napamsApprovals.approvalNumber, approvalNumber)).limit(1);
    if (!approval) throw new Error('Approval not found');

    const [updated] = await db.update(schema.napamsApprovals).set({ lastVerifiedAt: new Date() }).where(eq(schema.napamsApprovals.id, approval.id)).returning();
    
    await AuditService.createLog(userId, role, 'N/A', 'VERIFY_RECORD', 'napamsApprovals', approval.id, approval, updated);
    
    return updated;
  }
}
