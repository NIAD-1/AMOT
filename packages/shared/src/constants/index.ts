export enum UserRole {
  FIELD_OFFICER = 'FIELD_OFFICER',
  ADVERT_TEAM = 'ADVERT_TEAM',
  SUPERVISOR = 'SUPERVISOR',
  ADMINISTRATOR = 'ADMINISTRATOR',
  INTEGRATION_SERVICE = 'INTEGRATION_SERVICE'
}

export enum ObservationSource {
  SPONTANEOUS = 'SPONTANEOUS',
  SCHEDULED = 'SCHEDULED',
  TEAM_ALERT = 'TEAM_ALERT'
}

export enum MediumType {
  BILLBOARD_OOH = 'BILLBOARD_OOH',
  POSTER_FLYER = 'POSTER_FLYER',
  PRINT_NEWSPAPER = 'PRINT_NEWSPAPER',
  PRINT_MAGAZINE = 'PRINT_MAGAZINE',
  TELEVISION = 'TELEVISION',
  RADIO = 'RADIO',
  SOCIAL_MEDIA = 'SOCIAL_MEDIA',
  WEBSITE_ECOMMERCE = 'WEBSITE_ECOMMERCE',
  POINT_OF_SALE = 'POINT_OF_SALE',
  TRANSIT = 'TRANSIT',
  OTHER = 'OTHER'
}

export enum MatchStatus {
  MATCH_FOUND = 'MATCH_FOUND',
  POTENTIAL_MATCH = 'POTENTIAL_MATCH',
  NO_MATCH_FOUND = 'NO_MATCH_FOUND',
  CONTENT_DIFFERENCE = 'CONTENT_DIFFERENCE',
  ARTWORK_DIFFERENCE = 'ARTWORK_DIFFERENCE',
  MEDIUM_DIFFERENCE = 'MEDIUM_DIFFERENCE',
  EXPIRED_APPROVAL = 'EXPIRED_APPROVAL',
  POTENTIAL_NON_COMPLIANCE = 'POTENTIAL_NON_COMPLIANCE',
  INCONCLUSIVE = 'INCONCLUSIVE'
}

export enum RegulatoryDecision {
  PENDING_REVIEW = 'PENDING_REVIEW',
  CONFIRMED_COMPLIANT = 'CONFIRMED_COMPLIANT',
  CONFIRMED_NON_COMPLIANT = 'CONFIRMED_NON_COMPLIANT',
  REQUIRES_FURTHER_REVIEW = 'REQUIRES_FURTHER_REVIEW',
  INCONCLUSIVE = 'INCONCLUSIVE'
}

export enum EscalationStatus {
  NOT_ESCALATED = 'NOT_ESCALATED',
  ESCALATED_TO_SUPERVISOR = 'ESCALATED_TO_SUPERVISOR',
  UNDER_ENFORCEMENT_REVIEW = 'UNDER_ENFORCEMENT_REVIEW',
  RESOLVED = 'RESOLVED'
}

export enum SyncStatus {
  IDLE = 'IDLE',
  RUNNING = 'RUNNING',
  SUCCESS = 'SUCCESS',
  PARTIAL_FAILURE = 'PARTIAL_FAILURE',
  FAILED = 'FAILED'
}

export enum ScheduleStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  OVERDUE = 'OVERDUE'
}

export enum AlertPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

export enum NotificationType {
  NEW_ASSIGNMENT = 'NEW_ASSIGNMENT',
  NEW_ALERT = 'NEW_ALERT',
  REMINDER = 'REMINDER',
  OVERDUE = 'OVERDUE',
  REVIEW_REQUIRED = 'REVIEW_REQUIRED',
  ESCALATION = 'ESCALATION'
}

export const AuditAction = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  EXPORT: 'EXPORT',
  IMPORT: 'IMPORT',
  ESCALATE: 'ESCALATE',
  SYNC: 'SYNC',
  REVIEW: 'REVIEW',
} as const;

export type AuditActionType = typeof AuditAction[keyof typeof AuditAction];

export const MEDIUM_LABELS: Record<MediumType, string> = {
  [MediumType.BILLBOARD_OOH]: 'Billboard / Out-of-Home',
  [MediumType.POSTER_FLYER]: 'Poster / Flyer',
  [MediumType.PRINT_NEWSPAPER]: 'Print (Newspaper)',
  [MediumType.PRINT_MAGAZINE]: 'Print (Magazine)',
  [MediumType.TELEVISION]: 'Television',
  [MediumType.RADIO]: 'Radio',
  [MediumType.SOCIAL_MEDIA]: 'Social Media',
  [MediumType.WEBSITE_ECOMMERCE]: 'Website / E-Commerce',
  [MediumType.POINT_OF_SALE]: 'Point of Sale',
  [MediumType.TRANSIT]: 'Transit',
  [MediumType.OTHER]: 'Other'
};

export const ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.FIELD_OFFICER]: 'Field Officer',
  [UserRole.ADVERT_TEAM]: 'Advert Team',
  [UserRole.SUPERVISOR]: 'Supervisor',
  [UserRole.ADMINISTRATOR]: 'Administrator',
  [UserRole.INTEGRATION_SERVICE]: 'Integration Service'
};

export const DECISION_LABELS: Record<RegulatoryDecision, string> = {
  [RegulatoryDecision.PENDING_REVIEW]: 'Pending Review',
  [RegulatoryDecision.CONFIRMED_COMPLIANT]: 'Confirmed Compliant',
  [RegulatoryDecision.CONFIRMED_NON_COMPLIANT]: 'Confirmed Non-Compliant',
  [RegulatoryDecision.REQUIRES_FURTHER_REVIEW]: 'Requires Further Review',
  [RegulatoryDecision.INCONCLUSIVE]: 'Inconclusive'
};

export const MATCH_STATUS_LABELS: Record<MatchStatus, string> = {
  [MatchStatus.MATCH_FOUND]: 'Match Found',
  [MatchStatus.POTENTIAL_MATCH]: 'Potential Match',
  [MatchStatus.NO_MATCH_FOUND]: 'No Match Found',
  [MatchStatus.CONTENT_DIFFERENCE]: 'Content Difference',
  [MatchStatus.ARTWORK_DIFFERENCE]: 'Artwork Difference',
  [MatchStatus.MEDIUM_DIFFERENCE]: 'Medium Difference',
  [MatchStatus.EXPIRED_APPROVAL]: 'Expired Approval',
  [MatchStatus.POTENTIAL_NON_COMPLIANCE]: 'Potential Non-Compliance',
  [MatchStatus.INCONCLUSIVE]: 'Inconclusive'
};

export const ESCALATION_STATUS_LABELS: Record<EscalationStatus, string> = {
  [EscalationStatus.NOT_ESCALATED]: 'Not Escalated',
  [EscalationStatus.ESCALATED_TO_SUPERVISOR]: 'Escalated to Supervisor',
  [EscalationStatus.UNDER_ENFORCEMENT_REVIEW]: 'Under Enforcement Review',
  [EscalationStatus.RESOLVED]: 'Resolved'
};
