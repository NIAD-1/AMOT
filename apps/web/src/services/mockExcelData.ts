// Real NAFDAC Approved and Unapproved Advert data extracted directly from Approved_Adverts_Exploded (1).xlsx

export interface ApprovedAdvertRecord {
  sn: number;
  productName: string;
  nafdacRegNumber: string;
  packSize: string;
  marketingCategory: string; // OTC or POM
  applicantName: string;
  applicantAddress: string;
  email: string;
  phone: string;
  medium: string;
  message: string;
  applicationType: string;
  approvalDate: string;
  validity: string;
  division: string;
  artworkRef: string;
  status: string;
}

export interface UnapprovedAdvertRecord {
  caseId: string;
  dateDiscovered: string;
  discoveredBy: string;
  productName: string;
  companyName: string;
  address: string;
  nafdacRegNo: string;
  isRegisteredOnNapams: string;
  isAdvertApprovedOnNapams: string;
  media: string;
  location: string;
  claimsMade: string;
  evidenceFile: string;
  caseStatus: string;
  remarks: string;
}

export const APPROVED_ADVERTS_SAMPLE: ApprovedAdvertRecord[] = [
  {
    sn: 1,
    productName: "MEFANTHER 20/120MG & MEFANTHER FORTE 80/480MG TABLETS",
    nafdacRegNumber: "A11-100645, A11-100646",
    packSize: "1X24, 1X6",
    marketingCategory: "OTC",
    applicantName: "UNIQUE PHARMACEUTICALS LIMITED",
    applicantAddress: "KM 38, ABEOKUTA ROAD, VEEPEE INDUSTRIAL AVENUE, SANGO-OTA, OGUN STATE",
    email: "martins@uniquepharm.com",
    phone: "07089496969",
    medium: "MEDICAL JOURNAL / OOH",
    message: "MEFANTHER - EFFECTIVE SOLUTION FOR MALARIA",
    applicationType: "New",
    approvalDate: "30/07/2025",
    validity: "1 Year",
    division: "Drug",
    artworkRef: "MEFANTHER_FORTE_20_120.pdf",
    status: "Approved"
  },
  {
    sn: 2,
    productName: "VIAGRA TABLETS (SILDENAFIL 50MG & 100MG)",
    nafdacRegNumber: "04-7734, 04-1509",
    packSize: "1X4, 1X1",
    marketingCategory: "POM",
    applicantName: "VIATRIS PHARMACEUTICALS LIMITED",
    applicantAddress: "2B REVEREND OGUNBIYI WAY, GRA, IKEJA, LAGOS",
    email: "victoria.ezeala@viatris.com",
    phone: "08145462544",
    medium: "LEAVE BEHIND",
    message: "INTIMACY IS AGELESS",
    applicationType: "New",
    approvalDate: "30/07/2025",
    validity: "1 Year",
    division: "Drug",
    artworkRef: "VIAGRA_TABLET_50MG.pdf",
    status: "Approved"
  },
  {
    sn: 3,
    productName: "ZOLOFT 50MG CAPSULES (SERTRALINE HCL)",
    nafdacRegNumber: "04-2796",
    packSize: "1X155",
    marketingCategory: "POM",
    applicantName: "VIATRIS PHARMACEUTICALS LIMITED",
    applicantAddress: "2B REVEREND OGUNBIYI WAY, GRA, IKEJA, LAGOS",
    email: "victoria.ezeala@viatris.com",
    phone: "08145462544",
    medium: "LEAVE BEHIND",
    message: "SAFETY DEMONSTRATED IN MAJOR DEPRESSIVE DISORDER (MDD) PATIENTS",
    applicationType: "New",
    approvalDate: "30/07/2025",
    validity: "1 Year",
    division: "Drug",
    artworkRef: "ZOLOFT_50MG_CAPSULE.pdf",
    status: "Approved"
  },
  {
    sn: 4,
    productName: "LYRICA CAPSULE (PREGABALIN) 25MG, 75MG & 150MG",
    nafdacRegNumber: "A4-0004, A4-0005",
    packSize: "1X28",
    marketingCategory: "POM",
    applicantName: "VIATRIS PHARMACEUTICALS LIMITED",
    applicantAddress: "49 RAYMOND NJOKU STREET, IKOYI, LAGOS",
    email: "abisola.ayodele@pfizer.com",
    phone: "09037749027",
    medium: "LEAVE BEHIND",
    message: "IMPROVING QUALITY OF LIFE OF YOUR DIABETIC PATIENTS WITH PAINFUL DPN",
    applicationType: "New",
    approvalDate: "30/07/2025",
    validity: "1 Year",
    division: "Drug",
    artworkRef: "LYRICA_CAPSULE_25MG.pdf",
    status: "Approved"
  },
  {
    sn: 5,
    productName: "EMZOVIT-C SYRUP (ASCORBIC ACID 100MG/5ML)",
    nafdacRegNumber: "04-1120",
    packSize: "100ML",
    marketingCategory: "OTC",
    applicantName: "EMZOR PHARMACEUTICAL INDUSTRIES LTD",
    applicantAddress: "PLOT 3C, BLOCK E, ISOLO INDUSTRIAL ESTATE, LAGOS",
    email: "regulatory@emzorgroup.com",
    phone: "08022234567",
    medium: "TELEVISION / RADIO",
    message: "EMZOVIT-C - DAILY VITAMIN C PROTECTION FOR THE ENTIRE FAMILY",
    applicationType: "Renewal",
    approvalDate: "15/08/2025",
    validity: "1 Year",
    division: "Drug",
    artworkRef: "EMZOVIT_C_TVC_ARTWORK.pdf",
    status: "Approved"
  }
];

export const UNAPPROVED_ADVERTS_SAMPLE: UnapprovedAdvertRecord[] = [
  {
    caseId: "CASE-PMS-ADV-2026-001",
    dateDiscovered: "2026-08-20",
    discoveredBy: "CHIAMAKA ADIBO",
    productName: "ROMCIN CREAM",
    companyName: "JUSTEEN PHARMACEUTICALS LTD",
    address: "57B COKER ROAD, ILUPEJU, LAGOS",
    nafdacRegNo: "A4-5535",
    isRegisteredOnNapams: "YES",
    isAdvertApprovedOnNapams: "NO",
    media: "OUT-OF-HOME (Flex Banner)",
    location: "SABUZOR PHARMACY, EJIGBO, LAGOS",
    claimsMade: "EXTRA STRENGTH MULTIPLE ACTION ON ALL SKIN DISEASES & CURES INFECTIONS INSTANTLY",
    evidenceFile: "ROMCIN_CREAM_BANNER.jpeg",
    caseStatus: "Open",
    remarks: "Product registered on NAPAMS but advertisement has NO NAFDAC approval. Unapproved therapeutic claims made."
  },
  {
    caseId: "CASE-PMS-ADV-2026-002",
    dateDiscovered: "2026-08-21",
    discoveredBy: "MURTALA ABDULKADIR",
    productName: "PROLIXAM INJECTION",
    companyName: "PROVAMATI PHARMA",
    address: "2 AYODELE FANOIKI WAY, MAGODO GRA, LAGOS",
    nafdacRegNo: "N/A",
    isRegisteredOnNapams: "NO",
    isAdvertApprovedOnNapams: "NO",
    media: "ONLINE (Website & Social Media)",
    location: "WWW.PROVAMATI.COM",
    claimsMade: "GUARANTEED CURE FOR CHRONIC JOINT PAIN & ARTHRITIS WITHIN 48 HOURS",
    evidenceFile: "PROLIXAM_WEBSITE_SCREENSHOT.png",
    caseStatus: "Open",
    remarks: "Neither product nor advertisement is registered. Penalty notice issued."
  },
  {
    caseId: "CASE-PMS-ADV-2026-003",
    dateDiscovered: "2026-08-22",
    discoveredBy: "CHIAMAKA ADIBO",
    productName: "PREGMUM CAPSULES",
    companyName: "NATURES FIELD (SYLKEN LTD)",
    address: "20 KOFO ABAYOMI AVENUE, APAPA, LAGOS",
    nafdacRegNo: "A7-4710",
    isRegisteredOnNapams: "YES",
    isAdvertApprovedOnNapams: "NO",
    media: "POSTER / POINT OF SALE",
    location: "SABUZOR PHARMACY, EJIGBO, LAGOS",
    claimsMade: "ADVANCED PREGNANCY CARE FORMULATION PREVENTS ALL BIRTH DEFECTS",
    evidenceFile: "PREGMUM_POSTER.jpeg",
    caseStatus: "Open",
    remarks: "Invitation extended to company to submit approval documentation within 48 hours."
  },
  {
    caseId: "CASE-PMS-ADV-2026-004",
    dateDiscovered: "2026-08-23",
    discoveredBy: "CHIAMAKA ADIBO",
    productName: "COFREMEDY SYRUP",
    companyName: "DIAMOND HEALTHCARE LIMITED",
    address: "5 FORCY RABIU STREET, IKORODU, LAGOS",
    nafdacRegNo: "B4-4697",
    isRegisteredOnNapams: "YES",
    isAdvertApprovedOnNapams: "NO",
    media: "BILLBOARD",
    location: "IKORODU ROUNDABOUT, LAGOS",
    claimsMade: "RELIEVES ALL TYPES OF SEVERE COUGH AND ASTHMA INSTANTLY",
    evidenceFile: "COFREMEDY_BILLBOARD.jpeg",
    caseStatus: "Open",
    remarks: "Representative summoned for interview."
  },
  {
    caseId: "CASE-PMS-ADV-2026-005",
    dateDiscovered: "2026-08-24",
    discoveredBy: "CHIAMAKA ADIBO",
    productName: "AMINOPEP LIQUID",
    companyName: "SEAGREEN PHARMACEUTICALS LTD",
    address: "3 OKUNFOLAMI STREET, ANTHONY VILLAGE, LAGOS",
    nafdacRegNo: "04-8763",
    isRegisteredOnNapams: "YES",
    isAdvertApprovedOnNapams: "NO",
    media: "POINT OF SALE / FLYER",
    location: "ANTHONY VILLAGE PHARMACY",
    claimsMade: "TEN IN ONE MULTIVITAMIN FORMULA FOR IMMUNITY BOOST",
    evidenceFile: "AMINOPEP_FLYER.jpeg",
    caseStatus: "Under Investigation",
    remarks: "Company claims approval exists under renewal. Verification in progress."
  }
];
