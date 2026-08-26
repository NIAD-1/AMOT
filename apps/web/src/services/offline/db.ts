import Dexie, { type EntityTable } from 'dexie';

interface PendingObservation {
  id: string;
  data: any;
  timestamp: number;
}

interface PendingEvidence {
  id: string;
  observationId: string;
  blob: Blob;
  type: string;
}

const db = new Dexie('AMOT_OfflineDB') as Dexie & {
  pendingObservations: EntityTable<PendingObservation, 'id'>;
  pendingEvidence: EntityTable<PendingEvidence, 'id'>;
};

db.version(1).stores({
  pendingObservations: 'id',
  pendingEvidence: 'id, observationId'
});

export { db };
