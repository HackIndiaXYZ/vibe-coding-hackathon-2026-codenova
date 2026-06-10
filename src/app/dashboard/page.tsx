'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  ShieldAlert, 
  Plus, 
  Trash2, 
  Calendar, 
  ArrowRight,
  Grid,
  Sparkles
} from 'lucide-react';
import { supabase, isLiveMode } from '../../lib/supabase';
import { mockAgreements } from '../../lib/mockData';
import { SavedAgreement } from '../../types';

export default function Dashboard() {
  const [agreements, setAgreements] = useState<SavedAgreement[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchAgreements();
  }, []);

  const fetchAgreements = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('agreements').select('*').order('created_at', { ascending: false });
      if (!error && data) {
        const mapped = data.map((item: any) => ({
          id: item.id,
          name: item.name,
          type: item.type || item.agreementType,
          riskScore: item.riskScore !== undefined ? item.riskScore : (item.risk_score || 0),
          riskLevel: item.riskLevel || item.risk_level || 'Safe',
          analysisJson: item.analysisJson || item.analysis_json,
          createdAt: item.createdAt || item.created_at
        }));
        setAgreements(mapped);
      }
    } catch (err) {
      console.error('Failed to fetch agreements:', err);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this report?')) {
      await supabase.from('agreements').delete().eq('id', id);
      await fetchAgreements();
    }
  };

  const handlePreloadDemo = async () => {
    setLoading(true);
    try {
      const demoItems = [
        {
          id: 'ag_demo_emp',
          name: 'Tech Employment Offer.pdf',
          type: 'Employment Agreement',
          riskScore: mockAgreements['Employment Agreement'].riskPercentage,
          risk_score: mockAgreements['Employment Agreement'].riskPercentage,
          riskLevel: mockAgreements['Employment Agreement'].riskLevel,
          risk_level: mockAgreements['Employment Agreement'].riskLevel,
          analysisJson: mockAgreements['Employment Agreement'],
          analysis_json: mockAgreements['Employment Agreement'],
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'ag_demo_rent',
          name: 'Mumbai BHK Rent Deed.pdf',
          type: 'Rental Agreement',
          riskScore: mockAgreements['Rental Agreement'].riskPercentage,
          risk_score: mockAgreements['Rental Agreement'].riskPercentage,
          riskLevel: mockAgreements['Rental Agreement'].riskLevel,
          risk_level: mockAgreements['Rental Agreement'].riskLevel,
          analysisJson: mockAgreements['Rental Agreement'],
          analysis_json: mockAgreements['Rental Agreement'],
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'ag_demo_free',
          name: 'Chennai Freelancer Contract.docx',
          type: 'Freelance Contract',
          riskScore: mockAgreements['Freelance Contract'].riskPercentage,
          risk_score: mockAgreements['Freelance Contract'].riskPercentage,
          riskLevel: mockAgreements['Freelance Contract'].riskLevel,
          risk_level: mockAgreements['Freelance Contract'].riskLevel,
          analysisJson: mockAgreements['Freelance Contract'],
          analysis_json: mockAgreements['Freelance Contract'],
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];

      await supabase.from('agreements').insert(demoItems);
      await fetchAgreements();
    } catch (err) {
      console.error('Failed to pre-load demo agreements:', err);
    }
    setLoading(false);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Calculate Metrics
  const totalAnalyzed = agreements.length;
  const averageRiskScore = totalAnalyzed > 0 
    ? Math.round(agreements.reduce((sum, item) => sum + item.riskScore, 0) / totalAnalyzed) 
    : 0;
  const highRiskCount = agreements.filter(item => item.riskScore >= 70).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col gap-8 w-full animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-900 pb-6">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">AI Legal Dashboard</h1>
          <p className="text-sm text-slate-400">Review, manage, and audit your agreement portfolios.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/analyze"
            className="px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-all hover:scale-[1.01] flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Analyze Agreement
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-slate-400">Loading your agreements...</span>
          </div>
        </div>
      ) : totalAnalyzed === 0 ? (
        // Empty State Layout
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border border-dashed border-slate-800 rounded-2xl bg-[#070b13]/40 min-h-[400px]">
          <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mb-6">
            <FileText className="w-8 h-8 text-slate-500" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No Contracts Analyzed Yet</h3>
          <p className="text-sm text-slate-400 max-w-sm leading-relaxed mb-8">
            Upload an employment contract, rental agreement, or NDA to run your first AI security analysis under Indian Law.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link
              href="/analyze"
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all hover:scale-[1.01] flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Upload Agreement
            </Link>
            
            {!isLiveMode && (
              <button
                onClick={handlePreloadDemo}
                className="px-6 py-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white font-semibold text-sm transition-all hover:scale-[1.01] flex items-center gap-2 cursor-pointer flex-row"
              >
                <Sparkles className="w-4 h-4 text-indigo-400" />
                Pre-Load Demo Data
              </button>
            )}
          </div>
        </div>
      ) : (
        // Active Dashboard Grid
        <div className="flex flex-col gap-8">
          {/* Stats Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Stat 1 */}
            <div className="glass-panel p-6 rounded-2xl flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Agreements</span>
                <span className="text-3xl font-extrabold text-white">{totalAnalyzed}</span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <FileText className="w-6 h-6" />
              </div>
            </div>

            {/* Stat 2 */}
            <div className="glass-panel p-6 rounded-2xl flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Average Risk Score</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-extrabold text-white">{averageRiskScore}%</span>
                  <span className={`text-xs font-bold ${
                    averageRiskScore >= 70 ? 'text-rose-400' : averageRiskScore >= 50 ? 'text-amber-400' : 'text-emerald-400'
                  }`}>
                    ({averageRiskScore >= 70 ? 'High' : averageRiskScore >= 50 ? 'Medium' : 'Low'})
                  </span>
                </div>
              </div>
              
              {/* Mini Gauge SVG */}
              <div className="relative w-12 h-12 flex items-center justify-center">
                <svg className="w-12 h-12 -rotate-90">
                  <circle cx="24" cy="24" r="20" className="stroke-slate-800 fill-none" strokeWidth="3" />
                  <circle cx="24" cy="24" r="20" className={`fill-none ${
                    averageRiskScore >= 70 ? 'stroke-rose-500' : averageRiskScore >= 50 ? 'stroke-amber-500' : 'stroke-emerald-500'
                  }`} strokeWidth="3" strokeDasharray={`${2 * Math.PI * 20}`} strokeDashoffset={`${2 * Math.PI * 20 * (1 - averageRiskScore / 100)}`} />
                </svg>
                <span className="absolute text-[10px] font-bold text-white">{averageRiskScore}%</span>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="glass-panel p-6 rounded-2xl flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">High Risk Agreements</span>
                <span className="text-3xl font-extrabold text-rose-400">{highRiskCount}</span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                <ShieldAlert className="w-6 h-6 animate-pulse-slow" />
              </div>
            </div>
          </div>

          {/* Recent Reports List */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
              <Grid className="w-4 h-4 text-indigo-400" />
              <h2 className="text-lg font-bold text-white">Recent Security Reports</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-xs">
                    <th className="py-3 px-4">Document Name</th>
                    <th className="py-3 px-4">Agreement Type</th>
                    <th className="py-3 px-4 text-center">Risk Score</th>
                    <th className="py-3 px-4">AI Verdict</th>
                    <th className="py-3 px-4"><span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Date Analyzed</span></th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {agreements.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-900/35 transition-colors group">
                      <td className="py-4 px-4 font-semibold text-white max-w-[200px] truncate">
                        <Link href={`/reports/${item.id}`} className="hover:underline hover:text-indigo-400">
                          {item.name}
                        </Link>
                      </td>
                      <td className="py-4 px-4 text-slate-300">{item.type}</td>
                      <td className="py-4 px-4 text-center">
                        <span className={`inline-block w-12 font-bold px-2 py-0.5 rounded text-center text-xs ${
                          item.riskScore >= 70 
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
                            : item.riskScore >= 50 
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}>
                          {item.riskScore}%
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`text-xs font-semibold ${
                          item.riskScore >= 70 ? 'text-rose-400' : item.riskScore >= 50 ? 'text-amber-400' : 'text-emerald-400'
                        }`}>
                          {item.riskLevel}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-slate-400">
                        {new Date(item.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex justify-end items-center gap-3">
                          <Link
                            href={`/reports/${item.id}`}
                            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 cursor-pointer"
                          >
                            View Report
                            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                          </Link>
                          <button
                            onClick={(e) => handleDelete(item.id, e)}
                            className="p-1 text-slate-500 hover:text-rose-400 rounded transition-colors cursor-pointer"
                            title="Delete report"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
