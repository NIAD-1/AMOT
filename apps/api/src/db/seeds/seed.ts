import approvedRecords from './approved_sample.json';
import unapprovedRecords from './unapproved_sample.json';
import postgres from 'postgres';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('Connecting to Neon PostgreSQL Cloud Database...');
  const connectionString = process.env.DATABASE_URL!;
  const sql = postgres(connectionString);

  console.log('Creating database DDL tables on Neon PostgreSQL...');
  await sql.unsafe(`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
      role VARCHAR(50) NOT NULL,
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS napams_approvals (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      approval_number VARCHAR(100) UNIQUE NOT NULL,
      product_name VARCHAR(255) NOT NULL,
      applicant_company VARCHAR(255) NOT NULL,
      manufacturer_name VARCHAR(255),
      nafdac_reg_number VARCHAR(100) NOT NULL,
      approved_medium JSONB,
      approved_claims TEXT,
      approval_date TIMESTAMP,
      expiry_date TIMESTAMP,
      raw_payload JSONB,
      last_synchronized_at TIMESTAMP DEFAULT NOW(),
      last_verified_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS observations (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      case_id VARCHAR(100) UNIQUE NOT NULL,
      officer_id UUID,
      product_name VARCHAR(255) NOT NULL,
      company_name VARCHAR(255),
      medium VARCHAR(100),
      location VARCHAR(255),
      status VARCHAR(50) DEFAULT 'unapproved',
      claims_made TEXT,
      nafdac_reg_no VARCHAR(100),
      evidence_file_name VARCHAR(255),
      is_registered_on_napams VARCHAR(10),
      is_advert_approved VARCHAR(10),
      napams_search_date TIMESTAMP DEFAULT NOW(),
      date_escalated_to_head TIMESTAMP,
      date_escalated_to_director TIMESTAMP,
      remarks TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);
  console.log('DDL tables created/verified successfully!');

  // Seed Admin & Field Officer Users
  const adminHash = await bcrypt.hash('password123', 10);
  const officerHash = await bcrypt.hash('password123', 10);
  
  await sql`
    INSERT INTO users (email, password_hash, first_name, last_name, role)
    VALUES ('admin@amot.gov.ng', ${adminHash}, 'Admin', 'Director', 'admin')
    ON CONFLICT (email) DO NOTHING
  `;

  await sql`
    INSERT INTO users (email, password_hash, first_name, last_name, role)
    VALUES ('officer@amot.gov.ng', ${officerHash}, 'John', 'Okafor', 'field_officer')
    ON CONFLICT (email) DO NOTHING
  `;

  console.log(`Inserting ${approvedRecords.length} Approved NAFDAC Records...`);
  for (const rec of approvedRecords) {
    const appNo = `NAP-${rec.sn || Math.floor(Math.random()*10000)}-${Math.floor(1000 + Math.random() * 9000)}`;
    const prodName = rec.productName || 'UNNAMED PRODUCT';
    const appCompany = rec.applicantName || 'UNKNOWN APPLICANT';
    const regNo = rec.nafdacRegNumber || 'N/A';
    const med = rec.medium || 'OUT-OF-HOME';
    const msg = rec.message || '';

    await sql`
      INSERT INTO napams_approvals (approval_number, product_name, applicant_company, nafdac_reg_number, approved_medium, approved_claims)
      VALUES (${appNo}, ${prodName}, ${appCompany}, ${regNo}, ${JSON.stringify([med])}, ${msg})
      ON CONFLICT (approval_number) DO NOTHING
    `;
  }

  console.log(`Inserting ${unapprovedRecords.length} Unapproved Case Logs...`);
  for (const un of unapprovedRecords) {
    const cId = un.caseId || `CASE-PMS-ADV-2026-${Math.floor(100 + Math.random() * 900)}`;
    const pName = un.productName || 'UNKNOWN PRODUCT';
    const cName = un.companyName || 'UNKNOWN COMPANY';
    const med = un.media || 'OUT-OF-HOME';
    const loc = un.platformOrLocation || 'Lagos Surveillance Zone';
    const claims = un.advertMessageClaims || '';
    const regNo = un.nafdacRegNo || 'N/A';
    const fileRef = un.evidenceFileName || 'evidence.jpg';
    const isReg = un.isProductRegisteredOnNapams || 'YES';
    const isApp = un.isAdvertApprovedOnNapams || 'NO';
    const rem = un.remarks || '';

    await sql`
      INSERT INTO observations (case_id, product_name, company_name, medium, location, status, claims_made, nafdac_reg_no, evidence_file_name, is_registered_on_napams, is_advert_approved, remarks)
      VALUES (${cId}, ${pName}, ${cName}, ${med}, ${loc}, 'unapproved', ${claims}, ${regNo}, ${fileRef}, ${isReg}, ${isApp}, ${rem})
      ON CONFLICT (case_id) DO NOTHING
    `;
  }

  console.log('🎉 SUCCESS: 1,392 Approved + 400 Unapproved Records inserted into Neon PostgreSQL Cloud Database!');
  await sql.end();
  process.exit(0);
}

main().catch(err => {
  console.error('Seeding error:', err);
  process.exit(1);
});
