'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { 
  Scale, 
  ArrowLeft, 
  ShieldAlert, 
  CheckCircle, 
  Copy, 
  Check, 
  Calendar, 
  Users, 
  DollarSign, 
  PlusCircle, 
  MessageSquare,
  Clock,
  BookOpen,
  ArrowRight,
  ShieldAlert as AlertIcon,
  HelpCircle,
  FileText
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { SavedAgreement, AnalysisReport } from '../../../types';

export default function ReportPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  // States
  const [agreement, setAgreement] = useState<SavedAgreement | null>(null);
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'clauses' | 'obligations' | 'missing'>('overview');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  useEffect(() => {
    fetchReport();
  }, [id]);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const { data, error: fetchError } = await supabase
        .from('agreements')
        .select('*')
        .eq('id', id);

      if (fetchError) throw fetchError;

      if (data && data.length > 0) {
        const item = data[0];
        const mapped: SavedAgreement = {
          id: item.id,
          name: item.name,
          type: item.type || item.agreementType,
          riskScore: item.riskScore !== undefined ? item.riskScore : (item.risk_score || 0),
          riskLevel: item.riskLevel || item.risk_level || 'Safe',
          analysisJson: item.analysisJson || item.analysis_json,
          createdAt: item.createdAt || item.created_at
        };
        setAgreement(mapped);
        setReport(mapped.analysisJson);
      } else {
        setError("Analysis report not found.");
      }
    } catch (err: any) {
      console.error(err);
      setError("Failed to load contract report.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#030712] min-h-[500px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-slate-400 font-medium">Retrieving contract audit details...</span>
        </div>
      </div>
    );
  }

  if (error || !agreement || !report) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center flex flex-col items-center justify-center gap-6">
        <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white">Analysis Missing</h2>
        <p className="text-slate-400 text-sm leading-relaxed">
          {error || "The requested contract analysis report could not be loaded."}
        </p>
        <Link
          href="/dashboard"
          className="px-5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 font-semibold text-sm hover:bg-slate-850 transition-all flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Dashboard
        </Link>
      </div>
    );
  }

  // Styles based on risk level
  const getVerdictStyles = (risk: string) => {
    switch (risk) {
      case 'Safe':
        return {
          bg: 'bg-emerald-950/15 border-emerald-900/35 text-emerald-200',
          badge: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25',
          text: 'text-emerald-400',
          title: '✅ Safe To Sign',
          icon: <CheckCircle className="w-6 h-6 text-emerald-400" />
        };
      case 'Review Carefully':
        return {
          bg: 'bg-amber-950/15 border-amber-900/35 text-amber-200',
          badge: 'bg-amber-500/10 text-amber-400 border border-amber-500/25',
          text: 'text-amber-400',
          title: '⚠ Review Carefully',
          icon: <AlertIcon className="w-6 h-6 text-amber-400" />
        };
      case 'High Risk':
        return {
          bg: 'bg-rose-950/15 border-rose-900/35 text-rose-200',
          badge: 'bg-rose-500/10 text-rose-400 border border-rose-500/25',
          text: 'text-rose-400',
          title: '🚨 High Risk Agreement',
          icon: <ShieldAlert className="w-6 h-6 text-rose-400" />
        };
      default:
        return {
          bg: 'bg-red-950/20 border-red-900/40 text-red-200',
          badge: 'bg-red-500/10 text-red-400 border border-red-500/25',
          text: 'text-red-400',
          title: '❌ Avoid Signing Until Revised',
          icon: <ShieldAlert className="w-6 h-6 text-red-400" />
        };
    }
  };

  const currentStyles = getVerdictStyles(agreement.riskLevel);
  const ratingStrokeColor = agreement.riskScore >= 70 ? 'stroke-rose-500' : agreement.riskScore >= 50 ? 'stroke-amber-500' : 'stroke-emerald-500';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col gap-8 w-full animate-fade-in">
      {/* Back button and document name header */}
      <div className="flex flex-col gap-3 border-b border-slate-900 pb-5">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Dashboard
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-indigo-400">
              <FileText className="w-6 h-6" />
            </div>
            <div className="flex flex-col gap-0.5">
              <h1 className="text-xl sm:text-2xl font-bold text-white leading-tight">{agreement.name}</h1>
              <span className="text-xs text-slate-400">Indian Law Compliance Audit</span>
            </div>
          </div>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 border border-slate-800 hover:border-slate-700 bg-slate-900 text-slate-200 font-semibold text-xs rounded-lg transition-colors cursor-pointer"
          >
            Export Report (PDF)
          </button>
        </div>
      </div>

      {/* Snapshot bar Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-[#070b13]/60 border border-slate-900 rounded-xl p-5">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Agreement Type</span>
          <span className="text-sm font-bold text-white">{report.agreementType}</span>
        </div>
        <div className="flex flex-col gap-1 border-l border-slate-900 pl-4">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Date Duration</span>
          <span className="text-sm font-semibold text-white truncate">{report.duration}</span>
        </div>
        <div className="flex flex-col gap-1 border-l border-slate-900 pl-4">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Validity Period</span>
          <span className="text-sm font-semibold text-white text-xs">
            {report.startDate} to {report.endDate}
          </span>
        </div>
        <div className="flex flex-col gap-1 border-l border-slate-900 pl-4">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Parties Involved</span>
          <span className="text-sm font-semibold text-white text-xs truncate max-w-[200px]" title={report.partiesInvolved.join(', ')}>
            {report.partiesInvolved.join(' vs ')}
          </span>
        </div>
      </div>

      {/* AI Legal Verdict Box */}
      <div className={`p-5 rounded-2xl border flex items-start gap-4 ${currentStyles.bg}`}>
        <div className="mt-0.5">{currentStyles.icon}</div>
        <div className="flex flex-col gap-1 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-base font-extrabold text-white">{currentStyles.title}</h3>
            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded ${currentStyles.badge}`}>
              {agreement.riskScore}% Risk Factor
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mt-2 font-medium">
            {report.finalVerdict}
          </p>
        </div>
      </div>

      {/* Tabs list header */}
      <div className="flex border-b border-slate-900">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 cursor-pointer transition-all ${
            activeTab === 'overview'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Audit Overview
        </button>
        <button
          onClick={() => setActiveTab('clauses')}
          className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 cursor-pointer transition-all ${
            activeTab === 'clauses'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Clauses Breakdown ({report.importantClauses.length})
        </button>
        <button
          onClick={() => setActiveTab('obligations')}
          className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 cursor-pointer transition-all ${
            activeTab === 'obligations'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Responsibilities & Financials
        </button>
        <button
          onClick={() => setActiveTab('missing')}
          className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 cursor-pointer transition-all ${
            activeTab === 'missing'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Signature Protections
        </button>
      </div>

      {/* Tabs Content */}
      <div className="flex-1 flex flex-col gap-8">
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
            {/* Left side: Summary & Negotiation suggestions */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {/* Summary */}
              <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col gap-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-4.5 h-4.5 text-indigo-400" />
                  Summary
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed p-4 rounded-xl bg-slate-950/20 border border-slate-900">
                  {report.summary}
                </p>
              </div>

              {/* Negotiation points */}
              <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col gap-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <MessageSquare className="w-4.5 h-4.5 text-indigo-400" />
                  Key Negotiation Talk-Points
                </h3>
                <div className="flex flex-col gap-3">
                  {report.negotiationSuggestions.map((item, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-indigo-500/5 border border-indigo-500/10 text-xs sm:text-sm text-indigo-200 flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-indigo-500/15 text-indigo-400 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <span className="leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right side: Circular Gauge and Risk timeline */}
            <div className="flex flex-col gap-6">
              {/* Risk Meter Gauge */}
              <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col items-center gap-6">
                <h3 className="text-base font-bold text-white w-full text-left">Risk Assessment</h3>
                
                <div className="relative w-44 h-44 flex flex-col items-center justify-center">
                  {/* Gauge Ring */}
                  <svg className="w-44 h-44 -rotate-90">
                    <circle cx="88" cy="88" r="75" className="stroke-slate-900 fill-none" strokeWidth="8" />
                    <circle cx="88" cy="88" r="75" className={`fill-none transition-all duration-700 ${ratingStrokeColor}`} strokeWidth="8" strokeDasharray={`${2 * Math.PI * 75}`} strokeDashoffset={`${2 * Math.PI * 75 * (1 - agreement.riskScore / 100)}`} />
                  </svg>
                  
                  {/* Inside Text */}
                  <div className="absolute flex flex-col items-center">
                    <span className="text-3xl font-extrabold text-white">{agreement.riskScore}%</span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mt-1 ${currentStyles.badge}`}>
                      {agreement.riskLevel}
                    </span>
                  </div>
                </div>

                {/* Risk Factor bullet list */}
                <div className="w-full flex flex-col gap-2 border-t border-slate-900 pt-4">
                  <span className="text-xs font-semibold text-slate-400">Identified Warning Factors:</span>
                  {report.riskyClauses.map((clause, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-300">
                      <span className="text-rose-500 font-bold mt-0.5">&#8226;</span>
                      <span className="leading-relaxed">{clause.name} (Danger: {clause.dangerLevel})</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Risk Timeline */}
              <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col gap-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Clock className="w-4.5 h-4.5 text-indigo-400" />
                  Contract Risk Timeline
                </h3>
                
                <div className="relative flex flex-col gap-6 pl-8 timeline-track">
                  {/* Item 1 */}
                  <div className="relative flex flex-col gap-1">
                    <div className="absolute left-[-28px] top-1.5 w-4 h-4 rounded-full bg-indigo-500 border-2 border-[#030712] z-10" />
                    <span className="text-xs font-bold text-indigo-400">During Agreement</span>
                    <ul className="list-disc list-inside text-[11px] text-slate-400 space-y-1">
                      {report.riskTimeline.duringAgreement.map((item, idx) => (
                        <li key={idx} className="leading-relaxed">{item}</li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Item 2 */}
                  <div className="relative flex flex-col gap-1">
                    <div className="absolute left-[-28px] top-1.5 w-4 h-4 rounded-full bg-indigo-400 border-2 border-[#030712] z-10" />
                    <span className="text-xs font-bold text-indigo-300">At Renewal</span>
                    <ul className="list-disc list-inside text-[11px] text-slate-400 space-y-1">
                      {report.riskTimeline.atRenewal.map((item, idx) => (
                        <li key={idx} className="leading-relaxed">{item}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Item 3 */}
                  <div className="relative flex flex-col gap-1">
                    <div className="absolute left-[-28px] top-1.5 w-4 h-4 rounded-full bg-sky-500 border-2 border-[#030712] z-10" />
                    <span className="text-xs font-bold text-sky-400">At Termination</span>
                    <ul className="list-disc list-inside text-[11px] text-slate-400 space-y-1">
                      {report.riskTimeline.atTermination.map((item, idx) => (
                        <li key={idx} className="leading-relaxed">{item}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Item 4 */}
                  <div className="relative flex flex-col gap-1">
                    <div className="absolute left-[-28px] top-1.5 w-4 h-4 rounded-full bg-slate-800 border-2 border-[#030712] z-10" />
                    <span className="text-xs font-bold text-slate-500">After Completion</span>
                    <ul className="list-disc list-inside text-[11px] text-slate-400 space-y-1">
                      {report.riskTimeline.afterCompletion.map((item, idx) => (
                        <li key={idx} className="leading-relaxed">{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DETAILED CLAUSES */}
        {activeTab === 'clauses' && (
          <div className="flex flex-col gap-6 animate-fade-in">
            {/* Risky clauses section */}
            {report.riskyClauses.length > 0 && (
              <div className="flex flex-col gap-4">
                <h3 className="text-sm uppercase font-extrabold tracking-wider text-rose-400 flex items-center gap-1.5">
                  <ShieldAlert className="w-4.5 h-4.5" />
                  Hazard Alert: Unreasonable or Illegal Terms
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {report.riskyClauses.map((clause, idx) => (
                    <div key={idx} className="p-6 rounded-2xl border border-rose-950/40 bg-rose-950/5 flex flex-col gap-4 justify-between">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-white">{clause.name}</h4>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                            {clause.dangerLevel} Hazard
                          </span>
                        </div>
                        
                        {/* Statutory citation */}
                        {clause.indianStatuteCitation && (
                          <div className="text-[10px] text-rose-300 font-bold bg-rose-500/5 px-2 py-1 rounded border border-rose-500/10 self-start">
                            {clause.indianStatuteCitation}
                          </div>
                        )}

                        <div className="mt-2 text-slate-500 italic text-[11px] bg-slate-950/30 border border-slate-900 p-3 rounded-lg leading-relaxed relative group">
                          "{clause.originalExtract}"
                          <button
                            onClick={() => handleCopy(clause.originalExtract, `risky-${idx}`)}
                            className="absolute top-2 right-2 p-1 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Copy original extract"
                          >
                            {copiedText === `risky-${idx}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                        
                        <div className="flex flex-col gap-1 mt-2">
                          <span className="text-xs font-bold text-slate-300">Layman Explanation:</span>
                          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{clause.plainEnglish}</p>
                        </div>
                      </div>

                      <div className="border-t border-slate-900/60 pt-4 mt-2 flex flex-col gap-1.5">
                        <span className="text-xs font-bold text-indigo-400">NovaLens Counter-Proposal Suggestion:</span>
                        <p className="text-xs text-indigo-200 leading-relaxed">{clause.suggestion}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* General clauses audit */}
            <div className="flex flex-col gap-4">
              <h3 className="text-sm uppercase font-extrabold tracking-wider text-slate-400 flex items-center gap-1.5">
                <BookOpen className="w-4.5 h-4.5" />
                Audited Agreement Clauses
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {report.importantClauses.map((clause, idx) => (
                  <div key={idx} className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col gap-4 justify-between">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-white">{clause.name}</h4>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                          clause.riskRating === 'High' 
                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' 
                            : clause.riskRating === 'Medium' 
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' 
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        }`}>{clause.riskRating} Risk</span>
                      </div>

                      {/* Legal citation */}
                      {clause.indianStatuteCitation && (
                        <div className="text-[10px] text-indigo-400 font-bold bg-indigo-500/5 px-2 py-1 rounded border border-indigo-500/10 self-start">
                          {clause.indianStatuteCitation}
                        </div>
                      )}

                      <div className="mt-2 text-slate-500 italic text-[11px] bg-slate-950/20 border border-slate-900/60 p-3 rounded-lg leading-relaxed relative group">
                        "{clause.originalExtract}"
                        <button
                          onClick={() => handleCopy(clause.originalExtract, `clause-${idx}`)}
                          className="absolute top-2 right-2 p-1 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Copy original extract"
                        >
                          {copiedText === `clause-${idx}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>

                      <div className="flex flex-col gap-1 mt-2">
                        <span className="text-xs font-bold text-slate-300">Plain-English Translation:</span>
                        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{clause.plainEnglish}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: OBLIGATIONS & FINANCIALS */}
        {activeTab === 'obligations' && (
          <div className="flex flex-col gap-8 animate-fade-in">
            {/* Responsibilities 2-Column */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* User Responsibilities */}
              <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col gap-4">
                <h3 className="text-base font-bold text-white border-b border-slate-900 pb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-indigo-400" />
                  Your Responsibilities
                </h3>
                <ul className="flex flex-col gap-2.5">
                  {report.userResponsibilities.map((item, idx) => (
                    <li key={idx} className="text-xs sm:text-sm text-slate-300 leading-relaxed flex items-start gap-2">
                      <span className="text-indigo-400 font-bold mt-0.5">&#8226;</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Other party responsibilities */}
              <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col gap-4">
                <h3 className="text-base font-bold text-white border-b border-slate-900 pb-3 flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-400" />
                  Other Party's Obligations
                </h3>
                <ul className="flex flex-col gap-2.5">
                  {report.otherPartyResponsibilities.map((item, idx) => (
                    <li key={idx} className="text-xs sm:text-sm text-slate-300 leading-relaxed flex items-start gap-2">
                      <span className="text-indigo-400 font-bold mt-0.5">&#8226;</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Financial Obligations list */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col gap-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-indigo-400" />
                Financial Obligations Summary
              </h3>
              
              <div className="overflow-x-auto border border-slate-900 rounded-xl">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-slate-950/40 text-slate-400 border-b border-slate-900">
                      <th className="py-3 px-4">Fee Category</th>
                      <th className="py-3 px-4">Stated Amount</th>
                      <th className="py-3 px-4">Details</th>
                      <th className="py-3 px-4">Statutory Notes (Indian Law Limits)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900">
                    {report.financialObligations.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-900/10">
                        <td className="py-4 px-4 font-bold text-white">{item.type}</td>
                        <td className="py-4 px-4 font-semibold text-indigo-300">{item.amount}</td>
                        <td className="py-4 px-4 text-slate-300 max-w-sm leading-relaxed">{item.details}</td>
                        <td className="py-4 px-4 text-slate-400 max-w-sm leading-relaxed">
                          {item.statutoryLimitNotes || 'Governed by general contract parameters.'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: MISSING PROTECTIVE CLAUSES */}
        {activeTab === 'missing' && (
          <div className="flex flex-col gap-8 animate-fade-in">
            {/* Missing Clauses */}
            <div className="flex flex-col gap-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-400" />
                Missing Protective Clauses (Signature Auditing)
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                The AI identified these standard safety clauses that are missing from your contract. Without these, you are exposed to significant legal and financial liability under Indian Law.
              </p>

              <div className="grid grid-cols-1 gap-6 mt-2">
                {report.missingProtectiveClauses.map((clause, idx) => (
                  <div key={idx} className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-900 pb-3">
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <AlertIcon className="w-4 h-4 text-rose-400" />
                        Missing Clause: {clause.name}
                      </h4>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 self-start">
                        CRITICAL SAFETY GAP
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[10px] uppercase font-bold text-slate-500">Why It Matters</span>
                          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-semibold">{clause.whyItMatters}</p>
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[10px] uppercase font-bold text-slate-500">Explanation</span>
                          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{clause.explanation}</p>
                        </div>
                      </div>

                      {clause.suggestedIndianDraft && (
                        <div className="flex flex-col gap-2">
                          <span className="text-[10px] uppercase font-bold text-indigo-400 flex items-center justify-between">
                            Suggested Indian Law Draft
                            <button
                              onClick={() => handleCopy(clause.suggestedIndianDraft || '', `draft-${idx}`)}
                              className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] text-indigo-300 hover:text-white flex items-center gap-1 cursor-pointer"
                            >
                              {copiedText === `draft-${idx}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                              {copiedText === `draft-${idx}` ? 'Copied' : 'Copy Draft'}
                            </button>
                          </span>
                          <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-900 text-xs text-slate-300 font-mono leading-relaxed h-full overflow-y-auto max-h-[140px]">
                            {clause.suggestedIndianDraft}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended additions */}
            {report.recommendedClausesToAdd.length > 0 && (
              <div className="flex flex-col gap-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-indigo-400" />
                  Recommended Clauses to Append
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {report.recommendedClausesToAdd.map((clause, idx) => (
                    <div key={idx} className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col gap-4 justify-between">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-white">{clause.title}</h4>
                          {clause.applicableIndianLaw && (
                            <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/5 px-2 py-0.5 rounded border border-indigo-500/10">
                              {clause.applicableIndianLaw}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed font-semibold">Benefit: {clause.benefit}</p>
                        
                        <div className="flex flex-col gap-1.5 mt-2">
                          <span className="text-[10px] uppercase font-bold text-indigo-400 flex items-center justify-between">
                            Draft text
                            <button
                              onClick={() => handleCopy(clause.draftText, `rec-${idx}`)}
                              className="text-[10px] text-slate-400 hover:text-white cursor-pointer"
                            >
                              {copiedText === `rec-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </span>
                          <div className="p-3 rounded-lg bg-slate-950/30 border border-slate-900 text-xs font-mono text-slate-300 leading-relaxed">
                            {clause.draftText}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
