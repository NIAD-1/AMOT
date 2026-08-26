import { db } from '../../db';
import * as schema from '../../db/schema';
import { eq, and, count, desc, gte, lte } from 'drizzle-orm';
import { AuditService } from '../audit/audit.service';
import { randomBytes } from 'crypto';

export class ObservationsService {
  static async create(data: any, userId: number, role: string) {
    const existing = await db.select().from(schema.observations).where(eq(schema.observations.clientIdempotencyKey, data.clientIdempotencyKey)).limit(1);
    if (existing.length > 0) return existing[0];

    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
    const randomStr = randomBytes(3).toString('hex').toUpperCase();
    const observationNumber = `OBS-${dateStr}-${randomStr}`;

    const [observation] = await db.insert(schema.observations).values({
      observationNumber,
      source: data.source,
      scheduleId: data.scheduleId,
      alertId: data.alertId,
      capturedBy: userId,
      capturedAt: new Date(data.capturedAt),
      medium: data.medium,
      gpsCoordinates: data.gpsCoordinates,
      digitalUrl: data.digitalUrl,
      observedProductName: data.observedProductName,
      observedManufacturer: data.observedManufacturer,
      officerNotes: data.officerNotes,
      clientIdempotencyKey: data.clientIdempotencyKey,
    }).returning();

    await AuditService.createLog(userId, role, 'N/A', 'CREATE_OBSERVATION', 'observations', observation.id, null, observation);

    return observation;
  }

  static async list(filters: any, page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const conditions = [];
    if (filters.source) conditions.push(eq(schema.observations.source, filters.source));
    if (filters.medium) conditions.push(eq(schema.observations.medium, filters.medium));
    if (filters.capturedBy) conditions.push(eq(schema.observations.capturedBy, filters.capturedBy));
    if (filters.dateFrom) conditions.push(gte(schema.observations.capturedAt, new Date(filters.dateFrom)));
    if (filters.dateTo) conditions.push(lte(schema.observations.capturedAt, new Date(filters.dateTo)));

    const query = db
      .select({
        id: schema.observations.id,
        observationNumber: schema.observations.observationNumber,
        source: schema.observations.source,
        capturedAt: schema.observations.capturedAt,
        medium: schema.observations.medium,
        observedProductName: schema.observations.observedProductName,
        officer: {
          firstName: schema.users.firstName,
          lastName: schema.users.lastName,
        }
      })
      .from(schema.observations)
      .leftJoin(schema.users, eq(schema.observations.capturedBy, schema.users.id))
      .where(conditions.length ? and(...conditions) : undefined)
      .limit(limit)
      .offset(offset)
      .orderBy(desc(schema.observations.capturedAt));

    const countQuery = db.select({ total: count() }).from(schema.observations).where(conditions.length ? and(...conditions) : undefined);
    
    const [data, [{ total }]] = await Promise.all([query, countQuery]);
    return { data, total, page, limit };
  }

  static async getById(id: number) {
    const [observation] = await db
      .select()
      .from(schema.observations)
      .where(eq(schema.observations.id, id))
      .limit(1);

    if (!observation) throw new Error('Observation not found');

    const evidence = await db.select().from(schema.evidenceFiles).where(eq(schema.evidenceFiles.observationId, id));
    const [finding] = await db.select().from(schema.observationFindings).where(eq(schema.observationFindings.observationId, id)).limit(1);
    
    return { ...observation, evidence, finding };
  }

  static async update(id: number, data: any, userId: number, role: string) {
    const old = await this.getById(id);
    const [updated] = await db.update(schema.observations).set({
      ...data,
      updatedAt: new Date()
    }).where(eq(schema.observations.id, id)).returning();

    await AuditService.createLog(userId, role, 'N/A', 'UPDATE_OBSERVATION', 'observations', id, old, updated);
    return updated;
  }

  static async getCountsByStatus() {
    const results = await db
      .select({
        status: schema.observationFindings.regulatoryDecision,
        count: count()
      })
      .from(schema.observationFindings)
      .groupBy(schema.observationFindings.regulatoryDecision);
    return results;
  }
}
