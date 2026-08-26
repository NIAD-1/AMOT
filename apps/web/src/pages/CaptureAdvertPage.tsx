import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Upload, CheckCircle2, X, Search, ShieldCheck, AlertTriangle, ArrowRight, Database, FileText, Sparkles, ExternalLink, Cloud, Download } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useGeolocation } from '../hooks/useGeolocation';
import { useAuthStore } from '../stores/auth.store';
import { OcrService, OcrResult } from '../services/ocrService';
import { DatabaseQueryService } from '../services/dbQueryService';
import { OneDriveService, OneDriveUploadResult } from '../services/oneDriveService';

export const CaptureAdvertPage: React.FC = () => {
  const navigate = useNavigate();
  // Steps: 1: Capture, 2: Real OCR & DB Query, 3: Scan Results, 4: Manual Search Fallback, 5: Form Fill, 6: Success
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);
  const [files, setFiles] = useState<File[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { latitude, longitude, requestLocation } = useGeolocation();
  const { user } = useAuthStore();

  // OCR, DB Query & OneDrive State
  const [ocrResult, setOcrResult] = useState<OcrResult | null>(null);
  const [queryMetrics, setQueryMetrics] = useState<{ hits: number; timeMs: number }>({ hits: 0, timeMs: 0 });
  const [oneDriveVaultResult, setOneDriveVaultResult] = useState<OneDriveUploadResult | null>(null);

  // Manual Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMatch, setSelectedMatch] = useState<any | null>(null);
  const [matchMode, setMatchMode] = useState<'approved' | 'unapproved' | null>(null);

  // AUTO-FILLED Telemetry
  const now = new Date();
  const currentDateStr = now.toISOString().slice(0, 10);
  const currentTimeStr = now.toTimeString().slice(0, 8);
  const officerName = `${user?.firstName || 'John'} ${user?.lastName || 'Okafor'}`;

  // FORM 1: APPROVED ADVERT FORM FIELDS
  const [approvedForm, setApprovedForm] = useState({
    channelLocation: '',
    scheduledTime: '',
    actualMonitoringTime: `${currentDateStr} ${currentTimeStr}`, // Auto-filled
    approvedClaimVerified: 'Y', // Y / N
    natureOfNonCompliance: '',
    evidenceRef: '', // Auto-filled OneDrive link
    entryBy: officerName, // Auto-filled
    dateOfEntry: currentDateStr, // Auto-filled
    remarks: ''
  });

  // FORM 2: UNAPPROVED ADVERT FORM FIELDS (19 Specified Columns)
  const [unapprovedForm, setUnapprovedForm] = useState(
    DatabaseQueryService.generatePrefilledUnapprovedForm('', officerName, '')
  );

  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  // Run Real OCR, Automated Database Query & Microsoft OneDrive Vault Upload
  const processCapturedEvidence = async (capturedFile: File) => {
    const objectUrl = URL.createObjectURL(capturedFile);
    setImagePreviewUrl(objectUrl);
    setStep(2); // Scanning & OCR Step

    // 1. Execute Real OCR Optical Character Recognition
    const result = await OcrService.extractTextFromImage(capturedFile);
    setOcrResult(result);

    // 2. Execute SQL Database Query over 1,392 Approved Records
    const dbResult = DatabaseQueryService.searchApprovedDatabase(result.rawText);
    setQueryMetrics({ hits: dbResult.totalHits, timeMs: dbResult.executionTimeMs });

    // 3. Upload Captured Photo directly to Microsoft OneDrive Evidence Vault
    const caseRef = `ADV-2026-${Math.floor(100 + Math.random() * 900)}`;
    const vaultUpload = await OneDriveService.uploadEvidenceToVault(capturedFile, caseRef);
    setOneDriveVaultResult(vaultUpload);

    // 4. Set Pre-filled Forms with OneDrive file references
    setApprovedForm(prev => ({ ...prev, evidenceRef: vaultUpload.fileName }));
    setUnapprovedForm(
      DatabaseQueryService.generatePrefilledUnapprovedForm(result.rawText, officerName, vaultUpload.fileName)
    );

    setStep(3); // Results Step
  };

  const handleStartCamera = async () => {
    setIsCapturing(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Camera access denied', err);
      setIsCapturing(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCapturing(false);
  };

  const handleTakePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.drawImage(videoRef.current, 0, 0);
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `capture_${Date.now()}.jpg`, { type: 'image/jpeg' });
        setFiles([file]);
        stopCamera();
        requestLocation();
        processCapturedEvidence(file);
      }
    }, 'image/jpeg');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const uploadedFiles = Array.from(e.target.files);
      setFiles(uploadedFiles);
      requestLocation();
      processCapturedEvidence(uploadedFiles[0]);
    }
  };

  // Confirm Approved Match
  const handleProceedApproved = (match: any) => {
    setSelectedMatch(match);
    setMatchMode('approved');
    setApprovedForm(prev => ({
      ...prev,
      channelLocation: match.medium,
      remarks: `Matched against NAFDAC Approved Record ${match.nafdacRegNumber}`
    }));
    setStep(5); // Form Fill Step
  };

  // Confirm Unapproved Flow
  const handleProceedUnapproved = (manualProductQuery?: string) => {
    setSelectedMatch(null);
    setMatchMode('unapproved');
    if (manualProductQuery) {
      setUnapprovedForm(prev => ({ ...prev, productName: manualProductQuery.toUpperCase() }));
    }
    setStep(5); // Form Fill Step
  };

  const handleSubmitFinalForm = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(6); // Success step
  };

  const reset = () => {
    setFiles([]);
    setSelectedMatch(null);
    setOcrResult(null);
    setOneDriveVaultResult(null);
    setMatchMode(null);
    setSearchQuery('');
    setStep(1);
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="border-b border-gray-200 pb-4 mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#1e3a5f]">
            Capture Advert
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            OCR Scanning & Microsoft OneDrive Evidence Vault Storage
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="info" className="flex items-center gap-1">
            <Cloud className="w-3 h-3" /> OneDrive Vault Synced
          </Badge>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          STEP 1: CAPTURE EVIDENCE (PHOTO / VIDEO / FILE)
         ───────────────────────────────────────────────────────────── */}
      {step === 1 && (
        <div className="space-y-6">
          {!isCapturing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button 
                onClick={handleStartCamera}
                className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border-2 border-dashed border-[#1e3a5f]/30 hover:border-[#1e3a5f] hover:bg-blue-50/50 transition-all shadow-sm group"
              >
                <div className="p-4 bg-amber-100 text-[#1e3a5f] rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                  <Camera className="w-12 h-12" strokeWidth={2} />
                </div>
                <span className="text-xl font-bold text-[#1e3a5f]">Take Photo</span>
                <span className="text-xs text-gray-500 mt-1">Live Rear Camera Stream</span>
              </button>
              
              <label className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border-2 border-dashed border-[#1e3a5f]/30 hover:border-[#1e3a5f] hover:bg-blue-50/50 transition-all shadow-sm cursor-pointer group">
                <div className="p-4 bg-blue-100 text-[#1e3a5f] rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                  <Upload className="w-12 h-12" strokeWidth={2} />
                </div>
                <span className="text-xl font-bold text-[#1e3a5f]">Upload File / Media</span>
                <span className="text-xs text-gray-500 mt-1">Image, Video, Audio or PDF</span>
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*,video/*,audio/*,.pdf" 
                  multiple
                  onChange={handleFileUpload}
                />
              </label>
            </div>
          ) : (
            <div className="relative bg-black rounded-2xl overflow-hidden aspect-[3/4] md:aspect-video flex items-center justify-center shadow-xl">
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
              <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-6">
                <button 
                  onClick={stopCamera}
                  className="p-4 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/40 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
                <button 
                  onClick={handleTakePhoto}
                  className="w-16 h-16 rounded-full border-4 border-white bg-white/50 backdrop-blur-md hover:bg-white transition-all shadow-lg"
                ></button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          STEP 2: OCR & ONEDRIVE VAULT UPLOAD IN PROGRESS
         ───────────────────────────────────────────────────────────── */}
      {step === 2 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 flex flex-col items-center justify-center text-center space-y-6">
          <div className="relative flex items-center justify-center">
            <div className="w-24 h-24 rounded-full border-4 border-amber-200 border-t-amber-500 animate-spin"></div>
            <Cloud className="w-10 h-10 text-[#1e3a5f] absolute animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#1e3a5f]">OCR Scanning & OneDrive Vault Upload...</h2>
            <p className="text-xs text-gray-500 mt-1">Saving evidence to /PMS Advert/Evidence Vault/2026...</p>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          STEP 3: AUTOMATIC OCR & SCAN RESULT SCREEN
         ───────────────────────────────────────────────────────────── */}
      {step === 3 && ocrResult && (
        <div className="space-y-6">
          {/* OneDrive Storage Vault Confirmation Banner */}
          {oneDriveVaultResult && (
            <div className="bg-blue-900 text-white p-4 rounded-xl shadow-sm flex items-center justify-between">
              <div className="flex items-center space-x-3 text-xs">
                <Cloud className="w-6 h-6 text-sky-400 flex-shrink-0" />
                <div>
                  <span className="font-bold text-sky-300 block">SAVED TO ONEDRIVE EVIDENCE VAULT</span>
                  <span className="font-mono text-[11px] text-blue-200">{oneDriveVaultResult.vaultPath}</span>
                </div>
              </div>
              <a 
                href={oneDriveVaultResult.fileUrl} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-1 text-xs bg-blue-700 hover:bg-blue-600 px-3 py-1.5 rounded-lg text-white font-semibold transition-colors"
              >
                Open OneDrive <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          {/* Extracted OCR Text Box */}
          <div className="bg-slate-900 text-white p-4 rounded-xl border border-slate-700 flex items-start space-x-3">
            <FileText className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1 text-xs">
              <span className="font-bold text-amber-400 uppercase tracking-wider block mb-1">OCR Extracted Advert Text:</span>
              <p className="font-mono bg-slate-800 p-2 rounded text-slate-200 leading-relaxed">
                "{ocrResult.rawText}"
              </p>
              {ocrResult.extractedNafdacNo && (
                <span className="inline-block mt-2 font-mono text-[11px] bg-blue-900 text-blue-200 px-2 py-0.5 rounded">
                  Detected NAFDAC Reg: {ocrResult.extractedNafdacNo}
                </span>
              )}
            </div>
          </div>

          {/* SCENARIO A: AUTO MATCH FOUND */}
          {ocrResult.matchedApproval ? (
            <div className="bg-white rounded-2xl shadow-sm border-2 border-green-400 p-6 md:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-100 text-green-700 rounded-xl">
                    <ShieldCheck className="w-8 h-8" />
                  </div>
                  <div>
                    <Badge variant="success" className="mb-1">MATCH FOUND ({ocrResult.confidenceScore}% CONFIDENCE)</Badge>
                    <h2 className="text-xl font-extrabold text-[#1e3a5f]">{ocrResult.matchedApproval.productName}</h2>
                  </div>
                </div>
                <span className="text-[11px] text-gray-400 font-mono">Query Time: {queryMetrics.timeMs}ms</span>
              </div>

              <div className="bg-green-50 p-4 rounded-xl border border-green-200 space-y-2 text-xs md:text-sm">
                <p><span className="font-semibold text-gray-700">Applicant Company:</span> {ocrResult.matchedApproval.applicantName}</p>
                <p><span className="font-semibold text-gray-700">NAFDAC Reg No:</span> <span className="font-mono font-bold">{ocrResult.matchedApproval.nafdacRegNumber}</span></p>
                <p><span className="font-semibold text-gray-700">Approved Copy/Claims:</span> "{ocrResult.matchedApproval.message}"</p>
              </div>

              <div className="pt-2 flex flex-col md:flex-row items-center justify-between gap-4">
                <button 
                  onClick={() => setStep(4)} 
                  className="text-xs text-gray-500 hover:text-gray-700 underline"
                >
                  Not the right product? Search database manually
                </button>

                <Button 
                  variant="accent" 
                  onClick={() => handleProceedApproved(ocrResult.matchedApproval)}
                  className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-3 text-sm font-bold"
                >
                  Proceed to Approved Advert Form <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ) : (
            /* SCENARIO B: NO AUTOMATIC MATCH FOUND */
            <div className="bg-white rounded-2xl shadow-sm border-2 border-amber-400 p-6 md:p-8 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-amber-100 text-amber-800 rounded-xl">
                  <AlertTriangle className="w-8 h-8" />
                </div>
                <div>
                  <Badge variant="warning" className="mb-1">NO MATCH FOUND IN APPROVED DATABASE</Badge>
                  <h2 className="text-xl font-extrabold text-[#1e3a5f]">Product Advert Not Auto-Identified</h2>
                </div>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed">
                Database query executed across 1,392 approved records in <span className="font-semibold">{queryMetrics.timeMs}ms</span>. No match found on record for the extracted text.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {/* OPTION 1: MANUAL DATABASE SEARCH */}
                <button
                  onClick={() => setStep(4)}
                  className="p-5 bg-white hover:bg-blue-50/60 border-2 border-[#1e3a5f]/30 hover:border-[#1e3a5f] rounded-xl text-left transition-all group space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#1e3a5f] text-sm group-hover:text-blue-600">Search Database Manually</span>
                    <Search className="w-5 h-5 text-[#1e3a5f]" />
                  </div>
                  <p className="text-xs text-gray-500">
                    Search 1,392 records by typing product name or NAFDAC number manually to check for approval.
                  </p>
                </button>

                {/* OPTION 2: PROCEED WITH UNAPPROVED FORM */}
                <button
                  onClick={() => handleProceedUnapproved()}
                  className="p-5 bg-white hover:bg-red-50/60 border-2 border-red-300 hover:border-red-500 rounded-xl text-left transition-all group space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-red-900 text-sm group-hover:text-red-700">Fill Unapproved Advert Form</span>
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  </div>
                  <p className="text-xs text-gray-500">
                    Open unapproved form pre-filled with Case ID, Discovered Date, Officer Name, Extracted OCR Claims & OneDrive Ref.
                  </p>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          STEP 4: MANUAL DATABASE SEARCH FALLBACK
         ───────────────────────────────────────────────────────────── */}
      {step === 4 && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#1e3a5f] flex items-center gap-2">
                <Search className="w-5 h-5 text-amber-500" /> Manual Database Search (SQL Query)
              </h2>
              <Badge variant="info">1,392 NAPAMS Records</Badge>
            </div>

            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Type Product Name (e.g. MEFANTHER, VIAGRA, ZOLOFT, LYRICA, EMZOVIT)..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#1e3a5f]"
              />
            </div>

            <div className="space-y-3 pt-2">
              {DatabaseQueryService.searchApprovedDatabase(searchQuery).results.map((item) => (
                <div 
                  key={item.sn}
                  onClick={() => handleProceedApproved(item)}
                  className="p-4 rounded-xl border border-green-200 bg-green-50/50 hover:bg-green-100/50 cursor-pointer transition-all flex items-center justify-between group"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant="success" className="text-[10px]">APPROVED</Badge>
                      <span className="font-bold text-sm text-[#1e3a5f]">{item.productName}</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">Applicant: <span className="font-semibold">{item.applicantName}</span> • NAFDAC: <span className="font-mono font-semibold">{item.nafdacRegNumber}</span></p>
                  </div>
                  <Button size="sm" variant="accent" className="flex items-center gap-1">
                    Match & Fill Form <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t flex items-center justify-between">
              <Button variant="secondary" onClick={() => setStep(3)}>Back</Button>
              <Button variant="danger" onClick={() => handleProceedUnapproved(searchQuery)}>
                Still No Match — Fill Unapproved Advert Form
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          STEP 5: FORM FILLING (APPROVED FORM vs UNAPPROVED FORM)
         ───────────────────────────────────────────────────────────── */}
      {step === 5 && (
        <div>
          {/* OPTION A: APPROVED ADVERT MONITORING FORM */}
          {matchMode === 'approved' && selectedMatch && (
            <form onSubmit={handleSubmitFinalForm} className="bg-white rounded-2xl shadow-sm border-2 border-green-400 p-6 md:p-8 space-y-6">
              <div className="bg-green-50 border border-green-200 p-4 rounded-xl flex items-start justify-between">
                <div>
                  <Badge variant="success" className="mb-1">MATCHED APPROVED ADVERT</Badge>
                  <h2 className="text-lg font-bold text-[#1e3a5f]">{selectedMatch.productName}</h2>
                  <p className="text-xs text-gray-600">Company: {selectedMatch.applicantName} • NAFDAC: {selectedMatch.nafdacRegNumber}</p>
                </div>
                <Button size="sm" variant="secondary" onClick={() => setStep(4)}>Change Match</Button>
              </div>

              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b pb-2">
                Approved Advert Monitoring Form (Excel Synced Columns)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Channel / Platform / Location *</label>
                  <input 
                    type="text" 
                    required 
                    value={approvedForm.channelLocation} 
                    onChange={e => setApprovedForm({ ...approvedForm, channelLocation: e.target.value })}
                    placeholder="e.g. Sabuzor Pharmacy Ejigbo / Instagram / Ikeja Billboard"
                    className="w-full p-2.5 border rounded-lg text-sm focus:ring-[#1e3a5f]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Scheduled / Expected Time</label>
                  <input 
                    type="text" 
                    value={approvedForm.scheduledTime} 
                    onChange={e => setApprovedForm({ ...approvedForm, scheduledTime: e.target.value })}
                    placeholder="e.g. 10:00 AM - 12:00 PM"
                    className="w-full p-2.5 border rounded-lg text-sm focus:ring-[#1e3a5f]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Actual Monitoring Time (Auto-Filled)</label>
                  <input 
                    type="text" 
                    readOnly 
                    value={approvedForm.actualMonitoringTime} 
                    className="w-full p-2.5 border bg-gray-50 text-gray-600 rounded-lg text-sm font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Approved Claim Verified (Y/N) *</label>
                  <select 
                    value={approvedForm.approvedClaimVerified} 
                    onChange={e => setApprovedForm({ ...approvedForm, approvedClaimVerified: e.target.value })}
                    className="w-full p-2.5 border rounded-lg text-sm focus:ring-[#1e3a5f]"
                  >
                    <option value="Y">Y - Verified (Matches Approved Claims)</option>
                    <option value="N">N - Unverified / Deviates from Claims</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Nature of Non-Compliance (if any)</label>
                <textarea 
                  rows={2}
                  value={approvedForm.natureOfNonCompliance} 
                  onChange={e => setApprovedForm({ ...approvedForm, natureOfNonCompliance: e.target.value })}
                  placeholder="Describe unapproved claim additions, graphic changes, expired date usage, etc..."
                  className="w-full p-2.5 border rounded-lg text-sm focus:ring-[#1e3a5f]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 mb-1">Evidence Ref. (OneDrive Vault ID)</label>
                  <input type="text" readOnly value={approvedForm.evidenceRef} className="w-full p-2 border bg-white rounded text-xs font-mono text-gray-700" />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 mb-1">Entry By (Auto-Filled)</label>
                  <input type="text" readOnly value={approvedForm.entryBy} className="w-full p-2 border bg-white rounded text-xs font-mono text-gray-700" />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 mb-1">Date of Entry (Auto-Filled)</label>
                  <input type="text" readOnly value={approvedForm.dateOfEntry} className="w-full p-2 border bg-white rounded text-xs font-mono text-gray-700" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Remarks</label>
                <textarea 
                  rows={2}
                  value={approvedForm.remarks} 
                  onChange={e => setApprovedForm({ ...approvedForm, remarks: e.target.value })}
                  placeholder="Additional officer notes..."
                  className="w-full p-2.5 border rounded-lg text-sm focus:ring-[#1e3a5f]"
                />
              </div>

              <div className="flex justify-between pt-4 border-t">
                <Button type="button" variant="secondary" onClick={() => setStep(3)}>Back</Button>
                <Button type="submit" variant="accent">Submit Approved Advert Form</Button>
              </div>
            </form>
          )}

          {/* OPTION B: UNAPPROVED ADVERT SURVEILLANCE FORM (EXACT 19 SPECIFIED FIELDS) */}
          {matchMode === 'unapproved' && (
            <form onSubmit={handleSubmitFinalForm} className="bg-white rounded-2xl shadow-sm border-2 border-red-400 p-6 md:p-8 space-y-6">
              <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex items-start justify-between">
                <div>
                  <Badge variant="danger" className="mb-1">UNAPPROVED ADVERT SURVEILLANCE FORM</Badge>
                  <h2 className="text-lg font-bold text-red-900">Adverts Found With No NAFDAC Approval on Record</h2>
                  <p className="text-xs text-red-700">OneDrive Vault Synced • Case ID: <span className="font-mono font-bold">{unapprovedForm.caseId}</span></p>
                </div>
                <Button size="sm" variant="secondary" onClick={() => setStep(4)}>Search Database</Button>
              </div>

              {/* AUTO-FILLED HEADER METADATA (Fields 1, 2, 3, 12, 17) */}
              <div className="bg-slate-50 p-4 rounded-xl border border-gray-200 grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
                <div>
                  <span className="block text-gray-500 font-semibold text-[10px] uppercase">1. CASE ID (Auto)</span>
                  <span className="font-mono font-bold text-gray-900">{unapprovedForm.caseId}</span>
                </div>
                <div>
                  <span className="block text-gray-500 font-semibold text-[10px] uppercase">2. DATE DISCOVERED</span>
                  <span className="font-mono text-gray-800">{unapprovedForm.dateDiscovered}</span>
                </div>
                <div>
                  <span className="block text-gray-500 font-semibold text-[10px] uppercase">3. DISCOVERED BY</span>
                  <span className="font-mono text-gray-800">{unapprovedForm.discoveredBy}</span>
                </div>
                <div>
                  <span className="block text-gray-500 font-semibold text-[10px] uppercase">12. SEARCH DATE</span>
                  <span className="font-mono text-gray-800">{unapprovedForm.napamsSearchDate}</span>
                </div>
                <div className="col-span-2 md:col-span-1">
                  <span className="block text-gray-500 font-semibold text-[10px] uppercase">17. ONEDRIVE FILE</span>
                  <span className="font-mono text-gray-800 truncate block">{unapprovedForm.evidenceFileName}</span>
                </div>
              </div>

              {/* PRODUCT & APPLICANT IDENTIFICATION (Fields 4 to 11) */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Product & Applicant Identification</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">4. PRODUCT NAME (AS SHOWN IN ADVERT) *</label>
                    <input 
                      type="text" 
                      required 
                      value={unapprovedForm.productName} 
                      onChange={e => setUnapprovedForm({ ...unapprovedForm, productName: e.target.value })}
                      placeholder="e.g. ROMCIN CREAM / PROLIXAM"
                      className="w-full p-2.5 border rounded-lg text-sm focus:ring-red-500 font-semibold text-[#1e3a5f]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">5. COMPANY / APPLICANT (AS SHOWN) *</label>
                    <input 
                      type="text" 
                      required 
                      value={unapprovedForm.companyName} 
                      onChange={e => setUnapprovedForm({ ...unapprovedForm, companyName: e.target.value })}
                      placeholder="e.g. JUSTEEN PHARMACEUTICALS LTD"
                      className="w-full p-2.5 border rounded-lg text-sm focus:ring-red-500"
                    />
                  </div>

                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">6. COMPANY ADDRESS</label>
                    <input 
                      type="text" 
                      value={unapprovedForm.companyAddress} 
                      onChange={e => setUnapprovedForm({ ...unapprovedForm, companyAddress: e.target.value })}
                      placeholder="Full company physical address"
                      className="w-full p-2.5 border rounded-lg text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">7. PHONE NUMBER</label>
                    <input type="text" value={unapprovedForm.phoneNumber} onChange={e => setUnapprovedForm({ ...unapprovedForm, phoneNumber: e.target.value })} className="w-full p-2.5 border rounded-lg text-sm" />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">8. EMAIL ADDRESS</label>
                    <input type="email" value={unapprovedForm.emailAddress} onChange={e => setUnapprovedForm({ ...unapprovedForm, emailAddress: e.target.value })} className="w-full p-2.5 border rounded-lg text-sm" />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">9. NAFDAC REG. NO. (IF VISIBLE)</label>
                    <input type="text" value={unapprovedForm.nafdacRegNo} onChange={e => setUnapprovedForm({ ...unapprovedForm, nafdacRegNo: e.target.value })} placeholder="e.g. A4-5535 or N/A" className="w-full p-2.5 border rounded-lg text-sm font-mono" />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">10. REGISTERED ON NAPAMS?</label>
                      <select value={unapprovedForm.isProductRegisteredOnNapams} onChange={e => setUnapprovedForm({ ...unapprovedForm, isProductRegisteredOnNapams: e.target.value })} className="w-full p-2.5 border rounded-lg text-xs">
                        <option value="YES">YES</option>
                        <option value="NO">NO</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">11. ADVERT APPROVED?</label>
                      <select value={unapprovedForm.isAdvertApprovedOnNapams} onChange={e => setUnapprovedForm({ ...unapprovedForm, isAdvertApprovedOnNapams: e.target.value })} className="w-full p-2.5 border rounded-lg text-xs">
                        <option value="NO">NO</option>
                        <option value="YES">YES</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* MEDIA & LOCATION (Fields 13 to 16) */}
              <div className="space-y-4 border-t pt-4">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Media & Location Channels</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">13. MEDIA *</label>
                    <select value={unapprovedForm.media} onChange={e => setUnapprovedForm({ ...unapprovedForm, media: e.target.value })} className="w-full p-2.5 border rounded-lg text-sm">
                      <option value="OUT-OF-HOME (Flex Banner)">OUT-OF-HOME (Flex Banner)</option>
                      <option value="ONLINE (Website)">ONLINE (Website)</option>
                      <option value="SOCIAL MEDIA (Instagram/FB)">SOCIAL MEDIA (Instagram/FB)</option>
                      <option value="POINT OF SALE / PHARMACY">POINT OF SALE / PHARMACY</option>
                      <option value="PRINT (Newspaper)">PRINT (Newspaper)</option>
                      <option value="TELEVISION / RADIO">TELEVISION / RADIO</option>
                      <option value="OTHER">OTHER</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">14. PLATFORM OR LOCATION</label>
                    <input type="text" value={unapprovedForm.platformOrLocation} onChange={e => setUnapprovedForm({ ...unapprovedForm, platformOrLocation: e.target.value })} placeholder="e.g. Sabuzor Pharmacy Ejigbo" className="w-full p-2.5 border rounded-lg text-sm" />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">15. URL / PHYSICAL ADDRESS</label>
                    <input type="text" value={unapprovedForm.urlOrPhysicalAddress} onChange={e => setUnapprovedForm({ ...unapprovedForm, urlOrPhysicalAddress: e.target.value })} placeholder="https:// or physical address" className="w-full p-2.5 border rounded-lg text-sm" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">16. ADVERT MESSAGE / CLAIMS MADE * (Pre-filled via OCR)</label>
                  <textarea rows={2} required value={unapprovedForm.advertMessageClaims} onChange={e => setUnapprovedForm({ ...unapprovedForm, advertMessageClaims: e.target.value })} placeholder="Exact text / claims made in advert (e.g. EXTRA STRENGTH MULTIPLE ACTION ON ALL SKIN)" className="w-full p-2.5 border rounded-lg text-sm font-mono bg-amber-50/50" />
                </div>
              </div>

              {/* ESCALATIONS (Fields 18 & 19) */}
              <div className="space-y-4 border-t pt-4">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Escalations Tracking</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">18. DATE ESCALATED TO HEAD</label>
                    <input type="date" value={unapprovedForm.dateEscalatedToHead} onChange={e => setUnapprovedForm({ ...unapprovedForm, dateEscalatedToHead: e.target.value })} className="w-full p-2.5 border rounded-lg text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">19. DATE ESCALATED TO DIRECTOR</label>
                    <input type="date" value={unapprovedForm.dateEscalatedToDirector} onChange={e => setUnapprovedForm({ ...unapprovedForm, dateEscalatedToDirector: e.target.value })} className="w-full p-2.5 border rounded-lg text-sm" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">REMARKS</label>
                <textarea rows={2} value={unapprovedForm.remarks} onChange={e => setUnapprovedForm({ ...unapprovedForm, remarks: e.target.value })} placeholder="Follow-up notes..." className="w-full p-2.5 border rounded-lg text-sm" />
              </div>

              <div className="flex justify-between pt-4 border-t">
                <Button type="button" variant="secondary" onClick={() => setStep(3)}>Back</Button>
                <Button type="submit" variant="danger">Submit 19-Column Unapproved Advert Log</Button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          STEP 6: SUCCESS STEP
         ───────────────────────────────────────────────────────────── */}
      {step === 6 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 flex flex-col items-center text-center">
          <CheckCircle2 className="w-20 h-20 text-green-500 mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Advert Record Submitted Successfully!</h2>
          <p className="text-sm text-gray-500 mb-4">
            {matchMode === 'approved' ? (
              <>Approved Advert Monitoring Form saved to Database. Date of Entry: <span className="font-mono font-semibold text-gray-900">{currentDateStr}</span></>
            ) : (
              <>Unapproved Advert Case Log created. Case ID: <span className="font-mono font-semibold text-gray-900">{unapprovedForm.caseId}</span></>
            )}
          </p>

          {/* Evidence Vault Card */}
          {oneDriveVaultResult && (
            <div className="w-full max-w-lg mb-8 bg-blue-50/70 border border-blue-200 rounded-2xl p-5 text-left shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-blue-200 mb-4">
                <div className="flex items-center gap-2 text-xs font-bold text-[#1e3a5f] uppercase tracking-wider">
                  <Cloud className="w-4 h-4 text-blue-600" />
                  OneDrive Evidence Vault (2026)
                </div>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-green-100 text-green-700 rounded-full border border-green-200">
                  Ready for Sync
                </span>
              </div>

              <div className="flex items-start gap-4 mb-4">
                {imagePreviewUrl ? (
                  <img 
                    src={imagePreviewUrl} 
                    alt="Captured Evidence" 
                    className="w-24 h-24 object-cover rounded-xl border border-gray-200 shadow-sm flex-shrink-0" 
                  />
                ) : (
                  <div className="w-24 h-24 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                    <Camera className="w-6 h-6" />
                  </div>
                )}

                <div className="flex-1 min-w-0 space-y-1 text-xs">
                  <div className="text-gray-500">Vault File Reference:</div>
                  <div className="font-mono font-bold text-gray-900 truncate bg-white px-2 py-1 rounded border border-gray-200">
                    {oneDriveVaultResult.fileName}
                  </div>
                  <div className="text-gray-500 pt-1">
                    Path: <span className="font-mono text-gray-700">{oneDriveVaultResult.vaultPath}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-blue-100">
                {imagePreviewUrl && (
                  <a
                    href={imagePreviewUrl}
                    download={oneDriveVaultResult.fileName}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-white hover:bg-gray-50 text-[#1e3a5f] text-xs font-semibold rounded-xl border border-gray-300 shadow-sm transition-all text-center"
                  >
                    <Download className="w-3.5 h-3.5" /> Download Evidence File
                  </a>
                )}
                <a
                  href={OneDriveService.getVaultFolderUrl()}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-[#1e3a5f] hover:bg-[#152840] text-white text-xs font-semibold rounded-xl shadow-sm transition-all text-center"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Open OneDrive Vault
                </a>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-lg">
            <Button variant="secondary" className="w-full sm:flex-1 py-3 text-sm" onClick={() => navigate('/observations')}>
              View All Logs
            </Button>
            <Button className="w-full sm:flex-1 py-3 text-sm font-semibold bg-[#1e3a5f] hover:bg-[#152840]" onClick={reset}>
              Capture & Check Another
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
