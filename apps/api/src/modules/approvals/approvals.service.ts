import { db } from '../../db';
import * as schema from '../../db/schema';
import { eq, or, ilike, count } from 'drizzle-orm';

export class ApprovalsService {
  static async list(page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const query = db.select().from(schema.napamsApprovals).limit(limit).offset(offset);
    const countQuery = db.select({ total: count() }).from(schema.napamsApprovals);

    const [data, [{ total }]] = await Promise.all([query, countQuery]);
    return { data, total, page, limit };
  }

  static async search(queryStr: string, page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const condition = or(
      ilike(schema.napamsApprovals.productName, `%${queryStr}%`),
      ilike(schema.napamsApprovals.approvalNumber, `%${queryStr}%`),
      ilike(schema.napamsApprovals.manufacturerName, `%${queryStr}%`)
    );

    const query = db.select().from(schema.napamsApprovals).where(condition).limit(limit).offset(offset);
    const countQuery = db.select({ total: count() }).from(schema.napamsApprovals).where(condition);

    const [data, [{ total }]] = await Promise.all([query, countQuery]);
    return { data, total, page, limit };
  }

  static async getById(id: number) {
    const [approval] = await db.select().from(schema.napamsApprovals).where(eq(schema.napamsApprovals.id, id)).limit(1);
    if (!approval) throw new Error('Not found');

    const artworks = await db.select().from(schema.approvedArtworks).where(eq(schema.approvedArtworks.napamsApprovalId, id));
    return { ...approval, artworks };
  }

  static async getArtworks(approvalId: number) {
    return await db.select().from(schema.approvedArtworks).where(eq(schema.approvedArtworks.napamsApprovalId, approvalId));
  }
}
