import {
  UserRole, ObservationSource, MediumType, MatchStatus, RegulatoryDecision,
  EscalationStatus, SyncStatus, ScheduleStatus, AlertPriority, NotificationType
} from '../constants/index.js';

export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
}

export interface User extends BaseEntity {
  email: string;
  full_name: string;
  role: UserRole;
  is_active: boolean;
  directorate?: string;
  location_station?: string;
}

export interface UserCreateDTO {
  email: string;
  password?: string;
  full_name: string;
  role: UserRole;
  directorate?: string;
  location_station?: string;
}

export interface UserUpdateDTO {
  full_name?: string;
  role?: UserRole;
  is_active?: boolean;
  directorate?: string;
  location_station?: string;
}

export interface NapamsApproval extends BaseEntity {
  certificate_number: string;
  product_name: string;
  applicant_name: string;
  approval_date: string;
  expiry_date: string;
  status: string;
  approved_media: MediumType[];
}

export interface NapamsApprovalSearchResult extends NapamsApproval {
  relevance_score?: number;
}

export interface ApprovedArtwork extends BaseEntity {
  napams_approval_id: string;
  file_url: string;
  file_type: string;
  extracted_text?: string;
}

export interface SurveillanceAlert extends BaseEntity {
  title: string;
  product_target?: string;
  manufacturer_target?: string;
  description: string;
  priority: AlertPriority;
  target_channels: MediumType[];
  target_locations: string[];
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_by_id: string;
}

export interface AlertCreateDTO {
  title: string;
  product_target?: string;
  manufacturer_target?: string;
  description: string;
  priority: AlertPriority;
  target_channels: MediumType[];
  target_locations: string[];
  start_date: string;
  end_date: string;
}

export interface AlertAcknowledgement extends BaseEntity {
  alert_id: string;
  user_id: string;
  acknowledged_at: string;
}

export interface MonitoringSchedule extends BaseEntity {
  name: string;
  description?: string;
  start_date: string;
  end_date: string;
  created_by_id: string;
  status: ScheduleStatus;
}

export interface MonitoringAssignment extends BaseEntity {
  schedule_id: string;
  officer_id: string;
  location_area: string;
  target_media: MediumType[];
  instructions?: string;
  status: ScheduleStatus;
}

export interface Observation extends BaseEntity {
  officer_id: string;
  source: ObservationSource;
  medium: MediumType;
  location_lat?: number;
  location_lng?: number;
  location_address?: string;
  observation_date: string;
  product_name?: string;
  manufacturer_name?: string;
  notes?: string;
}

export interface ObservationCreateDTO {
  source: ObservationSource;
  medium: MediumType;
  location_lat?: number;
  location_lng?: number;
  location_address?: string;
  observation_date: string;
  product_name?: string;
  manufacturer_name?: string;
  notes?: string;
}

export interface ObservationListFilters {
  date_from?: string;
  date_to?: string;
  officer_id?: string;
  medium?: MediumType;
  source?: ObservationSource;
}

export interface EvidenceFile extends BaseEntity {
  observation_id: string;
  storage_key: string;
  original_filename: string;
  mime_type: string;
  file_size_bytes: number;
  sha256_hash: string;
  file_url?: string;
}

export interface EvidenceUploadRequest {
  sha256: string;
  mimeType: string;
  byteLength: number;
  idempotencyKey: string;
}

export interface EvidenceCommitRequest {
  storageKey: string;
  observationId: string;
  originalFilename: string;
  mimeType: string;
  fileSizeBytes: number;
  sha256Hash: string;
  metadata?: Record<string, any>;
}

export interface AiOcrAnalysis extends BaseEntity {
  evidence_id: string;
  extracted_text: string;
  confidence_score: number;
  detected_brands?: string[];
  detected_products?: string[];
  raw_response?: Record<string, any>;
}

export interface ObservationFinding extends BaseEntity {
  observation_id: string;
  matched_napams_id?: string;
  system_match_status: MatchStatus;
  regulatory_decision: RegulatoryDecision;
  escalation_status: EscalationStatus;
  justification_notes?: string;
  reviewer_id?: string;
  reviewed_at?: string;
}

export interface FindingSubmitDTO {
  system_match_status: MatchStatus;
  regulatory_decision: RegulatoryDecision;
  justification_notes?: string;
  matched_napams_id?: string;
}

export interface FindingWithDetails extends ObservationFinding {
  observation: Observation;
  napams_approval?: NapamsApproval;
}

export interface ExcelImport extends BaseEntity {
  uploaded_by_id: string;
  filename: string;
  status: 'PENDING' | 'MAPPED' | 'IMPORTING' | 'COMPLETED' | 'FAILED';
  total_rows: number;
  processed_rows: number;
  failed_rows: number;
  error_log?: string;
}

export interface ExcelImportPreview {
  headers: string[];
  preview_rows: Record<string, any>[];
  total_rows: number;
}

export interface ExcelImportError {
  row_index: number;
  error_message: string;
  raw_data: Record<string, any>;
}

export interface ColumnMapping {
  excel_column: string;
  db_field: string;
}

export interface NapamsSyncJob extends BaseEntity {
  started_at: string;
  completed_at?: string;
  status: SyncStatus;
  records_processed: number;
  records_added: number;
  records_updated: number;
  error_log?: string;
}

export interface NapamsSyncStatus {
  last_sync_job?: NapamsSyncJob;
  is_syncing: boolean;
}

export interface AuditLogEntry extends BaseEntity {
  user_id?: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  old_values?: Record<string, any>;
  new_values?: Record<string, any>;
  ip_address?: string;
}

export interface Notification extends BaseEntity {
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  is_read: boolean;
  reference_id?: string;
  reference_type?: string;
}

export interface DashboardMetrics {
  total_observations: number;
  pending_reviews: number;
  confirmed_non_compliant: number;
  recent_escalations: number;
}

export interface ReportFilters {
  date_from?: string;
  date_to?: string;
  officer_id?: string;
  medium?: MediumType;
  source?: ObservationSource;
  finding_status?: RegulatoryDecision;
  product?: string;
  manufacturer?: string;
  location?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: ApiError;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

export interface AuthLoginRequest {
  email: string;
  password?: string;
}

export interface AuthUser extends User {
  token?: string;
}

export interface AuthLoginResponse {
  user: AuthUser;
  token: string;
}
