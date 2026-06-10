export interface Clause {
  name: string;
  category: 'Payment' | 'Termination' | 'Confidentiality' | 'Liability' | 'Arbitration' | 'Renewal' | 'Penalty' | 'Data Sharing' | 'Non-Compete' | 'Refund' | 'Other';
  originalExtract: string;
  plainEnglish: string;
  riskRating: 'Low' | 'Medium' | 'High';
  indianStatuteCitation?: string;
}

export interface RiskyClause {
  name: string;
  originalExtract: string;
  plainEnglish: string;
  dangerLevel: 'Medium' | 'High' | 'Critical';
  suggestion: string;
  indianStatuteCitation?: string;
}

export interface MissingClause {
  name: string;
  whyItMatters: string;
  explanation: string;
  suggestedIndianDraft?: string;
}

export interface FinancialObligation {
  type: 'Payment' | 'Deposit' | 'Penalty' | 'Fine' | 'Interest' | 'Cancellation Fee' | 'Late Fee';
  amount: string;
  details: string;
  statutoryLimitNotes?: string;
}

export interface RecommendedClause {
  title: string;
  draftText: string;
  benefit: string;
  applicableIndianLaw?: string;
}

export interface RiskTimeline {
  duringAgreement: string[];
  atRenewal: string[];
  atTermination: string[];
  afterCompletion: string[];
}

export interface AnalysisReport {
  agreementType: string;
  riskPercentage: number; // 0 to 100
  riskLevel: 'Safe' | 'Review Carefully' | 'High Risk' | 'Avoid Signing';
  summary: string;
  startDate: string;
  endDate: string;
  duration: string;
  partiesInvolved: string[];
  importantClauses: Clause[];
  riskyClauses: RiskyClause[];
  missingProtectiveClauses: MissingClause[];
  negotiationSuggestions: string[];
  financialObligations: FinancialObligation[];
  terminationConditions: string[];
  userResponsibilities: string[];
  otherPartyResponsibilities: string[];
  recommendedClausesToAdd: RecommendedClause[];
  riskTimeline: RiskTimeline;
  finalVerdict: string;
}

export interface SavedAgreement {
  id: string;
  name: string;
  type: string;
  riskScore: number;
  riskLevel: string;
  analysisJson: AnalysisReport;
  createdAt: string;
}

export interface DashboardStats {
  totalAnalyzed: number;
  averageRiskScore: number;
  highRiskCount: number;
  recentReports: SavedAgreement[];
}
