'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  ShieldAlert, 
  HelpCircle, 
  ArrowRight, 
  CheckCircle, 
  FileCode, 
  Zap, 
  Scale, 
  Info,
  ChevronDown,
  Sparkles,
  Search,
  Lock
} from 'lucide-react';

export default function Home() {
  const [previewType, setPreviewType] = useState<'employment' | 'rental'>('employment');

  const previewData = {
    employment: {
      type: 'Employment Agreement',
      score: 72,
      level: 'High Risk',
      verdict: '🚨 Review Carefully. The 15-day vs 90-day notice period split and the post-employment non-compete are highly unfavorable. Under Section 27 of the Indian Contract Act, 1872, the non-compete is void.',
      summary: 'This agreement hires you as a Senior Software Engineer. It contains a broad 2-year non-compete restriction across India, a long 90-day employee notice period, and claims ownership of all personal side projects developed during your tenure.',
      clauses: [
        { name: 'Non-Compete', original: 'Employee shall not engage with any competitor in India for 24 months post-employment...', plain: 'You cannot work for any other tech company in India for 2 years after leaving.', rating: 'High', law: 'Sec. 27 Indian Contract Act' },
        { name: 'Notice Period', original: 'Employer may terminate with 15 days notice. Employee must give 90 days notice...', plain: 'They can fire you with 15 days notice, but you must serve 90 days to quit.', rating: 'High', law: 'Industrial Employment Act' }
      ]
    },
    rental: {
      type: 'Rental Agreement',
      score: 58,
      level: 'Review Carefully',
      verdict: '⚠ Review Carefully. The agreement has moderate risks due to the early forfeiture of the security deposit during the 6-month lock-in period and lack of structural repair definitions.',
      summary: 'An 11-month residential lease for a flat in Mumbai. It includes a 10% renewal rent escalation, an 18% annual late fee on rent, and states that the tenant must forfeit their entire security deposit if they vacate before 6 months.',
      clauses: [
        { name: 'Deposit Forfeiture', original: 'If licensee vacates before 6 months, the entire security deposit of INR 1,80,000 stands forfeited...', plain: 'If you leave in the first 6 months, the landlord keeps your entire deposit as a fine.', rating: 'High', law: 'Sec. 74 Indian Contract Act' },
        { name: 'Late Fee Interest', original: 'Delay in rent payment shall attract interest at the rate of 18% per annum...', plain: 'Being late on rent costs you 18% interest per year calculated daily.', rating: 'Medium', law: 'Usurious Loans Act' }
      ]
    }
  };

  const currentPreview = previewData[previewType];

  return (
    <div className="relative w-full overflow-hidden bg-glow-radial min-h-screen flex flex-col">
      {/* Background Decorative Blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl -z-10" />
      <div className="absolute top-10 right-10 w-[300px] h-[300px] bg-sky-500/5 rounded-full blur-3xl -z-10" />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 text-center flex flex-col items-center">
        {/* Launch Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-xs font-semibold text-indigo-300 mb-6 animate-pulse-slow">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Intelligent Contract Analysis for Indian Law</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl leading-tight">
          Know What You're Signing <br />
          <span className="bg-gradient-to-r from-indigo-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
            Before It's Too Late.
          </span>
        </h1>

        {/* Subheadline */}
        <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl leading-relaxed">
          Upload any agreement and get an AI-powered breakdown of risks, obligations, important clauses, missing protections, and negotiation recommendations.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
          <Link
            href="/analyze"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-white font-bold text-base shadow-xl shadow-indigo-600/30 transition-all hover:scale-[1.02] flex items-center justify-center gap-2 group cursor-pointer"
          >
            Analyze Agreement
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href="#demo"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 font-semibold text-base transition-all hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer"
          >
            View Demo
          </a>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-900">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-white">Full-Stack Intelligence For Non-Lawyers</h2>
          <p className="mt-4 text-slate-400 text-sm sm:text-base">
            NovaLens helps you navigate complex legal agreements without expensive consultation. Keep track of what you agree to.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="glass-panel glass-panel-hover p-6 rounded-2xl flex flex-col gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
              <ShieldAlert className="w-6 h-6 text-indigo-400" />
            </div>
            <h3 className="text-lg font-bold text-white">AI Risk Meter</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Instantly assesses contract liability percentages and provides clear color-coded indicators based on unfair termination, excessive fines, and regulatory liabilities.
            </p>
          </div>

          {/* Card 2 */}
          <div className="glass-panel glass-panel-hover p-6 rounded-2xl flex flex-col gap-4">
            <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
              <Scale className="w-6 h-6 text-sky-400" />
            </div>
            <h3 className="text-lg font-bold text-white">Indian Law Guardrails</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Every analyzed clause is referenced against relevant articles and acts like the Indian Contract Act, 1872, alerting you to illegal or unenforceable terms in India.
            </p>
          </div>

          {/* Card 3 */}
          <div className="glass-panel glass-panel-hover p-6 rounded-2xl flex flex-col gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <FileCode className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-lg font-bold text-white">OCR Document Scanning</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Supports scanned PDFs, agreements, and images (PNG, JPG). Extracts text using local client-side OCR workers for swift, secure scanning without data leaks.
            </p>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-900">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-white">Simple 4-Step Analysis</h2>
          <p className="mt-4 text-slate-400">Our seamless workflow brings transparency to any contract within seconds.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-8 relative">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="w-14 h-14 rounded-full bg-slate-900 border border-slate-800 text-indigo-400 font-bold text-lg flex items-center justify-center relative">
              1
              <span className="hidden sm:block absolute top-7 left-14 w-20 border-t border-dashed border-slate-800 -z-10" />
            </div>
            <h3 className="text-base font-bold text-white">Upload Document</h3>
            <p className="text-xs text-slate-400">Drag & drop your PDF, DOCX, or contract image.</p>
          </div>

          <div className="flex flex-col items-center text-center gap-4">
            <div className="w-14 h-14 rounded-full bg-slate-900 border border-slate-800 text-indigo-400 font-bold text-lg flex items-center justify-center relative">
              2
              <span className="hidden sm:block absolute top-7 left-14 w-20 border-t border-dashed border-slate-800 -z-10" />
            </div>
            <h3 className="text-base font-bold text-white">Select Type</h3>
            <p className="text-xs text-slate-400">Choose the agreement category (Employment, Rental, etc.).</p>
          </div>

          <div className="flex flex-col items-center text-center gap-4">
            <div className="w-14 h-14 rounded-full bg-slate-900 border border-slate-800 text-indigo-400 font-bold text-lg flex items-center justify-center relative">
              3
              <span className="hidden sm:block absolute top-7 left-14 w-20 border-t border-dashed border-slate-800 -z-10" />
            </div>
            <h3 className="text-base font-bold text-white">AI Assessment</h3>
            <p className="text-xs text-slate-400">The engine parses clauses and evaluates legality in India.</p>
          </div>

          <div className="flex flex-col items-center text-center gap-4">
            <div className="w-14 h-14 rounded-full bg-slate-900 border border-slate-800 text-indigo-400 font-bold text-lg flex items-center justify-center">
              4
            </div>
            <h3 className="text-base font-bold text-white">Interactive Report</h3>
            <p className="text-xs text-slate-400">Get summaries, risk meters, and negotiation scripts.</p>
          </div>
        </div>
      </section>

      {/* Interactive Sample Analysis Preview */}
      <section id="demo" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-900">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-white">Interactive Sample Analysis Preview</h2>
          <p className="mt-4 text-slate-400">See how NovaLens breaks down contracts in real time. Switch below to see different contract structures.</p>
        </div>

        {/* Toggle buttons */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setPreviewType('employment')}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all border cursor-pointer ${
              previewType === 'employment'
                ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Employment Agreement Preview
          </button>
          <button
            onClick={() => setPreviewType('rental')}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all border cursor-pointer ${
              previewType === 'rental'
                ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Rental Agreement Preview
          </button>
        </div>

        {/* Mock Report Card */}
        <div className="glass-panel rounded-2xl border border-slate-800/80 p-6 md:p-8 max-w-4xl mx-auto flex flex-col gap-6 shadow-2xl relative">
          <div className="absolute top-0 right-10 -translate-y-1/2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[10px] text-slate-400 flex items-center gap-1">
            <Lock className="w-3 h-3 text-indigo-400" />
            Interactive Mockups
          </div>

          {/* Top Panel */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-6">
            <div className="flex flex-col gap-1">
              <span className="text-xs uppercase font-bold text-indigo-400 tracking-wider">Analysis Snapshot</span>
              <h3 className="text-xl font-bold text-white">{currentPreview.type}</h3>
            </div>
            
            {/* Risk Gauge Block */}
            <div className="flex items-center gap-4">
              <div className="flex flex-col text-right">
                <span className="text-xs text-slate-400">Risk Assessment</span>
                <span className={`text-base font-extrabold ${
                  currentPreview.score > 70 ? 'text-rose-500' : 'text-amber-500'
                }`}>{currentPreview.score}% - {currentPreview.level}</span>
              </div>
              <div className="relative w-12 h-12 flex items-center justify-center">
                <svg className="w-12 h-12 -rotate-90">
                  <circle cx="24" cy="24" r="20" className="stroke-slate-800 fill-none" strokeWidth="4" />
                  <circle cx="24" cy="24" r="20" className={`fill-none transition-all duration-500 ${
                    currentPreview.score > 70 ? 'stroke-rose-500' : 'stroke-amber-500'
                  }`} strokeWidth="4" strokeDasharray={`${2 * Math.PI * 20}`} strokeDashoffset={`${2 * Math.PI * 20 * (1 - currentPreview.score / 100)}`} />
                </svg>
                <span className="absolute text-[10px] font-bold text-white">{currentPreview.score}%</span>
              </div>
            </div>
          </div>

          {/* AI Verdict Banner */}
          <div className={`p-4 rounded-xl border flex items-start gap-3 ${
            currentPreview.score > 70 
              ? 'bg-rose-950/20 border-rose-900/30 text-rose-200' 
              : 'bg-amber-950/20 border-amber-900/30 text-amber-200'
          }`}>
            <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="flex flex-col gap-0.5 text-xs sm:text-sm">
              <strong className="font-bold text-white">AI Legal Verdict</strong>
              <p className="leading-relaxed mt-1 text-slate-300">{currentPreview.verdict}</p>
            </div>
          </div>

          {/* Summary Box */}
          <div className="flex flex-col gap-2">
            <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-indigo-400" />
              Layman's Plain-English Summary
            </h4>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed bg-slate-950/30 border border-slate-900 p-4 rounded-xl">
              {currentPreview.summary}
            </p>
          </div>

          {/* Clause breakdown preview */}
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-bold text-slate-200">Highlight: Critical Clauses to Review</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {currentPreview.clauses.map((clause, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 flex flex-col gap-2 justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{clause.name}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      clause.rating === 'High' 
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>{clause.rating} Risk</span>
                  </div>
                  <p className="text-[11px] text-slate-500 italic truncate">"{clause.original}"</p>
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">{clause.plain}</p>
                  <div className="border-t border-slate-800/80 pt-2 text-[10px] text-indigo-400 flex items-center gap-1">
                    <Scale className="w-3 h-3" />
                    {clause.law}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Callout */}
          <div className="flex justify-center mt-2">
            <Link
              href="/analyze"
              className="px-6 py-2.5 rounded-lg bg-indigo-600/10 border border-indigo-500/30 hover:bg-indigo-600 hover:text-white text-indigo-300 font-semibold text-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              Analyze Your Agreement Now
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
