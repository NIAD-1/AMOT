import { z } from 'zod';
import {
  UserRole, ObservationSource, MediumType, MatchStatus, RegulatoryDecision,
  AlertPriority
} from '../constants/index.js';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).optional()
});

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).optional(),
  full_name: z.string().min(2).max(100),
  role: z.nativeEnum(UserRole),
  directorate: z.string().max(100).optional(),
  location_station: z.string().max(100).optional()
});

export const observationCreateSchema = z.object({
  source: z.nativeEnum(ObservationSource),
  medium: z.nativeEnum(MediumType),
  location_lat: z.number().min(-90).max(90).optional(),
  location_lng: z.number().min(-180).max(180).optional(),
  location_address: z.string().max(255).optional(),
  observation_date: z.string().datetime(),
  product_name: z.string().max(255).optional(),
  manufacturer_name: z.string().max(255).optional(),
  notes: z.string().max(1000).optional()
});

export const evidenceUploadUrlSchema = z.object({
  sha256: z.string().length(64),
  mimeType: z.string().min(1),
  byteLength: z.number().positive(),
  idempotencyKey: z.string().min(1)
});

export const evidenceCommitSchema = z.object({
  storageKey: z.string().min(1),
  observationId: z.string().uuid(),
  originalFilename: z.string().min(1),
  mimeType: z.string().min(1),
  fileSizeBytes: z.number().positive(),
  sha256Hash: z.string().length(64),
  metadata: z.record(z.any()).optional()
});

export const alertCreateSchema = z.object({
  title: z.string().min(1).max(255),
  product_target: z.string().max(255).optional(),
  manufacturer_target: z.string().max(255).optional(),
  description: z.string().min(1).max(1000),
  priority: z.nativeEnum(AlertPriority),
  target_channels: z.array(z.nativeEnum(MediumType)),
  target_locations: z.array(z.string()),
  start_date: z.string().datetime(),
  end_date: z.string().datetime()
});

export const findingSubmitSchema = z.object({
  system_match_status: z.nativeEnum(MatchStatus),
  regulatory_decision: z.nativeEnum(RegulatoryDecision),
  justification_notes: z.string().max(1000).optional(),
  matched_napams_id: z.string().uuid().optional()
});

export const escalateSchema = z.object({
  escalation_notes: z.string().min(1).max(1000)
});

export const importConfirmSchema = z.object({
  import_id: z.string().uuid()
});

export const reportFilterSchema = z.object({
  date_from: z.string().datetime().optional(),
  date_to: z.string().datetime().optional(),
  officer_id: z.string().uuid().optional(),
  medium: z.nativeEnum(MediumType).optional(),
  source: z.nativeEnum(ObservationSource).optional(),
  finding_status: z.nativeEnum(RegulatoryDecision).optional(),
  product: z.string().optional(),
  manufacturer: z.string().optional(),
  location: z.string().optional()
});

export const userUpdateSchema = z.object({
  full_name: z.string().min(2).max(100).optional(),
  role: z.nativeEnum(UserRole).optional(),
  is_active: z.boolean().optional(),
  directorate: z.string().max(100).optional(),
  location_station: z.string().max(100).optional()
});
