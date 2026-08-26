import { 
  pgTable, 
  serial, 
  varchar, 
  timestamp, 
  boolean, 
  jsonb, 
  integer, 
  text, 
  pgEnum, 
  unique 
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const roleEnum = pgEnum('role', ['FIELD_OFFICER', 'ADVERT_TEAM', 'SUPERVISOR', 'ADMINISTRATOR', 'INTEGRATION_SERVICE']);
export const observationSourceEnum = pgEnum('observation_source', ['SPONTANEOUS', 'SCHEDULED', 'TEAM_ALERT']);
export const regulatoryDecisionEnum = pgEnum('regulatory_decision', ['PENDING_REVIEW', 'CONFIRMED_COMPLIANT', 'CONFIRMED_NON_COMPLIANT', 'REQUIRES_FURTHER_REVIEW', 'INCONCLUSIVE']);
export const escalationStatusEnum = pgEnum('escalation_status', ['NONE', 'ESCALATED', 'RESOLVED']);
export const systemMatchStatusEnum = pgEnum('system_match_status', ['MATCHED', 'UNMATCHED', 'PARTIAL']);
export const syncStatusEnum = pgEnum('sync_status', ['PENDING', 'RUNNING', 'COMPLETED', 'FAILED']);

// Users
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  firstName: varchar('first_name', { length: 255 }).notNull(),
  lastName: varchar('last_name', { length: 255 }).notNull(),
  role: roleEnum('role').notNull().default('FIELD_OFFICER'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// NAPAMS Approvals Cache
export const napamsApprovals = pgTable('napams_approvals', {
  id: serial('id').primaryKey(),
  approvalNumber: varchar('approval_number', { length: 255 }).unique().notNull(),
  productName: varchar('product_name', { length: 255 }).notNull(),
  applicantCompany: varchar('applicant_company', { length: 255 }).notNull(),
  manufacturerName: varchar('manufacturer_name', { length: 255 }),
  nafdacRegNumber: varchar('nafdac_reg_number', { length: 255 }),
  approvedMedium: jsonb('approved_medium').notNull(), // string[]
  approvedClaims: text('approved_claims'),
  approvalDate: timestamp('approval_date').notNull(),
  expiryDate: timestamp('expiry_date').notNull(),
  rawPayload: jsonb('raw_payload').notNull(),
  lastSynchronizedAt: timestamp('last_synchronized_at').defaultNow().notNull(),
  lastVerifiedAt: timestamp('last_verified_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Approved Artworks
export const approvedArtworks = pgTable('approved_artworks', {
  id: serial('id').primaryKey(),
  napamsApprovalId: integer('napams_approval_id').references(() => napamsApprovals.id).notNull(),
  versionNumber: integer('version_number').notNull(),
  storagePath: varchar('storage_path', { length: 255 }).notNull(),
  fileSha256: varchar('file_sha256', { length: 255 }).notNull(),
  isCurrentVersion: boolean('is_current_version').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Surveillance Alerts
export const surveillanceAlerts = pgTable('surveillance_alerts', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  priority: varchar('priority', { length: 50 }).notNull(),
  targetChannels: jsonb('target_channels').notNull(), // string[]
  targetLocations: jsonb('target_locations').notNull(), // string[]
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  createdBy: integer('created_by').references(() => users.id).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Alert Acknowledgements
export const alertAcknowledgements = pgTable('alert_acknowledgements', {
  id: serial('id').primaryKey(),
  alertId: integer('alert_id').references(() => surveillanceAlerts.id).notNull(),
  userId: integer('user_id').references(() => users.id).notNull(),
  viewedAt: timestamp('viewed_at'),
  acknowledgedAt: timestamp('acknowledged_at'),
}, (t) => ({
  unq: unique().on(t.alertId, t.userId)
}));

// Excel Imports
export const excelImports = pgTable('excel_imports', {
  id: serial('id').primaryKey(),
  fileName: varchar('file_name', { length: 255 }).notNull(),
  uploadedBy: integer('uploaded_by').references(() => users.id).notNull(),
  totalRows: integer('total_rows').default(0).notNull(),
  validRows: integer('valid_rows').default(0).notNull(),
  errorRows: integer('error_rows').default(0).notNull(),
  status: varchar('status', { length: 50 }).notNull(), // PENDING, PROCESSING, COMPLETED, FAILED
  columnMapping: jsonb('column_mapping'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Excel Import Errors
export const excelImportErrors = pgTable('excel_import_errors', {
  id: serial('id').primaryKey(),
  importId: integer('import_id').references(() => excelImports.id).notNull(),
  rowNumber: integer('row_number').notNull(),
  rawData: jsonb('raw_data').notNull(),
  errorMessage: text('error_message').notNull(),
});

// Monitoring Schedules
export const monitoringSchedules = pgTable('monitoring_schedules', {
  id: serial('id').primaryKey(),
  importBatchId: integer('import_batch_id').references(() => excelImports.id),
  scheduleDate: timestamp('schedule_date').notNull(),
  assignedOfficerId: integer('assigned_officer_id').references(() => users.id).notNull(),
  targetProduct: varchar('target_product', { length: 255 }).notNull(),
  medium: varchar('medium', { length: 100 }).notNull(),
  targetLocation: varchar('target_location', { length: 255 }),
  status: varchar('status', { length: 50 }).default('PENDING').notNull(), // PENDING, COMPLETED, MISSED
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Observations
export const observations = pgTable('observations', {
  id: serial('id').primaryKey(),
  observationNumber: varchar('observation_number', { length: 255 }).unique().notNull(),
  source: observationSourceEnum('source').notNull(),
  scheduleId: integer('schedule_id').references(() => monitoringSchedules.id),
  alertId: integer('alert_id').references(() => surveillanceAlerts.id),
  capturedBy: integer('captured_by').references(() => users.id).notNull(),
  capturedAt: timestamp('captured_at').defaultNow().notNull(),
  medium: varchar('medium', { length: 100 }).notNull(),
  gpsCoordinates: jsonb('gps_coordinates'), // { lat, lng }
  digitalUrl: text('digital_url'),
  observedProductName: varchar('observed_product_name', { length: 255 }),
  observedManufacturer: varchar('observed_manufacturer', { length: 255 }),
  officerNotes: text('officer_notes'),
  clientIdempotencyKey: varchar('client_idempotency_key', { length: 255 }).unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Evidence Files
export const evidenceFiles = pgTable('evidence_files', {
  id: serial('id').primaryKey(),
  observationId: integer('observation_id').references(() => observations.id).notNull(),
  storageKey: varchar('storage_key', { length: 255 }).notNull(),
  originalFilename: varchar('original_filename', { length: 255 }).notNull(),
  mimeType: varchar('mime_type', { length: 100 }).notNull(),
  fileSizeBytes: integer('file_size_bytes').notNull(),
  sha256Hash: varchar('sha256_hash', { length: 255 }).notNull(),
  isOriginal: boolean('is_original').default(true).notNull(),
  derivedFromEvidenceId: integer('derived_from_evidence_id'), // self-reference done in relations
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// AI OCR Analyses
export const aiOcrAnalyses = pgTable('ai_ocr_analyses', {
  id: serial('id').primaryKey(),
  observationId: integer('observation_id').references(() => observations.id).notNull(),
  evidenceFileId: integer('evidence_file_id').references(() => evidenceFiles.id).notNull(),
  modelProvider: varchar('model_provider', { length: 100 }).notNull(),
  modelVersion: varchar('model_version', { length: 100 }).notNull(),
  extractedFields: jsonb('extracted_fields').notNull(),
  confidenceScore: integer('confidence_score'),
  rawResponse: jsonb('raw_response').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Observation Findings
export const observationFindings = pgTable('observation_findings', {
  id: serial('id').primaryKey(),
  observationId: integer('observation_id').references(() => observations.id).unique().notNull(),
  matchedNapamsId: integer('matched_napams_id').references(() => napamsApprovals.id),
  systemMatchStatus: systemMatchStatusEnum('system_match_status'),
  systemConfidence: integer('system_confidence'),
  detectedDiscrepancies: jsonb('detected_discrepancies'),
  regulatoryDecision: regulatoryDecisionEnum('regulatory_decision').default('PENDING_REVIEW').notNull(),
  adjudicatedBy: integer('adjudicated_by').references(() => users.id),
  escalationStatus: escalationStatusEnum('escalation_status').default('NONE').notNull(),
  escalatedTo: integer('escalated_to').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Napams Sync Jobs
export const napamsSyncJobs = pgTable('napams_sync_jobs', {
  id: serial('id').primaryKey(),
  syncType: varchar('sync_type', { length: 50 }).notNull(), // FULL, INCREMENTAL
  status: syncStatusEnum('status').notNull().default('PENDING'),
  recordsProcessed: integer('records_processed').default(0).notNull(),
  recordsCreated: integer('records_created').default(0).notNull(),
  recordsUpdated: integer('records_updated').default(0).notNull(),
  recordsFailed: integer('records_failed').default(0).notNull(),
  errorLog: text('error_log'),
  startedAt: timestamp('started_at'),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Audit Logs
export const auditLogs = pgTable('audit_logs', {
  id: serial('id').primaryKey(),
  actorId: integer('actor_id').references(() => users.id),
  actorRole: varchar('actor_role', { length: 100 }),
  ipAddress: varchar('ip_address', { length: 100 }),
  action: varchar('action', { length: 255 }).notNull(),
  targetEntity: varchar('target_entity', { length: 100 }).notNull(),
  targetId: varchar('target_id', { length: 100 }).notNull(),
  oldState: jsonb('old_state'),
  newState: jsonb('new_state'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Notifications
export const notifications = pgTable('notifications', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  type: varchar('type', { length: 100 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  body: text('body').notNull(),
  isRead: boolean('is_read').default(false).notNull(),
  observationId: integer('observation_id').references(() => observations.id),
  alertId: integer('alert_id').references(() => surveillanceAlerts.id),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const evidenceFilesRelations = relations(evidenceFiles, ({ one }) => ({
  derivedFrom: one(evidenceFiles, {
    fields: [evidenceFiles.derivedFromEvidenceId],
    references: [evidenceFiles.id],
  }),
}));
