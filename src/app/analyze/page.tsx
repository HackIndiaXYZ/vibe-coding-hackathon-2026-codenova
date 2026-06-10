'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Upload, 
  FileText, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  ChevronRight, 
  Scale, 
  FileCode,
  FileSearch
} from 'lucide-react';
import { performOCR } from '../../lib/ocr';
import { supabase, isLiveMode } from '../../lib/supabase';
import { mockAgreements } from '../../lib/mockData';

const AGREEMENT_TYPES = [
  'Employment Agreement',
  'Internship Agreement',
  'Rental Agreement',
  'Lease Agreement',
  'Loan Agreement',
  'Insurance Policy',
  'Divorce Agreement',
  'Partnership Agreement',
  'NDA',
  'Freelance Contract',
  'Vendor Agreement',
  'Service Agreement',
  'Purchase Agreement',
  'Business Contract',
  'Other'
];

const LOADING_QUOTES = [
  "Reading the fine print in detail...",
  "Auditing terms under the Indian Contract Act, 1872...",
  "Verifying dispute resolution and arbitration seats...",
  "Searching for hidden indemnity and liability traps...",
  "Checking compliance with state-specific rent acts...",
  "Analyzing IP assignment clauses under Copyright Act, 1957...",
  "Cross-referencing notice periods against industry standards...",
  "Flagging missing protective clauses and liability caps..."
];

export default function AnalyzePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // States
  const [file, setFile] = useState<File | null>(null);
  const [agreementType, setAgreementType] = useState<string>('Employment Agreement');
  const [customType, setCustomType] = useState<string>('');
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Status states
  const [status, setStatus] = useState<'idle' | 'ocr' | 'analyzing' | 'success'>('idle');
  const [ocrProgress, setOcrProgress] = useState<number>(0);
  const [loadingQuoteIndex, setLoadingQuoteIndex] = useState<number>(0);

  // Rotate loading quotes
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (status === 'analyzing' || status === 'ocr') {
      interval = setInterval(() => {
        setLoadingQuoteIndex((prev) => (prev + 1) % LOADING_QUOTES.length);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [status]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateFile = (selectedFile: File): boolean => {
    const validExtensions = ['.pdf', '.docx', '.png', '.jpg', '.jpeg'];
    const fileName = selectedFile.name.toLowerCase();
    const isValid = validExtensions.some(ext => fileName.endsWith(ext));
    
    if (!isValid) {
      setError("Unsupported file format. Please upload a PDF, DOCX, or Image (PNG, JPG).");
      return false;
    }
    
    // Capped at 15MB
    if (selectedFile.size > 15 * 1024 * 1024) {
      setError("File size exceeds 15MB limit. Please upload a smaller document.");
      return false;
    }

    setError(null);
    return true;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (validateFile(droppedFile)) {
        setFile(droppedFile);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (validateFile(selectedFile)) {
        setFile(selectedFile);
      }
    }
  };

  const handleTriggerPreset = async (presetKey: string) => {
    setError(null);
    setStatus('analyzing');
    
    try {
      const presetData = mockAgreements[presetKey];
      if (!presetData) {
        throw new Error(`Preset data not found for ${presetKey}`);
      }

      // Generate a mock saved record
      const savedRecord = {
        id: 'ag_' + Math.random().toString(36).substring(2, 11),
        name: presetKey === 'Employment Agreement' ? 'Zenith Tech Offer Letter.pdf' :
              presetKey === 'Rental Agreement' ? 'Mumbai BHK Rent Deed.pdf' :
              presetKey === 'Freelance Contract' ? 'Chennai Developer Contract.docx' :
              presetKey === 'Internship Agreement' ? 'Vikas AI Internship Offer.pdf' :
              presetKey === 'Divorce Agreement' ? 'Verma Divorce Mutual Settlement.pdf' :
              presetKey === 'Chennai Rental Agreement' ? 'Chennai Rent Deed (Manoj v Thanikaimalai).txt' :
              `${presetKey} Document.pdf`,
        type: presetKey === 'Chennai Rental Agreement' ? 'Rental Agreement' : presetKey,
        riskScore: presetData.riskPercentage,
        risk_score: presetData.riskPercentage,
        riskLevel: presetData.riskLevel,
        risk_level: presetData.riskLevel,
        analysisJson: presetData,
        analysis_json: presetData,
        createdAt: new Date().toISOString(),
        created_at: new Date().toISOString()
      };

      // Write to mock client (will write to localStorage)
      await supabase.from('agreements').insert(savedRecord);

      // Trigger Confetti
      if (typeof window !== 'undefined') {
        const confetti = await import('canvas-confetti');
        confetti.default({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 }
        });
      }

      setStatus('success');
      router.push(`/reports/${savedRecord.id}`);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred during preset trigger.");
      setStatus('idle');
    }
  };

  const handleStartAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please upload a contract file first.");
      return;
    }

    setError(null);
    const selectedCategory = agreementType === 'Other' ? customType : agreementType;
    if (agreementType === 'Other' && !customType.trim()) {
      setError("Please specify the custom agreement type.");
      return;
    }

    try {
      let extractedText = "";
      const fileLower = file.name.toLowerCase();
      const isImage = fileLower.endsWith('.png') || fileLower.endsWith('.jpg') || fileLower.endsWith('.jpeg');

      if (isImage) {
        setStatus('ocr');
        setOcrProgress(0);
        extractedText = await performOCR(file, (pct) => setOcrProgress(pct));
      }

      setStatus('analyzing');
      
      // Call Next.js API Route for parsing (PDF/DOCX) or processing extracted OCR text
      const formData = new FormData();
      formData.append('agreementType', selectedCategory);
      
      if (isImage) {
        formData.append('text', extractedText);
        formData.append('fileName', file.name);
      } else {
        formData.append('file', file);
      }

      const res = await fetch('/api/analyze', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        let errorMsg = "Failed to analyze document.";
        try {
          const errJson = await res.json();
          errorMsg = errJson.error || errorMsg;
        } catch {
          try {
            const errText = await res.text();
            errorMsg = errText || errorMsg;
          } catch {}
        }
        throw new Error(errorMsg);
      }

      const report = await res.json();

      if (!isLiveMode) {
        await supabase.from('agreements').insert(report);
      }

      // Trigger Confetti

      if (typeof window !== 'undefined') {
        import('canvas-confetti').then((confetti) => {
          confetti.default({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.6 }
          });
        });
      }

      setStatus('success');
      router.push(`/reports/${report.id}`);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred during analysis.");
      setStatus('idle');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 flex flex-col justify-center w-full">
      {status === 'ocr' || status === 'analyzing' ? (
        /* SKELETON / LOADING SCREEN */
        <div className="glass-panel rounded-2xl border border-slate-800 p-8 text-center flex flex-col items-center justify-center min-h-[400px] animate-pulse-slow">
          <div className="relative w-20 h-20 mb-8 flex items-center justify-center">
            <div className="absolute inset-0 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
            <FileSearch className="w-8 h-8 text-indigo-400 animate-bounce" />
          </div>
          
          <h3 className="text-2xl font-bold text-white mb-2">
            {status === 'ocr' ? `Performing OCR Text Extraction... (${ocrProgress}%)` : 'AI Legal Engine Active'}
          </h3>
          <p className="text-indigo-400 font-semibold text-sm mb-6 h-6 transition-all duration-500">
            {LOADING_QUOTES[loadingQuoteIndex]}
          </p>

          <div className="w-64 bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-800">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-sky-500 h-full transition-all duration-300"
              style={{ width: status === 'ocr' ? `${ocrProgress}%` : '80%' }}
            />
          </div>
          <span className="text-xs text-slate-500 mt-4 leading-relaxed max-w-sm">
            Documents are evaluated against the Indian Contract Act 1872. This might take up to 15 seconds.
          </span>
        </div>
      ) : (
        /* MAIN UPLOAD & FORM LAYOUT */
        <div className="flex flex-col gap-8 animate-slide-up">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <h1 className="text-3xl font-extrabold text-white tracking-tight">Audit Legal Agreements</h1>
            </div>
            <p className="text-sm text-slate-400">
              Upload files and specify the category. The engine checks terms, liability, and missing Indian statutory protections.
            </p>
          </div>

          <form onSubmit={handleStartAnalysis} className="flex flex-col gap-6">
            {/* Agreement Type Dropdown */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col gap-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Scale className="w-4 h-4 text-indigo-400" />
                Step 1: Agreement Category
              </h2>
              
              <div className="flex flex-col gap-3">
                <label className="text-xs text-slate-400 font-medium">Select contract category</label>
                <select
                  value={agreementType}
                  onChange={(e) => setAgreementType(e.target.value)}
                  className="w-full bg-[#111827] border border-slate-800 rounded-lg p-2.5 text-slate-200 text-sm focus:border-indigo-500 focus:outline-none"
                >
                  {AGREEMENT_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {agreementType === 'Other' && (
                <div className="flex flex-col gap-2 animate-fade-in mt-2">
                  <label className="text-xs text-slate-400">Custom Agreement Name</label>
                  <input
                    type="text"
                    value={customType}
                    onChange={(e) => setCustomType(e.target.value)}
                    placeholder="e.g. Consultancy Contract, Retainership Deed"
                    className="w-full bg-[#111827] border border-slate-800 rounded-lg p-2.5 text-slate-200 text-sm focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              )}
            </div>

            {/* Drag & Drop File Container */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col gap-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <FileCode className="w-4 h-4 text-indigo-400" />
                Step 2: Upload File
              </h2>

              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`w-full py-12 px-6 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-3 transition-colors cursor-pointer ${
                  dragActive 
                    ? 'border-indigo-500 bg-indigo-500/5' 
                    : 'border-slate-800 hover:border-slate-700 bg-slate-950/20'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.docx,.png,.jpg,.jpeg"
                  className="hidden"
                />
                
                <div className="p-3 rounded-full bg-slate-900 border border-slate-800">
                  <Upload className="w-6 h-6 text-slate-400" />
                </div>

                <div className="text-center">
                  <p className="text-sm font-semibold text-slate-200">
                    {file ? file.name : "Drag & drop file here or click to browse"}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Supports PDF, DOCX, PNG, JPG, JPEG (Max 15MB)
                  </p>
                </div>

                {file && (
                  <div className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] text-indigo-300 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    File Loaded Successfully
                  </div>
                )}
              </div>
            </div>

            {/* Errors display */}
            {error && (
              <div className="p-4 rounded-xl border border-rose-950/40 bg-rose-950/15 text-rose-300 text-xs sm:text-sm flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Action */}
            <button
              type="submit"
              disabled={!file}
              className={`w-full py-4 rounded-xl font-bold text-base transition-all hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer ${
                file 
                  ? 'bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-white shadow-xl shadow-indigo-600/20' 
                  : 'bg-slate-850 text-slate-500 border border-slate-800/80 cursor-not-allowed'
              }`}
            >
              Start Intelligent Analysis
              <ChevronRight className="w-5 h-5" />
            </button>
          </form>

          {/* Sandbox Preset Quick Start */}
          {!isLiveMode && (
            <div className="glass-panel p-6 rounded-2xl border border-dashed border-indigo-500/30 bg-indigo-500/[0.02] flex flex-col gap-4 mt-4 animate-fade-in">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Judge Quick-Start (Instant Preset Evaluation)
                </h3>
              </div>
              <p className="text-xs text-slate-400">
                You are in <strong>Sandbox Mode</strong>. Test the app instantly without uploading or using API keys:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <button
                  type="button"
                  onClick={() => handleTriggerPreset('Employment Agreement')}
                  className="p-3 rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-indigo-950/20 hover:border-indigo-500/50 text-left text-xs transition-all cursor-pointer flex flex-col gap-1.5"
                >
                  <span className="font-bold text-white">Zenith Tech Offer</span>
                  <span className="text-[10px] text-indigo-400 font-semibold">Employment Agreement</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleTriggerPreset('Rental Agreement')}
                  className="p-3 rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-indigo-950/20 hover:border-indigo-500/50 text-left text-xs transition-all cursor-pointer flex flex-col gap-1.5"
                >
                  <span className="font-bold text-white">Mumbai Rent Deed</span>
                  <span className="text-[10px] text-indigo-400 font-semibold">Rental Agreement</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleTriggerPreset('Chennai Rental Agreement')}
                  className="p-3 rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-indigo-950/20 hover:border-indigo-500/50 text-left text-xs transition-all cursor-pointer flex flex-col gap-1.5"
                >
                  <span className="font-bold text-white">Chennai Rent Deed</span>
                  <span className="text-[10px] text-indigo-400 font-semibold">Manoj v Thanikaimalai</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleTriggerPreset('Freelance Contract')}
                  className="p-3 rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-indigo-950/20 hover:border-indigo-500/50 text-left text-xs transition-all cursor-pointer flex flex-col gap-1.5"
                >
                  <span className="font-bold text-white">Chennai Dev Contract</span>
                  <span className="text-[10px] text-indigo-400 font-semibold">Freelance Contract</span>
                </button>
              </div>
            </div>
          )}

        </div>

      )}
    </div>
  );
}
