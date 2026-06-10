import React from 'react';
import { Scale } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-[#02050c] border-t border-slate-900 mt-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        {/* Brand */}
        <div className="flex flex-col gap-2 max-w-sm">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-tr from-indigo-500 to-sky-500 p-1.5 rounded-lg">
              <Scale className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg text-white">NovaLens</span>
            <span className="text-[9px] uppercase font-bold text-indigo-400 border border-indigo-500/20 px-1 py-0.5 rounded bg-indigo-500/10">
              India
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed mt-2">
            AI-powered legal intelligence platform that demystifies contract terms, obligations, and hazards under Indian Law.
          </p>
        </div>

        {/* Links Grid */}
        <div className="flex gap-12 sm:gap-16">
          <div className="flex flex-col gap-2.5">
            <h4 className="text-xs uppercase font-bold text-slate-300 tracking-wider">Product</h4>
            <a href="/analyze" className="text-xs text-slate-400 hover:text-white transition-colors">Analyzer</a>
            <a href="/dashboard" className="text-xs text-slate-400 hover:text-white transition-colors">Dashboard</a>
          </div>
          <div className="flex flex-col gap-2.5">
            <h4 className="text-xs uppercase font-bold text-slate-300 tracking-wider">Legal Framework</h4>
            <span className="text-xs text-slate-400">Indian Contract Act, 1872</span>
            <span className="text-xs text-slate-400">Arbitration Act, 1996</span>
          </div>
        </div>
      </div>

      <hr className="border-slate-900 my-8 max-w-7xl mx-auto" />

      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Disclaimer */}
        <p className="text-[10px] text-slate-500 max-w-3xl leading-relaxed">
          <strong>Disclaimer:</strong> NovaLens is an artificial intelligence application designed to assist in contract analysis for informational and educational purposes. NovaLens is not a law firm, does not provide legal services or legal advice, and does not create an attorney-client relationship. Always consult a qualified advocate registered with the Bar Council of India for formal legal counsel.
        </p>

        {/* Copyright */}
        <div className="text-[10px] text-slate-500 whitespace-nowrap">
          &copy; {new Date().getFullYear()} NovaLens. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
