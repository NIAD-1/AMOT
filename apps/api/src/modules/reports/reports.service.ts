import { db } from '../../db';
import * as schema from '../../db/schema';
import { eq, and, count, gte, lte } from 'drizzle-orm';
import { stringify } from 'csv-stringify';

export class ReportsService {
  static async getDashboardMetrics(filters: any) {
    const conditions = [];
    if (filters.dateFrom) conditions.push(gte(schema.observations.capturedAt, new Date(filters.dateFrom)));
    if (filters.dateTo) conditions.push(lte(schema.observations.capturedAt, new Date(filters.dateTo)));

    const whereClause = conditions.length ? and(...conditions) : undefined;

    const bySource = await db.select({ source: schema.observations.source, count: count() }).from(schema.observations).where(whereClause).groupBy(schema.observations.source);
    const byMedium = await db.select({ medium: schema.observations.medium, count: count() }).from(schema.observations).where(whereClause).groupBy(schema.observations.medium);
    
    // For findings we need to join
    const findingsQuery = db.select({ status: schema.observationFindings.regulatoryDecision, count: count() }).from(schema.observationFindings)
      .leftJoin(schema.observations, eq(schema.observationFindings.observationId, schema.observations.id))
      .where(whereClause).groupBy(schema.observationFindings.regulatoryDecision);
    const byFindingStatus = await findingsQuery;

    return { bySource, byMedium, byFindingStatus };
  }

  static async streamObservationsCsv(filters: any, outputStream: any) {
    const conditions = [];
    if (filters.dateFrom) conditions.push(gte(schema.observations.capturedAt, new Date(filters.dateFrom)));
    if (filters.dateTo) conditions.push(lte(schema.observations.capturedAt, new Date(filters.dateTo)));

    const query = db.select({
      observationNumber: schema.observations.observationNumber,
      capturedAt: schema.observations.capturedAt,
      source: schema.observations.source,
      medium: schema.observations.medium,
      gpsCoordinates: schema.observations.gpsCoordinates,
      observedProductName: schema.observations.observedProductName,
      observedManufacturer: schema.observations.observedManufacturer,
      officerNotes: schema.observations.officerNotes,
      digitalUrl: schema.observations.digitalUrl,
      officerName: schema.users.firstName,
      officerLastName: schema.users.lastName,
      matchStatus: schema.observationFindings.systemMatchStatus,
      regulatoryDecision: schema.observationFindings.regulatoryDecision,
      escalationStatus: schema.observationFindings.escalationStatus,
      napamsApprovalNo: schema.napamsApprovals.approvalNumber,
    })
    .from(schema.observations)
    .leftJoin(schema.users, eq(schema.observations.capturedBy, schema.users.id))
    .leftJoin(schema.observationFindings, eq(schema.observationFindings.observationId, schema.observations.id))
    .leftJoin(schema.napamsApprovals, eq(schema.observationFindings.matchedNapamsId, schema.napamsApprovals.id))
    .where(conditions.length ? and(...conditions) : undefined);

    const stringifier: any = stringify({ header: true, columns: [
      'Observation Number', 'Captured At', 'Source', 'Medium', 'Location', 'GPS Lat', 'GPS Lng', 
      'Observed Product', 'Observed Manufacturer', 'Officer Name', 'Officer Notes', 'Match Status', 
      'Regulatory Decision', 'Escalation Status', 'NAPAMS Approval No', 'Digital URL'
    ]});

    stringifier.pipe(outputStream);

    const rows = await query;
    for (const row of rows) {
      let lat = '', lng = '';
      if (row.gpsCoordinates) {
        try {
          const coords = typeof row.gpsCoordinates === 'string' ? JSON.parse(row.gpsCoordinates) : row.gpsCoordinates;
          lat = coords.lat || '';
          lng = coords.lng || '';
        } catch (e) {}
      }

      stringifier.write([
        row.observationNumber,
        row.capturedAt?.toISOString(),
        row.source,
        row.medium,
        '', // Location
        lat,
        lng,
        row.observedProductName,
        row.observedManufacturer,
        `${row.officerName} ${row.officerLastName}`,
        row.officerNotes,
        row.matchStatus,
        row.regulatoryDecision,
        row.escalationStatus,
        row.napamsApprovalNo,
        row.digitalUrl
      ]);
    }

    stringifier.end();
  }

  static async streamFindingsCsv(filters: any, outputStream: any) {
    const stringifier: any = stringify({ header: true });
    stringifier.pipe(outputStream);
    const rows = await db.select().from(schema.observationFindings);
    rows.forEach(r => stringifier.write(Object.values(r)));
    stringifier.end();
  }

  static async streamSchedulesCsv(filters: any, outputStream: any) {
    const stringifier: any = stringify({ header: true });
    stringifier.pipe(outputStream);
    const rows = await db.select().from(schema.monitoringSchedules);
    rows.forEach(r => stringifier.write(Object.values(r)));
    stringifier.end();
  }

  static async streamAuditLogsCsv(filters: any, outputStream: any) {
    const stringifier: any = stringify({ header: true });
    stringifier.pipe(outputStream);
    const rows = await db.select().from(schema.auditLogs);
    rows.forEach(r => stringifier.write(Object.values(r)));
    stringifier.end();
  }
}
