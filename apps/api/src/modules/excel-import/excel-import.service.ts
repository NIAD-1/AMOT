import { db } from '../../db';
import * as schema from '../../db/schema';
import { eq, count, desc } from 'drizzle-orm';
import * as xlsx from 'xlsx';
import { SchedulesService } from '../schedules/schedules.service';

export class ExcelImportService {
  static async upload(fileBuffer: Buffer, fileName: string, userId: number) {
    const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rawData = xlsx.utils.sheet_to_json(sheet) as any[];

    const validRows = [];
    const errorRows = [];

    // Map email to user ID
    const users = await db.select().from(schema.users).where(eq(schema.users.role, 'field_officer'));
    const emailToUserId = new Map(users.map(u => [u.email, u.id]));

    let rowIndex = 2; // header is 1
    for (const row of rawData) {
      const date = row['Date'] || row['date'];
      const officerEmail = row['Officer Email'] || row['officer_email'] || row['officer'];
      const product = row['Product'] || row['product'];
      const medium = row['Medium'] || row['medium'];
      const location = row['Location'] || row['location'];

      let errorMessage = null;
      let officerId = null;

      if (!date || !officerEmail || !product || !medium || !location) {
        errorMessage = 'Missing required columns (Date, Officer Email, Product, Medium, Location)';
      } else {
        officerId = emailToUserId.get(officerEmail);
        if (!officerId) errorMessage = `Officer with email ${officerEmail} not found`;
      }

      if (errorMessage) {
        errorRows.push({ rowNumber: rowIndex, rawData: row, errorMessage });
      } else {
        validRows.push({ date, officerId, product, medium, location, rawData: row });
      }
      rowIndex++;
    }

    const [importRecord] = await db.insert(schema.excelImports).values({
      fileName,
      uploadedBy: userId,
      totalRows: rawData.length,
      validRows: validRows.length,
      errorRows: errorRows.length,
      status: errorRows.length === 0 ? 'VALIDATED' : 'HAS_ERRORS',
      columnMapping: { date: 'Date', officer: 'Officer Email', product: 'Product', medium: 'Medium', location: 'Location' }
    }).returning();

    for (const err of errorRows) {
      await db.insert(schema.excelImportErrors).values({
        importId: importRecord.id,
        rowNumber: err.rowNumber,
        rawData: err.rawData,
        errorMessage: err.errorMessage
      });
    }

    return { import: importRecord, validRowsPreview: validRows.slice(0, 5), errorRows };
  }

  static async getPreview(importId: number) {
    const [importRecord] = await db.select().from(schema.excelImports).where(eq(schema.excelImports.id, importId)).limit(1);
    if (!importRecord) throw new Error('Not found');

    const errors = await db.select().from(schema.excelImportErrors).where(eq(schema.excelImportErrors.importId, importId));
    return { import: importRecord, errors };
  }

  static async confirm(importId: number, userId: number, validData: any[]) {
    const [importRecord] = await db.select().from(schema.excelImports).where(eq(schema.excelImports.id, importId)).limit(1);
    if (!importRecord || importRecord.status === 'COMPLETED') throw new Error('Invalid import record');

    await SchedulesService.createBatch(validData, importId);

    const [updated] = await db.update(schema.excelImports).set({ status: 'COMPLETED' }).where(eq(schema.excelImports.id, importId)).returning();
    return updated;
  }

  static async getHistory(page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const query = db.select({
      id: schema.excelImports.id,
      fileName: schema.excelImports.fileName,
      totalRows: schema.excelImports.totalRows,
      validRows: schema.excelImports.validRows,
      errorRows: schema.excelImports.errorRows,
      status: schema.excelImports.status,
      createdAt: schema.excelImports.createdAt,
      uploadedBy: {
        firstName: schema.users.firstName,
        lastName: schema.users.lastName,
      }
    }).from(schema.excelImports)
      .leftJoin(schema.users, eq(schema.excelImports.uploadedBy, schema.users.id))
      .limit(limit).offset(offset).orderBy(desc(schema.excelImports.createdAt));
      
    const countQuery = db.select({ total: count() }).from(schema.excelImports);
    const [data, [{ total }]] = await Promise.all([query, countQuery]);
    return { data, total, page, limit };
  }

  static async getErrors(importId: number) {
    return await db.select().from(schema.excelImportErrors).where(eq(schema.excelImportErrors.importId, importId));
  }
}
