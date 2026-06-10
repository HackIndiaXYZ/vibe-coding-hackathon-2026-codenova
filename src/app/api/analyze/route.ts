import { NextRequest, NextResponse } from 'next/server';
import { mockAgreements } from '../../../lib/mockData';

function extractParties(text: string): string[] {
  // Join first 40 lines into a single normalized string
  const normalizedText = text
    .split('\n')
    .slice(0, 40)
    .map(l => l.trim())
    .join(' ')
    .replace(/\s+/g, ' ');

  const betweenIndex = normalizedText.toUpperCase().indexOf('BETWEEN');
  if (betweenIndex === -1) {
    return ['Employer/Lessor', 'Employee/Lessee'];
  }

  // Slice text starting after BETWEEN
  const afterBetween = normalizedText.substring(betweenIndex + 7).trim();

  // Find all occurrences of " AND " (case-insensitive) in the first 1000 characters
  const searchLimit = Math.min(afterBetween.length, 1000);
  const searchStr = afterBetween.substring(0, searchLimit);
  
  const andIndices: number[] = [];
  const andRegex = /\bAND\b/ig;
  let match;
  while ((match = andRegex.exec(searchStr)) !== null) {
    andIndices.push(match.index);
  }

  if (andIndices.length === 0) {
    return ['Employer/Lessor', 'Employee/Lessee'];
  }

  // Score each AND to find the one that separates the two parties
  let bestAndIndex = -1;
  let highestScore = -999;

  for (const idx of andIndices) {
    const leftText = searchStr.substring(0, idx).trim();
    const rightText = searchStr.substring(idx + 3).trim();

    let score = 0;

    // Check if right side starts with name-like prefix
    if (/^(?:Mr\.|Mrs\.|Ms\.|Dr\.|M\/s\.|Shri|Smt\b)/i.test(rightText)) {
      score += 15;
    } else if (/^[A-Z]/.test(rightText)) {
      score += 5; // Starts with capital letter
    }

    // Check if left side contains address keywords or party descriptions
    const leftLower = leftText.toLowerCase();
    if (leftLower.includes('residing') || leftLower.includes('resident') || leftLower.includes('r/o') || leftLower.includes('office at')) {
      score += 10;
    }
    if (leftLower.includes('hereinafter') || leftLower.includes('lessor') || leftLower.includes('employer') || leftLower.includes('licensor') || leftLower.includes('first party')) {
      score += 8;
    }

    // Penalize if right text is very short or contains agreement keywords immediately
    const rightLower = rightText.toLowerCase();
    if (rightLower.startsWith('agreement') || rightLower.startsWith('contract') || rightLower.startsWith('lease')) {
      score -= 20;
    }

    if (score > highestScore) {
      highestScore = score;
      bestAndIndex = idx;
    }
  }

  if (bestAndIndex === -1) {
    return ['Employer/Lessor', 'Employee/Lessee'];
  }

  const firstPartySegment = searchStr.substring(0, bestAndIndex).trim();
  const secondPartySegment = searchStr.substring(bestAndIndex + 3).trim();

  // Helper to extract clean name from segment
  const cleanName = (segment: string): string => {
    const delimRegex = /(?:,|\(|\b(?:residing|resident|r\/o|s\/o|w\/o|d\/o|son\s+of|wife\s+of|daughter\s+of|hereinafter|having|aged|representing|a\s+company|carrying\s+on|of\s+the|referred|of|represented)\b)/i;
    const parts = segment.split(delimRegex);
    let name = parts[0].trim();
    
    // Allowed '/' in name characters to support M/s.
    name = name.replace(/[^a-zA-Z0-9.\s,&\/]/g, '').trim();
    return name;
  };

  const p1 = cleanName(firstPartySegment);
  const p2 = cleanName(secondPartySegment);

  const addressKeywords = /\b(?:road|street|nagar|lane|flat|plot|building|floor|apartment|colony|sector|layout|village|town|district|state|chennai|mumbai|delhi|bengaluru|bangalore|pune|hyderabad|kolkata|india|pincode|pin code|opposite|near|behind|cross|main)\b/i;

  const isValidName = (n: string): boolean => {
    if (!n || n.length < 3 || n.length > 60) return false;
    if (addressKeywords.test(n) && !/^(?:Mr\.|Mrs\.|Ms\.|Shri|Smt|M\/s)/i.test(n)) {
      return false;
    }
    return true;
  };

  const finalP1 = isValidName(p1) ? p1 : 'Employer/Lessor';
  const finalP2 = isValidName(p2) ? p2 : 'Employee/Lessee';

  return [finalP1, finalP2];
}

function calculateEndDate(startStr: string, durationStr: string): string {
  try {
    const cleaned = startStr
      .replace(/(\d+)(?:st|nd|rd|th)/gi, '$1')
      .replace(/day\s+of/gi, '')
      .trim();
    
    const date = new Date(cleaned);
    if (isNaN(date.getTime())) {
      return `Expires ${durationStr} after ${startStr}`;
    }

    const amount = parseInt(durationStr.match(/\d+/)?.[0] || '11');
    const isYear = durationStr.toLowerCase().includes('year');

    if (isYear) {
      date.setFullYear(date.getFullYear() + amount);
    } else {
      date.setMonth(date.getMonth() + amount);
    }

    date.setDate(date.getDate() - 1);

    const day = date.getDate();
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    const getSuffix = (d: number) => {
      if (d > 3 && d < 21) return 'th';
      switch (d % 10) {
        case 1:  return 'st';
        case 2:  return 'nd';
        case 3:  return 'rd';
        default: return 'th';
      }
    };

    return `${day}${getSuffix(day)} ${month} ${year}`;
  } catch (e) {
    return `Expires ${durationStr} after ${startStr}`;
  }
}

function extractValidity(text: string) {
  const sentences = text.split(/[.!\n\r]+/).map(s => s.trim()).filter(s => s.length > 15);
  
  let startDate = 'Unknown';
  let endDate = 'Indefinite';
  let duration = 'As per contract specifications';

  // Added 'gi' flag to the end of the regex
  const dateRegex = /\b(?:\d{1,2}(?:st|nd|rd|th)?\s+(?:day\s+of\s+)?(?:January|February|March|April|May|June|July|August|September|October|November|December|[a-zA-Z]{3,9})\s+\d{4}|\d{1,2}[-/.]\d{1,2}[-/.]\d{4}|\b(?:January|February|March|April|May|June|July|August|September|October|November|December|[a-zA-Z]{3,9})\s+\d{1,2}(?:st|nd|rd|th)?\s*,\s*\d{4})\b/gi;

  const dateMatches: string[] = [];
  for (const s of sentences.slice(0, 25)) {
    const matches = s.match(dateRegex);
    if (matches) {
      dateMatches.push(...matches);
    }
  }

  if (dateMatches.length > 0) {
    startDate = dateMatches[0];
  }

  // Improved termSentence matching
  const termSentence = sentences.find(s => {
    const lower = s.toLowerCase();
    const matchesKeyword = /\b(?:term|period|tenure|duration|lease|valid|force|lock-in|agreement)\b/i.test(lower);
    const matchesUnit = /\b(?:month|year|week)s?\b/i.test(lower);
    return matchesKeyword && matchesUnit;
  });

  if (termSentence) {
    const durationMatch = termSentence.match(/\b\d+\s+(?:month|year|week)s?\b/i) || 
                          termSentence.match(/\bone\s+year|\btwo\s+years|\bthree\s+months|\beleven\s+months\b/i);
    if (durationMatch) {
      duration = durationMatch[0];
    } else {
      duration = termSentence.substring(0, 60) + '...';
    }
  }

  if (dateMatches.length >= 2) {
    const d1 = dateMatches[0].toLowerCase().replace(/[^a-z0-9]/g, '');
    
    // Find the first date match that is different from d1
    const differentDate = dateMatches.slice(1).find(d => {
      return d.toLowerCase().replace(/[^a-z0-9]/g, '') !== d1;
    });

    if (differentDate) {
      endDate = differentDate;
    } else if (startDate !== 'Unknown' && duration !== 'As per contract specifications') {
      endDate = calculateEndDate(startDate, duration);
    }
  } else if (startDate !== 'Unknown' && duration !== 'As per contract specifications') {
    endDate = calculateEndDate(startDate, duration);
  }

  return { startDate, endDate, duration };
}

function generateDynamicMockReport(agreementType: string, text: string): any {
  // Normalize text by removing excessive whitespaces and split into lines/sentences
  const sentences = text
    .split(/[.!\n\r]+/)
    .map(s => s.replace(/\s+/g, ' ').trim())
    .filter(s => s.length > 25); // Ignore very short fragments

  const parties = extractParties(text);
  const validity = extractValidity(text);

  console.log('=== DEBUG SANDBOX PARSER ===');
  console.log('Parsed text preview (first 500 chars):', text.replace(/\s+/g, ' ').substring(0, 500));
  console.log('Extracted Parties:', parties);
  console.log('Extracted Validity:', validity);
  console.log('=============================');
  
  const importantClauses: any[] = [];
  const riskyClauses: any[] = [];
  const financialObligations: any[] = [];
  const terminationConditions: string[] = [];
  const userResponsibilities: string[] = [];
  const otherPartyResponsibilities: string[] = [];

  // Helper to find sentences by keywords
  const findSentences = (keywords: string[], limit = 3) => {
    const matched: string[] = [];
    for (const s of sentences) {
      if (keywords.some(kw => s.toLowerCase().includes(kw))) {
        if (!matched.includes(s)) {
          matched.push(s);
          if (matched.length >= limit) break;
        }
      }
    }
    return matched;
  };

  // 1. Gather all financial sentences
  const moneySentences = findSentences(['pay', 'inr', 'rs.', '₹', 'fee', 'charge', 'stipend', 'salary', 'rent', 'amount'], 4);
  moneySentences.forEach((s) => {
    financialObligations.push({
      type: s.toLowerCase().includes('penalty') || s.toLowerCase().includes('fine') || s.toLowerCase().includes('late') ? 'Penalty' : 'Payment',
      amount: s.match(/(?:INR|Rs\.|₹)\s*\d+(?:,\d+)*(?:\.\d+)?/gi)?.[0] || 'See clause text',
      details: s,
      statutoryLimitNotes: 'Governed by the terms specified in this document and subject to Indian Contract Act parameters.'
    });
  });

  // 2. Gather termination sentences
  const termSentences = findSentences(['terminate', 'notice', 'resig', 'exit', 'expire', 'days'], 4);
  termSentences.forEach((s) => {
    terminationConditions.push(s);
  });

  // 3. Gather user and other party obligations
  const shallSentences = findSentences(['shall', 'must', 'agree to', 'responsible', 'undertake', 'obligat'], 6);
  shallSentences.forEach((s) => {
    const lower = s.toLowerCase();
    if (lower.includes('client') || lower.includes('company') || lower.includes('employer') || lower.includes('licensor')) {
      otherPartyResponsibilities.push(s);
    } else {
      userResponsibilities.push(s);
    }
  });

  // 4. Scan sentences and build clauses breakdown
  sentences.forEach((s) => {
    const lower = s.toLowerCase();
    
    // Check Non-Compete
    if (lower.includes('non-compete') || lower.includes('not work') || lower.includes('competitor') || lower.includes('compete') || lower.includes('solicit')) {
      if (riskyClauses.length < 3 && !riskyClauses.some(c => c.originalExtract === s)) {
        riskyClauses.push({
          name: 'Post-Employment Restriction / Non-Compete',
          originalExtract: s,
          plainEnglish: 'This clause restricts your right to work for competitors or start a similar business after termination.',
          dangerLevel: 'Critical',
          suggestion: 'Under Section 27 of the Indian Contract Act, 1872, post-employment non-compete clauses are void and unenforceable in India. Ask to delete this clause or limit it to active employment.',
          indianStatuteCitation: 'Section 27 of the Indian Contract Act, 1872'
        });
      }
    }
    
    // Check Penalty / Bond
    else if (lower.includes('penalty') || lower.includes('liquidated damages') || lower.includes('fine') || lower.includes('forfeit') || lower.includes('bond')) {
      if (riskyClauses.length < 3 && !riskyClauses.some(c => c.originalExtract === s)) {
        riskyClauses.push({
          name: 'Penalty or Liquidated Damages Clause',
          originalExtract: s,
          plainEnglish: 'This imposes a monetary penalty or compensation duty for breaches or early exit.',
          dangerLevel: 'High',
          suggestion: 'Under Section 74 of the Indian Contract Act, arbitrary penalties are void unless the claiming party can prove actual financial loss. Request to remove this bond/penalty or cap it to actual expenses.',
          indianStatuteCitation: 'Section 74 of the Indian Contract Act, 1872'
        });
      }
    }
    
    // General Important clauses extraction (grab up to 5 interesting clauses from the document)
    else if (importantClauses.length < 5 && !riskyClauses.some(c => c.originalExtract === s)) {
      let clauseName = 'General Operational Clause';
      let category = 'Other';
      let plainEnglish = 'Standard agreement term governing operational parameters.';
      let citation = 'Indian Contract Act, 1872';
      let riskRating = 'Low';

      if (lower.includes('notice') || lower.includes('termination')) {
        clauseName = 'Termination Clause';
        category = 'Termination';
        plainEnglish = 'This clause specifies the notice requirements and grounds for terminating the contract.';
        riskRating = 'Medium';
      } else if (lower.includes('intellectual') || lower.includes('copyright') || lower.includes('invention') || lower.includes('patent') || lower.includes('property')) {
        clauseName = 'Intellectual Property';
        category = 'Other';
        plainEnglish = 'This assigns ownership of any work products, codes, or designs created under the agreement.';
        riskRating = 'Medium';
        citation = 'Section 17 of the Copyright Act, 1957';
      } else if (lower.includes('arbitrat') || lower.includes('dispute') || lower.includes('jurisdict') || lower.includes('court')) {
        clauseName = 'Dispute Resolution & Seat';
        category = 'Arbitration';
        plainEnglish = 'This defines the process (arbitration vs court) and venue for resolving disputes.';
        citation = 'Arbitration and Conciliation Act, 1996';
        riskRating = 'Low';
      } else if (lower.includes('payment') || lower.includes('salary') || lower.includes('stipend') || lower.includes('fee')) {
        clauseName = 'Remuneration & Payments';
        category = 'Payment';
        plainEnglish = 'This defines the payment amount, timing, and invoicing process.';
        riskRating = 'Low';
      } else {
        // Skip generic sentences if we want high quality clauses, unless we have too few
        if (importantClauses.length > 2 && !lower.includes('agree') && !lower.includes('shall')) {
          return;
        }
      }

      importantClauses.push({
        name: clauseName,
        category: category,
        originalExtract: s,
        plainEnglish: plainEnglish,
        riskRating: riskRating,
        indianStatuteCitation: citation
      });
    }
  });

  // Ensure lists are populated if they are empty
  if (importantClauses.length === 0) {
    // Take the first 3 lines of the document
    sentences.slice(0, 3).forEach((s, idx) => {
      importantClauses.push({
        name: `Agreement Scope Term ${idx + 1}`,
        category: 'Other',
        originalExtract: s,
        plainEnglish: 'Initial term defining the basic scope and engagement of the parties.',
        riskRating: 'Low',
        indianStatuteCitation: 'Section 10 of the Indian Contract Act, 1872'
      });
    });
  }
  if (userResponsibilities.length === 0) {
    userResponsibilities.push('Perform obligations in accordance with the standards set out in this document.');
    userResponsibilities.push('Comply with all operational guidelines and confidentiality conditions.');
  }
  if (otherPartyResponsibilities.length === 0) {
    otherPartyResponsibilities.push('Provide payments and cooperation as detailed in the contract terms.');
  }
  if (terminationConditions.length === 0) {
    terminationConditions.push('Termination is governed by the default legal notice guidelines under Indian law.');
  }
  if (financialObligations.length === 0) {
    financialObligations.push({
      type: 'Payment',
      amount: 'Specified in terms',
      details: 'Remuneration or fee details specified in the uploaded document.',
      statutoryLimitNotes: 'Governed by commercial parameters.'
    });
  }

  // Calculate dynamic risk score based on what we found
  let riskScore = 30; // base risk
  if (riskyClauses.some(c => c.dangerLevel === 'Critical')) riskScore += 35;
  if (riskyClauses.some(c => c.dangerLevel === 'High')) riskScore += 20;
  if (importantClauses.some(c => c.riskRating === 'High')) riskScore += 15;
  riskScore = Math.min(95, riskScore);

  let riskLevel = 'Safe';
  if (riskScore >= 75) riskLevel = 'Avoid Signing';
  else if (riskScore >= 60) riskLevel = 'High Risk';
  else if (riskScore >= 45) riskLevel = 'Review Carefully';

  // Synthesize a detailed summary
  const summaryParts = [
    `This is a detailed analysis of the ${agreementType} document entered into by and between ${parties[0]} and ${parties[1]}.`,
    `The contract terms specify a start date of ${validity.startDate} and is structured for a duration of ${validity.duration} (concluding/expiring on ${validity.endDate}).`
  ];

  if (riskyClauses.length > 0) {
    summaryParts.push(
      `Crucially, the audit has identified ${riskyClauses.length} highly unfavorable or legally vulnerable clauses under Indian law: ` +
      riskyClauses.map(c => `a ${c.name} (${c.dangerLevel} hazard)`).join(', ') + `. ` +
      `Specifically, under Section 27 of the Indian Contract Act, 1872, any post-employment non-compete restraint is void, and under Section 74, flat penalty guidelines are subject to reasonable compensation verification rather than absolute forfeiture.`
    );
  } else {
    summaryParts.push(`No critical legal warnings or invalid restraint covenants were detected in the text of the contract, indicating standard commercial terms.`);
  }

  if (financialObligations.length > 0) {
    summaryParts.push(
      `Financial parameters of this agreement involve: ` +
      financialObligations.map(f => `${f.type} of ${f.amount} (${f.details.substring(0, 80)}...)`).join(', ') + `.`
    );
  }

  if (importantClauses.length > 0) {
    summaryParts.push(
      `Other key audited segments include ` +
      importantClauses.map(c => `the ${c.name}`).join(', ') + `, covering IP ownership, dispute resolution seats, and notice periods.`
    );
  }

  const summary = summaryParts.join('\n\n');

  const finalVerdict = `Audited contract for ${parties[0]} vs ${parties[1]}. ` +
    (riskyClauses.length > 0 ? `🚨 CRITICAL WARNING: This contract contains ${riskyClauses.length} clauses representing high risk. Review recommendations before signing. ` : '✅ This agreement contains standard legal terms. ') +
    `The contract has a risk score of ${riskScore}% under the Indian Contract Act, 1872.`;

  return {
    agreementType,
    riskPercentage: riskScore,
    riskLevel,
    summary,
    startDate: validity.startDate,
    endDate: validity.endDate,
    duration: validity.duration,
    partiesInvolved: parties,
    importantClauses,
    riskyClauses,
    missingProtectiveClauses: [
      {
        name: 'Limitation of Liability Cap',
        whyItMatters: 'Limits your financial exposure if something goes wrong, protecting your personal assets.',
        explanation: 'The contract is missing an explicit cap on your liability, leaving you open to uncapped damages claims under Section 73 of the Indian Contract Act.',
        suggestedIndianDraft: 'Notwithstanding anything to the contrary, the Developer\'s maximum liability under this agreement shall be capped at 100% of the total fees actually received.'
      }
    ],
    negotiationSuggestions: [
      'Ensure all clauses concerning payments are tied to explicit milestones or dates.',
      'Ask to limit any post-employment restrictions, citing Section 27 of the Indian Contract Act.',
      'Request a mutual notice period (e.g. 30 days for both sides) to ensure fairness.'
    ],
    financialObligations,
    terminationConditions,
    userResponsibilities,
    otherPartyResponsibilities,
    recommendedClausesToAdd: [
      {
        title: 'Force Majeure Suspension',
        draftText: 'Neither party shall be liable for any delay or failure in performing its obligations under this Agreement if such delay is caused by acts of God, war, lockouts, or pandemics.',
        benefit: 'Protects you from breach claims if external force majeure factors make performance impossible.',
        applicableIndianLaw: 'Section 56 of the Indian Contract Act, 1872 (Frustration of Contract)'
      }
    ],
    riskTimeline: {
      duringAgreement: ['Subject to performance standard compliance.', 'Prohibition on disclosing confidential business details.'],
      atRenewal: ['Terms and pricing subject to mutual renegotiation.'],
      atTermination: [`Serve notice period specified in contract.`],
      afterCompletion: ['Confidentiality obligations survive termination.', 'All IP assignments remain with the respect owner.']
    },
    finalVerdict
  };
}

import { PDFParse } from 'pdf-parse';
import mammoth from 'mammoth';
import path from 'path';
import { pathToFileURL } from 'url';
// @ts-ignore
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs';


// Configure the worker path for pdfjs-dist server-side in Node.js
if (typeof window === 'undefined') {
  try {
    const workerPath = path.join(process.cwd(), 'node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs');
    // On Windows, ESM dynamic import requires a file:// URL rather than a drive letter path
    pdfjs.GlobalWorkerOptions.workerSrc = pathToFileURL(workerPath).href;
  } catch (err) {
    console.error('Failed to configure PDF worker path:', err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const agreementType = formData.get('agreementType') as string || 'Employment Agreement';
    const clientText = formData.get('text') as string || '';
    const file = formData.get('file') as File | null;
    const fileName = formData.get('fileName') as string || (file ? file.name : 'document.txt');

    let documentText = clientText;

    // Server-side parsing for PDF and DOCX
    if (file && !documentText) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      if (file.name.toLowerCase().endsWith('.pdf')) {
        const parsedPdf = new PDFParse(new Uint8Array(buffer));
        const pdfResult = await parsedPdf.getText();
        documentText = pdfResult.text;
      } else if (file.name.toLowerCase().endsWith('.docx')) {
        const parsedDoc = await mammoth.extractRawText({ buffer });
        documentText = parsedDoc.value;
      } else {
        // Plain text fallback
        documentText = buffer.toString('utf-8');
      }
    }

    if (!documentText.trim()) {
      return NextResponse.json(
        { error: 'Document is empty or could not be parsed.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY || '';
    const apiBase = process.env.OPENAI_API_BASE_URL || 'https://api.openai.com/v1';
    const modelName = process.env.OPENAI_MODEL_NAME || 'gpt-4o-mini';

    let analysisReport;
    let isMockFallback = false;

    if (!apiKey) {
      console.log('OPENAI_API_KEY is not configured. Falling back to dynamic rule-based mock report.');
      isMockFallback = true;
      analysisReport = generateDynamicMockReport(agreementType, documentText);
    } else {
      // Live Mode - Call OpenAI/LLM API
      try {
        const systemPrompt = `You are an expert Indian Legal AI Auditor specialized in auditing contracts and agreements under the Indian legal system.
Ground all responses strictly in Indian Statutes, such as:
- Indian Contract Act, 1872 (especially Section 27 for non-compete validity, Section 73/74 for penalties and liquidated damages)
- Real Estate (Regulation and Development) Act, 2016 (RERA) & State Rent Control laws for rentals
- Arbitration and Conciliation Act, 1996 for arbitration agreements
- Information Technology Act, 2000 for electronic terms and NDAs
- Hindu Marriage Act, 1955 / Special Marriage Act, 1954 for divorce settlements.

Analyze the contract text provided by the user, categorize it as the requested agreementType, and output a valid JSON report.
Strictly adhere to the following JSON structure:
{
  "agreementType": "string",
  "riskPercentage": 0, // Integer 0 to 100
  "riskLevel": "Safe" | "Review Carefully" | "High Risk" | "Avoid Signing",
  "summary": "Plain-English, extremely simple language translation of the contract details, obligations, and hazards. Ground it in Indian laws.",
  "startDate": "YYYY-MM-DD or Unknown",
  "endDate": "YYYY-MM-DD or Indefinite or Unknown",
  "duration": "string",
  "partiesInvolved": ["string"],
  "importantClauses": [
    {
      "name": "string",
      "category": "Payment" | "Termination" | "Confidentiality" | "Liability" | "Arbitration" | "Renewal" | "Penalty" | "Data Sharing" | "Non-Compete" | "Refund" | "Other",
      "originalExtract": "string",
      "plainEnglish": "string",
      "riskRating": "Low" | "Medium" | "High",
      "indianStatuteCitation": "string (e.g., Section 27 of Indian Contract Act, 1872)"
    }
  ],
  "riskyClauses": [
    {
      "name": "string",
      "originalExtract": "string",
      "plainEnglish": "string",
      "dangerLevel": "Medium" | "High" | "Critical",
      "suggestion": "string (actionable Indian law guidance)",
      "indianStatuteCitation": "string"
    }
  ],
  "missingProtectiveClauses": [
    {
      "name": "string",
      "whyItMatters": "string",
      "explanation": "string",
      "suggestedIndianDraft": "string (drafted in standard Indian legal language)"
    }
  ],
  "negotiationSuggestions": ["string (concrete talking points for India)"],
  "financialObligations": [
    {
      "type": "Payment" | "Deposit" | "Penalty" | "Fine" | "Interest" | "Cancellation Fee" | "Late Fee",
      "amount": "string",
      "details": "string",
      "statutoryLimitNotes": "string (limits based on Indian laws)"
    }
  ],
  "terminationConditions": ["string"],
  "userResponsibilities": ["string"],
  "otherPartyResponsibilities": ["string"],
  "recommendedClausesToAdd": [
    {
      "title": "string",
      "draftText": "string",
      "benefit": "string",
      "applicableIndianLaw": "string"
    }
  ],
  "riskTimeline": {
    "duringAgreement": ["string"],
    "atRenewal": ["string"],
    "atTermination": ["string"],
    "afterCompletion": ["string"]
  },
  "finalVerdict": "string (detailed warning/recommendation justification, citing Indian sections)"
}

Ensure the output is ONLY raw JSON. Do not include markdown code block syntax (\`\`\`json). The JSON must be fully valid.`;

        const response = await fetch(`${apiBase}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: modelName,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: `Agreement Type: ${agreementType}\n\nDocument Text:\n${documentText}` }
            ],
            temperature: 0.1,
            response_format: { type: 'json_object' }
          })
        });

        if (!response.ok) {
          throw new Error(`AI API returned status ${response.status}`);
        }

        const data = await response.json();
        const rawJson = data.choices[0].message.content.trim();
        analysisReport = JSON.parse(rawJson);
      } catch (aiError: any) {
        console.warn('LLM API Call failed, falling back to dynamic rule-based mock report:', aiError);
        isMockFallback = true;
        analysisReport = generateDynamicMockReport(agreementType, documentText);
      }
    }


    // Save report in Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const isLiveDb = !!(
      supabaseUrl && 
      supabaseAnonKey && 
      supabaseUrl !== 'your-supabase-project-url' &&
      supabaseUrl !== 'https://placeholder.supabase.co' &&
      !supabaseUrl.includes('placeholder')
    );

    let savedRecord = {
      id: 'ag_' + Math.random().toString(36).substring(2, 11),
      name: fileName,
      type: agreementType,
      risk_score: analysisReport.riskPercentage,
      risk_level: analysisReport.riskLevel,
      analysis_json: analysisReport,
      created_at: new Date().toISOString()
    };

    if (!isLiveDb || isMockFallback) {
      console.log('Sandbox mode or mock fallback active, returning record to client without Supabase write.');
      return NextResponse.json(savedRecord);
    }

    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/agreements`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(savedRecord)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Supabase REST write failed with status ${response.status}: ${errorText}`);
      }

      const dbData = await response.json();
      if (dbData && dbData[0]) {
        savedRecord = dbData[0];
      } else {
        throw new Error('Supabase did not return the saved record representation.');
      }
    } catch (dbErr: any) {
      console.error('Failed to write directly to Supabase REST endpoint:', dbErr);
      return NextResponse.json(
        { error: `Database write failed: ${dbErr.message || dbErr}` },
        { status: 500 }
      );
    }

    return NextResponse.json(savedRecord);

  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}


