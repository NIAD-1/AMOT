import { db } from '../index';
import * as schema from '../schema';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('Seeding database...');
  
  // Create Admin
  const adminHash = await bcrypt.hash('password', 10);
  await db.insert(schema.users).values({
    email: 'admin@amot.gov',
    passwordHash: adminHash,
    firstName: 'System',
    lastName: 'Admin',
    role: 'admin',
    isActive: true,
  }).onConflictDoNothing();

  // Create Supervisors
  const supervisorHash = await bcrypt.hash('password', 10);
  for (let i = 1; i <= 2; i++) {
    await db.insert(schema.users).values({
      email: `supervisor${i}@amot.gov`,
      passwordHash: supervisorHash,
      firstName: `Supervisor`,
      lastName: `${i}`,
      role: 'supervisor',
      isActive: true,
    }).onConflictDoNothing();
  }

  // Create Advert Team
  const advertHash = await bcrypt.hash('password', 10);
  for (let i = 1; i <= 3; i++) {
    await db.insert(schema.users).values({
      email: `advert${i}@amot.gov`,
      passwordHash: advertHash,
      firstName: `Advert`,
      lastName: `Team${i}`,
      role: 'advert_team',
      isActive: true,
    }).onConflictDoNothing();
  }

  // Create Field Officers
  const officerHash = await bcrypt.hash('password', 10);
  for (let i = 1; i <= 5; i++) {
    await db.insert(schema.users).values({
      email: `officer${i}@amot.gov`,
      passwordHash: officerHash,
      firstName: `Field`,
      lastName: `Officer${i}`,
      role: 'field_officer',
      isActive: true,
    }).onConflictDoNothing();
  }

  // Create Napams Approvals
  for (let i = 1; i <= 10; i++) {
    await db.insert(schema.napamsApprovals).values({
      approvalNumber: `NAP-${1000 + i}`,
      productName: `Test Product ${i}`,
      applicantCompany: `Company ${i}`,
      manufacturerName: `Mfg ${i}`,
      nafdacRegNumber: `A1-${2000 + i}`,
      approvedMedium: JSON.stringify(['TV', 'Radio']),
      approvedClaims: `Cures symptom ${i}`,
      approvalDate: new Date(),
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      rawPayload: JSON.stringify({}),
      lastSynchronizedAt: new Date(),
      lastVerifiedAt: new Date(),
    }).onConflictDoNothing();
  }

  console.log('Seeding complete.');
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
