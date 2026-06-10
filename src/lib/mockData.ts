import { AnalysisReport } from '../types';

export const mockAgreements: Record<string, AnalysisReport> = {
  'Employment Agreement': {
    agreementType: 'Employment Agreement',
    riskPercentage: 72,
    riskLevel: 'High Risk',
    summary: 'This agreement hires you as a Senior Software Engineer for a technology company. While the remuneration terms are standard, it contains highly restrictive clauses: a broad non-compete restriction across India for 2 years post-employment, a disproportionate notice period ratio (15 days for the employer vs 90 days for you), and full intellectual property assignment including personal projects created outside work hours. The non-compete is generally unenforceable under Section 27 of the Indian Contract Act, 1872.',
    startDate: '2026-07-01',
    endDate: 'Indefinite',
    duration: 'Permanent (Subject to termination clauses)',
    partiesInvolved: [
      'Zenith Technologies Private Limited (Employer)',
      'Aarav Sharma (Employee)'
    ],
    importantClauses: [
      {
        name: 'Compensation and Benefits',
        category: 'Payment',
        originalExtract: 'The Employee shall receive a consolidated gross salary of INR 18,00,000 per annum, paid monthly in arrears after applicable statutory deductions like TDS, EPF, and Professional Tax.',
        plainEnglish: 'You get a gross salary of ₹18 Lakhs per year, which will be paid monthly. Standard Indian taxes (TDS) and provident fund contributions (EPF) will be deducted before you receive it.',
        riskRating: 'Low',
        indianStatuteCitation: 'Income Tax Act, 1961 (TDS provisions) & Employees\' Provident Funds Act, 1952'
      },
      {
        name: 'Notice Period & Termination',
        category: 'Termination',
        originalExtract: 'The Employer may terminate this Agreement at any time by giving fifteen (15) days written notice or salary in lieu thereof. The Employee may terminate this Agreement only by providing ninety (90) days prior written notice.',
        plainEnglish: 'The company can fire you with just 15 days notice (or pay you 15 days salary and ask you to leave immediately). However, if you want to quit, you are forced to serve a long 90-day notice period.',
        riskRating: 'High',
        indianStatuteCitation: 'Model Standing Orders under Industrial Employment (Standing Orders) Act, 1946'
      },
      {
        name: 'Intellectual Property Assignment',
        category: 'Other',
        originalExtract: 'All inventions, software, designs, and patents developed, conceived, or reduced to practice by the Employee during the term of employment, whether or not during office hours or using Employer resources, shall be the sole and exclusive property of the Employer.',
        plainEnglish: 'The company claims ownership of everything you design or code while working for them, even if you do it on your personal laptop at home during weekends or holidays.',
        riskRating: 'Medium',
        indianStatuteCitation: 'Section 17 of the Copyright Act, 1957 (Work made in the course of employment)'
      },
      {
        name: 'Arbitration Jurisdiction',
        category: 'Arbitration',
        originalExtract: 'Any dispute arising out of this Agreement shall be referred to arbitration in accordance with the Arbitration and Conciliation Act, 1996. The seat and venue of arbitration shall be Bengaluru, Karnataka, and proceedings shall be in English.',
        plainEnglish: 'If there is a legal fight, it won\'t go to a normal court. It will go to a private arbitrator in Bengaluru. This is a standard dispute clause in Indian corporate contracts.',
        riskRating: 'Low',
        indianStatuteCitation: 'Arbitration and Conciliation Act, 1996'
      }
    ],
    riskyClauses: [
      {
        name: 'Post-Employment Non-Compete',
        originalExtract: 'For a period of twenty-four (24) months following the termination of employment for any reason, the Employee shall not directly or indirectly engage, work, consult, or associate with any competitor or similar technology business operating within the territory of India.',
        plainEnglish: 'You cannot take a job at any other tech company in India for 2 years after you leave Zenith Technologies.',
        dangerLevel: 'Critical',
        suggestion: 'Ask to delete this clause entirely. In India, Section 27 of the Indian Contract Act makes any agreement that restricts someone from exercising a lawful profession, trade, or business void. Courts consistently rule against post-employment non-competes.',
        indianStatuteCitation: 'Section 27 of the Indian Contract Act, 1872'
      },
      {
        name: 'Liquidated Damages for Training Costs',
        originalExtract: 'In the event the Employee terminates this agreement within twelve (12) months of commencement, the Employee shall pay a fixed sum of INR 2,00,000 as liquidated damages to compensate the Employer for training and onboarding expenses.',
        plainEnglish: 'If you quit within your first year, you must pay the company ₹2,00,000 as a penalty for "training costs".',
        dangerLevel: 'High',
        suggestion: 'Request that this penalty be deleted or capped strictly at actual, documented training expenses. Under Indian law, a company cannot recover arbitrary penalties unless they can prove they spent actual funds specifically on training you.',
        indianStatuteCitation: 'Section 74 of the Indian Contract Act, 1872 (Reasonable compensation vs Penalty)'
      }
    ],
    missingProtectiveClauses: [
      {
        name: 'Notice Period Buy-Out Protection',
        whyItMatters: 'Enables you to pay the employer in lieu of serving the 90-day notice period if you get a new job that requires you to join immediately.',
        explanation: 'The current agreement specifies that you *must* serve 90 days but does not explicitly state you have the right to buy out the notice period, which is a standard industry practice in Indian tech companies.',
        suggestedIndianDraft: 'The Employee shall have the option to buy out the notice period or any remaining portion thereof by paying the gross salary equivalent for the unserved period.'
      },
      {
        name: 'Force Majeure Protection',
        whyItMatters: 'Protects you from default if you cannot work due to an act of God, pandemic, or government lockout.',
        explanation: 'There is no clause dealing with situations where external factors (like a pandemic lockout) prevent work performance, allowing the employer to declare a breach.',
        suggestedIndianDraft: 'Neither party shall be liable for any delay or failure in performance resulting from acts beyond its reasonable control, including acts of God, pandemics, government actions, or natural disasters.'
      }
    ],
    negotiationSuggestions: [
      'Request to make the notice period mutual (e.g., 60 days for both parties or 30 days for both). A 15-day vs 90-day split is highly inequitable.',
      'Ask to clarify that the Intellectual Property assignment applies only to work done directly in connection with the company\'s business or using the company\'s resources.',
      'State that the non-compete clause must be limited strictly to the duration of active employment, citing Section 27 of the Indian Contract Act, 1872.'
    ],
    financialObligations: [
      {
        type: 'Penalty',
        amount: 'INR 2,00,000',
        details: 'Liquidated damages due to the company if you terminate the agreement within the first 12 months.',
        statutoryLimitNotes: 'Courts only award actual proven damages. A flat ₹2,00,000 recovery without proof of expenditure is legally vulnerable under Section 74 of the Contract Act.'
      }
    ],
    terminationConditions: [
      'Employer can terminate with 15 days written notice or paying 15 days salary.',
      'Employer can terminate instantly for cause (e.g., misconduct, theft, material breach) without notice or pay.',
      'Employee must provide 90 days written notice to resign.'
    ],
    userResponsibilities: [
      'Perform software development duties and report to the engineering lead.',
      'Maintain strict confidentiality regarding Zenith\'s proprietary source code and client details.',
      'Devote full business time to the company and refrain from moonlighting (holding secondary jobs).'
    ],
    otherPartyResponsibilities: [
      'Pay monthly salary by the 5th working day of the subsequent month.',
      'Provide necessary equipment (laptop, office access) for work.',
      'Deduct and deposit appropriate statutory funds (EPF, TDS) with the Government of India.'
    ],
    recommendedClausesToAdd: [
      {
        title: 'Mutual Indemnity Cap',
        draftText: 'Notwithstanding anything to the contrary, the Employee\'s total liability under this agreement, except in cases of gross negligence or willful misconduct, shall be capped at the total remuneration received by the Employee in the preceding 6 months.',
        benefit: 'Limits your financial liability if the company sues you for a work mistake, preventing personal bankruptcy.',
        applicableIndianLaw: 'Section 73 of the Indian Contract Act, 1872'
      }
    ],
    riskTimeline: {
      duringAgreement: [
        'Strict prohibition on moonlighting or side projects, risking immediate termination.',
        'High compliance burden regarding intellectual property tracking.'
      ],
      atRenewal: [
        'No automatic salary increase index; appraisals are at the sole discretion of management.'
      ],
      atTermination: [
        'You have to serve a long 90 days which might make it difficult to join new employers who want quick joiners.',
        'Uncertainty regarding payout of accrued leaves.'
      ],
      afterCompletion: [
        'The invalid 2-year non-compete clause may lead to threat letters if you join a competitor, costing legal fees to defend.',
        'Permanent confidentiality restrictions regarding Zenith code bases.'
      ]
    },
    finalVerdict: '🚨 Review Carefully. While this is a standard employment framework, the 15-day vs 90-day notice period split and the post-employment non-compete are highly unfavorable. Under Section 27 of the Indian Contract Act, 1872, the non-compete is void, but the company could still attempt to harass you. Negotiation is strongly recommended before signing.'
  },

  'Rental Agreement': {
    agreementType: 'Rental Agreement',
    riskPercentage: 58,
    riskLevel: 'Review Carefully',
    summary: 'This is a standard 11-month residential rental agreement for a flat in Mumbai, Maharashtra. It has some unbalanced clauses: an automatic 10% rent escalation on renewal, a high interest penalty (18% per annum) for late payments, and a clause allowing the landlord to forfeit the entire security deposit if you vacate before 6 months. It also places the complete burden of routine structural repairs on the tenant, which is contrary to Maharashtra Rent Control standards.',
    startDate: '2026-06-01',
    endDate: '2027-05-01',
    duration: '11 Months',
    partiesInvolved: [
      'Rajesh Kulkarni (Licensor / Landlord)',
      'Neha Sen (Licensee / Tenant)'
    ],
    importantClauses: [
      {
        name: 'Rent and Security Deposit',
        category: 'Payment',
        originalExtract: 'The Licensee shall pay a monthly rent of INR 45,000 on or before the 5th day of every calendar month. The Licensee has deposited an interest-free security deposit of INR 1,80,000 (4 months rent) with the Licensor, refundable upon vacant possession.',
        plainEnglish: 'Rent is ₹45,000 per month, due by the 5th. You pay a security deposit of ₹1,80,000 which will be returned when you move out without interest.',
        riskRating: 'Low',
        indianStatuteCitation: 'Maharashtra Rent Control Act, 1999 (Registration and Rent terms)'
      },
      {
        name: 'Agreement Registration Fee',
        category: 'Other',
        originalExtract: 'The costs of stamp duty, registration fee, and drafting of this Leave and License Agreement shall be borne equally by both the Licensor and the Licensee.',
        plainEnglish: 'Both you and the landlord will split the costs of stamp duty and registration 50/50. This is standard in Maharashtra.',
        riskRating: 'Low',
        indianStatuteCitation: 'Section 55 of the Maharashtra Rent Control Act, 1999 (Mandatory registration of agreements)'
      }
    ],
    riskyClauses: [
      {
        name: 'Lock-in Period Deposit Forfeiture',
        originalExtract: 'This agreement has a lock-in period of six (6) months. If the Licensee terminates the tenancy or vacates the premises before the expiry of the lock-in period, the entire security deposit of INR 1,80,000 shall stand forfeited by the Licensor.',
        plainEnglish: 'You cannot move out for the first 6 months. If you do, the landlord will steal your entire ₹1,80,000 security deposit, even if you pay rent up to the day you leave.',
        dangerLevel: 'High',
        suggestion: 'Request that the clause be revised so that if you leave early, you are only liable to pay rent for the remaining lock-in period or until a new tenant is found, rather than forfeiting the entire deposit.',
        indianStatuteCitation: 'Section 74 of the Indian Contract Act, 1872 (Unreasonable penalty provisions)'
      },
      {
        name: 'Late Rent Penalty Interest',
        originalExtract: 'In the event of delay in payment of monthly rent, the Licensee shall pay interest at the rate of 18% per annum calculated on a daily basis from the due date until actual payment.',
        plainEnglish: 'If you are late on rent by even a few days, you will be charged 18% interest per year on the unpaid amount.',
        dangerLevel: 'Medium',
        suggestion: 'Negotiate a flat grace period (e.g., up to the 10th of the month) or a reasonable flat late fee (e.g., ₹200 per day) rather than daily compounded high-rate interest.',
        indianStatuteCitation: 'Usurious Loans Act, 1918'
      }
    ],
    missingProtectiveClauses: [
      {
        name: 'Structural Repair Maintenance Obligation',
        whyItMatters: 'Relieves you of financial liability for major building damage (like leaking ceilings, collapsing balconies, or old plumbing).',
        explanation: 'The contract makes the tenant responsible for "all repairs". Under Indian law, the landlord is legally obligated to keep the premises in good structural tenantable condition.',
        suggestedIndianDraft: 'The Licensor shall be responsible for all major and structural repairs (including plumbing leaks, wiring faults, and building painting). The Licensee shall only be responsible for minor day-to-day repairs.'
      },
      {
        name: 'Security Deposit Refund Timeline',
        whyItMatters: 'Prevents the landlord from delaying the refund of your deposit indefinitely after you vacate.',
        explanation: 'The contract says the deposit is refundable "upon vacating" but does not define a strict timeline (e.g., 7 days) or a penalty if the landlord fails to pay.',
        suggestedIndianDraft: 'The Licensor shall refund the security deposit within seven (7) days of the Licensee vacating the premises. Any delay shall attract interest at 12% per annum.'
      }
    ],
    negotiationSuggestions: [
      'Ask the landlord to reduce the lock-in period to 3 months or make it mutual without total deposit forfeiture.',
      'Specify that the 10% rent escalation is subject to renewal negotiations rather than automatic, or negotiate it down to 5% (which is standard in Indian metropolitan cities).',
      'Add a clause that the security deposit refund must happen concurrently with handing over keys on the final day.'
    ],
    financialObligations: [
      {
        type: 'Payment',
        amount: 'INR 45,000 per month',
        details: 'Monthly license fee/rent due by the 5th of each month.',
        statutoryLimitNotes: 'Governed by local rent schedules.'
      },
      {
        type: 'Deposit',
        amount: 'INR 1,80,000',
        details: 'Refundable security deposit paid at start. Interest-free.',
        statutoryLimitNotes: 'Standard practice in Mumbai is 3-6 months rent deposit.'
      },
      {
        type: 'Late Fee',
        amount: '18% interest per annum',
        details: 'Interest penalty applied to late rent payments.',
        statutoryLimitNotes: 'High interest rates can be challenged under Usurious Loans laws.'
      }
    ],
    terminationConditions: [
      'Both parties can terminate after the lock-in period by giving 1 month prior written notice.',
      'Landlord can terminate with 7 days notice if the tenant defaults on rent for two consecutive months.'
    ],
    userResponsibilities: [
      'Pay rent on time and split utility bills (electricity, water, gas, society maintenance).',
      'Maintain the flat interior in clean and hygienic condition.',
      'Refrain from making structural changes (knocking down walls, permanent fixtures) without written permission.'
    ],
    otherPartyResponsibilities: [
      'Ensure uninterrupted access to the flat during the lease term.',
      'Pay municipal property taxes on time to avoid government attachment.',
      'Refund the security deposit in full, subject to deductions for actual damage (excluding normal wear and tear).'
    ],
    recommendedClausesToAdd: [
      {
        title: 'Force Majeure Rent Waiver',
        draftText: 'If the premises are rendered uninhabitable due to an act of God, fire, flood, earthquake, war, or epidemic lockdowns, the rent and all obligations under this agreement shall stand suspended until the premises are made habitable again.',
        benefit: 'Ensures you don\'t have to pay rent if a lockdown or flood prevents you from living in the flat.',
        applicableIndianLaw: 'Section 56 of the Indian Contract Act, 1872 (Doctrine of Frustration)'
      }
    ],
    riskTimeline: {
      duringAgreement: [
        'Risk of high interest if rent is delayed due to salary credit delays.',
        'High cost of repairing old fittings if they break, due to lack of repair clarity.'
      ],
      atRenewal: [
        'Automatic 10% rent hike (rent goes to ₹49,500) which you must accept to continue living there.'
      ],
      atTermination: [
        'Risk of losing ₹1,80,000 if you have to relocate suddenly for a job before 6 months.',
        'Landlord making arbitrary deductions from the security deposit for painting or cleaning.'
      ],
      afterCompletion: [
        'No liabilities remain except returning the keys and obtaining the refunded security deposit.'
      ]
    },
    finalVerdict: '⚠ Review Carefully. The agreement is mostly standard for Mumbai rent license schemes, but the early forfeiture of the security deposit during the lock-in period and the lack of a landlord structural repair clause represent moderate risks. Ask the landlord to include a 7-day refund timeline and split repair costs.'
  },

  'Internship Agreement': {
    agreementType: 'Internship Agreement',
    riskPercentage: 35,
    riskLevel: 'Review Carefully',
    summary: 'A 3-month stipend-based software internship contract for a remote role in New Delhi. It offers a modest monthly stipend. However, it contains an extremely strict intellectual property transfer and a clause that allows the startup to terminate your internship instantly without notice or explanation, while requiring you to pay a fine if you leave early.',
    startDate: '2026-06-15',
    endDate: '2026-09-15',
    duration: '3 Months',
    partiesInvolved: [
      'Vikas AI Labs Private Limited (Company)',
      'Riya Kapoor (Intern)'
    ],
    importantClauses: [
      {
        name: 'Stipend Structure',
        category: 'Payment',
        originalExtract: 'The Company shall pay the Intern a consolidated monthly stipend of INR 10,000. Payment is contingent upon the submission of weekly task reports and approval by the supervisor.',
        plainEnglish: 'You get ₹10,000 per month, but the company can hold it if they decide your weekly task reports are not detailed enough.',
        riskRating: 'Medium',
        indianStatuteCitation: 'Section 2(g) of the Indian Contract Act, 1872'
      },
      {
        name: 'Intellectual Property Rights',
        category: 'Other',
        originalExtract: 'All rights, title, and interest in and to any work product, code, designs, or documentation created by the Intern during the internship shall vest solely in the Company.',
        plainEnglish: 'Any code you write during the internship belongs to the company. This is standard.',
        riskRating: 'Low',
        indianStatuteCitation: 'Section 17 of the Copyright Act, 1957'
      }
    ],
    riskyClauses: [
      {
        name: 'Early Exit Penalty',
        originalExtract: 'If the Intern terminates this agreement or ceases participation in the internship program prior to the 3-month term without 30 days notice, the Intern shall forfeit all accrued stipends and pay an administrative fine of INR 10,000.',
        plainEnglish: 'If you quit without giving a full 30 days notice, you lose any unpaid stipends and must write the company a cheque for ₹10,000.',
        dangerLevel: 'High',
        suggestion: 'Ask to remove the administrative fine. Since this is an internship, a shorter notice period (e.g., 7 days) without financial penalty is the fair standard.',
        indianStatuteCitation: 'Section 74 of the Indian Contract Act, 1872 (Unlawful penal clauses)'
      },
      {
        name: 'One-Sided Instant Termination',
        originalExtract: 'The Company reserves the right to terminate the Intern\'s engagement at any time, for any reason or no reason, with immediate effect, without any notice period or compensation.',
        plainEnglish: 'The company can fire you instantly at any time, without warning, and doesn\'t have to pay you anything except for days worked.',
        dangerLevel: 'Medium',
        suggestion: 'Ask for a mutual 7-day notice period so you have some security and time to hand over tasks.',
        indianStatuteCitation: 'Principles of Natural Justice / Contractual equity'
      }
    ],
    missingProtectiveClauses: [
      {
        name: 'Certificate of Completion Guarantee',
        whyItMatters: 'Ensures you receive your internship experience certificate, which is the main career benefit of doing an internship.',
        explanation: 'There is no clause stating that the company *must* provide an experience certificate upon successful completion of the term.',
        suggestedIndianDraft: 'Upon completion of the 3-month internship term, the Company shall issue an Internship Experience Certificate detailing the Intern\'s role and projects.'
      }
    ],
    negotiationSuggestions: [
      'Delete the ₹10,000 fine for early exit. It is inappropriate for an internship.',
      'Request a mutual 7-day notice period instead of immediate termination for the company.',
      'Ensure the stipend is paid unconditionally by a specific date (e.g., the 7th of every month).'
    ],
    financialObligations: [
      {
        type: 'Payment',
        amount: 'INR 10,000 monthly stipend',
        details: 'Paid to you, subject to supervisor task approval.',
        statutoryLimitNotes: 'Not subject to minimum wage laws as interns are not classified as employees in India.'
      },
      {
        type: 'Penalty',
        amount: 'INR 10,000 fine',
        details: 'Admin fine due from you if you resign without a 30-day notice.',
        statutoryLimitNotes: 'Unenforceable penalty under Section 74 of the Contract Act.'
      }
    ],
    terminationConditions: [
      'Company can terminate you immediately at any time.',
      'Intern must provide 30 days notice to leave without penalty.'
    ],
    userResponsibilities: [
      'Work 40 hours per week remotely.',
      'Submit weekly task reports and attend stand-up calls.',
      'Do not share internal company documents or repositories with third parties.'
    ],
    otherPartyResponsibilities: [
      'Provide guidance/mentorship.',
      'Pay the ₹10,000 monthly stipend.',
      'Issue an internship completion letter.'
    ],
    recommendedClausesToAdd: [
      {
        title: 'Academic Credit Coordination',
        draftText: 'The Company agrees to provide necessary evaluations and documents required by the Intern\'s college or university for academic credits.',
        benefit: 'Guarantees your college accepts the internship for academic credits.',
        applicableIndianLaw: 'UGC Internship Guidelines, 2023'
      }
    ],
    riskTimeline: {
      duringAgreement: [
        'Risk of delayed stipend if tasks are deemed unsatisfactory by the supervisor.'
      ],
      atRenewal: [
        'No renewal clause; any extension requires a fresh contract.'
      ],
      atTermination: [
        'Immediate dismissal risk with zero notice or payout.'
      ],
      afterCompletion: [
        'Perpetual IP assignment and confidentiality duties.'
      ]
    },
    finalVerdict: '✅ Safe To Sign (With Modifications). The internship represents low overall risk, but the early exit fine of ₹10,000 and the lack of a certificate guarantee are issues. Request the removal of the fine and add a certificate release clause before signing.'
  },

  'Divorce Agreement': {
    agreementType: 'Divorce Agreement',
    riskPercentage: 45,
    riskLevel: 'Review Carefully',
    summary: 'A Mutual Consent Divorce Settlement Agreement under Section 13B of the Hindu Marriage Act, 1955. It lays down terms for alimony, asset division, and child custody. While it covers major points, it contains vague visitation rules ("reasonable visitation") which frequently lead to future disputes, and lacks a clause specifying who pays for the child\'s major future expenses (like overseas college education or weddings).',
    startDate: '2026-05-15',
    endDate: 'Permanent',
    duration: 'Permanent (Post-Divorce Decree)',
    partiesInvolved: [
      'Siddharth Verma (Husband)',
      'Pooja Verma (Wife)'
    ],
    importantClauses: [
      {
        name: 'Permanent Alimony Payout',
        category: 'Payment',
        originalExtract: 'The Husband shall pay to the Wife a one-time lump sum of INR 15,00,000 (Fifteen Lakhs only) as full and final permanent alimony, maintenance, and child support, paid via Demand Draft at the time of recording the second motion.',
        plainEnglish: 'The husband will pay a single lump sum of ₹15,00,000 during the final court hearing. This covers all future maintenance for the wife and child.',
        riskRating: 'Low',
        indianStatuteCitation: 'Section 25 of the Hindu Marriage Act, 1955 (Permanent alimony and maintenance)'
      },
      {
        name: 'Withdrawal of Pending Cases',
        category: 'Other',
        originalExtract: 'Both parties agree to unconditionally withdraw all pending allegations, police complaints (including FIR under Section 498A IPC), and maintenance suits within 30 days of signing this agreement.',
        plainEnglish: 'Both parties will close all ongoing court fights and police complaints, including dowry/harassment cases (498A), within 30 days.',
        riskRating: 'Medium',
        indianStatuteCitation: 'Section 482 of the Code of Criminal Procedure, 1973 (Quashing of 498A FIRs)'
      }
    ],
    riskyClauses: [
      {
        name: 'Vague Child Visitation Rights',
        originalExtract: 'The Husband shall have reasonable visitation rights to meet the minor child, Kabir Verma, at mutually convenient times and locations, with prior notice of 24 hours to the Wife.',
        plainEnglish: 'The husband can see the child at "convenient times". The term "reasonable" is not defined.',
        dangerLevel: 'Medium',
        suggestion: 'Specify exact dates, weekends (e.g., alternate Saturdays 10 AM to 5 PM), and split holiday schedules (e.g., half of Diwali and summer breaks) to avoid custody conflicts.',
        indianStatuteCitation: 'Guardians and Wards Act, 1890'
      },
      {
        name: 'Waiver of Child\'s Right to Maintenance',
        originalExtract: 'The Wife agrees on behalf of the minor child that the alimony of INR 15,00,000 covers all child expenses, and the child shall have no future claims for maintenance or inheritance against the Husband.',
        plainEnglish: 'The mother agrees that the child can never ask the father for more money or claim inheritance in his property.',
        dangerLevel: 'High',
        suggestion: 'Delete this waiver. Under Indian law, a mother cannot contract away a minor child\'s independent statutory right to claim maintenance or education costs from the father if circumstances change.',
        indianStatuteCitation: 'Section 26 of the Hindu Marriage Act, 1955 & Section 125 of CrPC'
      }
    ],
    missingProtectiveClauses: [
      {
        name: 'Major Future Educational Cost Sharing',
        whyItMatters: 'Guarantees that the father will contribute to high future costs like professional college fees, coaching classes, or medical emergencies.',
        explanation: 'The lump sum of ₹15,00,000 may not be sufficient in 10-15 years due to education inflation. The agreement is missing a cost-sharing formula for major milestones.',
        suggestedIndianDraft: 'Both parties agree to split the child\'s higher education and medical emergency expenses in a 50:50 ratio, subject to mutual consultation regarding institutions.'
      }
    ],
    negotiationSuggestions: [
      'Replace "reasonable visitation" with a detailed calendar schedule including birthdays and festivals.',
      'Ensure the alimony Demand Draft is handed over directly inside the family court room during the recording of the second motion statements.',
      'Remove clauses seeking to waive the child\'s future statutory maintenance rights, as they are legally invalid in India anyway.'
    ],
    financialObligations: [
      {
        type: 'Payment',
        amount: 'INR 15,00,000 (Lump sum)',
        details: 'Paid by Husband to Wife via Demand Draft at final hearing.',
        statutoryLimitNotes: 'Standard mutual consent settlement.'
      }
    ],
    terminationConditions: [
      'This agreement is binding and permanent once the court passes the decree of divorce under Section 13B(2).'
    ],
    userResponsibilities: [
      'Cooperate in appearing before the Family Court for the first and second motions.',
      'Withdraw the pending domestic violence and maintenance claims.',
      'Ensure the child is available for scheduled visits.'
    ],
    otherPartyResponsibilities: [
      'Pay the ₹15,00,000 alimony at the second motion.',
      'Withdraw all cross-allegations and criminal complaints.',
      'Refrain from interfering in the personal life of the other party post-divorce.'
    ],
    recommendedClausesToAdd: [
      {
        title: 'Indemnity against Pre-Existing Debts',
        draftText: 'Each party declares that they have not incurred any debts or liabilities in the name of the other, and agrees to indemnify the other if any creditor raises a claim for individual debts.',
        benefit: 'Protects you if your ex-spouse ran up credit card bills in your name during the marriage.',
        applicableIndianLaw: 'Section 124 of the Indian Contract Act, 1872'
      }
    ],
    riskTimeline: {
      duringAgreement: [
        'Risk of one party refusing to appear for the second motion (which happens after a 6-month cooling period) after receiving concessions.'
      ],
      atRenewal: [
        'Not applicable (Permanent agreement).'
      ],
      atTermination: [
        'Legal costs to enforce custody rights if terms are breached.'
      ],
      afterCompletion: [
        'Permanent waiver of marital rights, but child custody and maintenance can be reopened by court if child\'s welfare requires it.'
      ]
    },
    finalVerdict: '⚠ Review Carefully. Mutual consent divorces under Section 13B are highly structured. The payment term is safe (using Demand Draft in court), but the child visitation schedule must be drafted with precise timings, and child waiver clauses should be deleted as they are void under Indian precedent.'
  },

  'Freelance Contract': {
    agreementType: 'Freelance Contract',
    riskPercentage: 78,
    riskLevel: 'High Risk',
    summary: 'A freelance mobile app development contract for a startup in Chennai, Tamil Nadu. It has severe issues: it forces the freelancer to provide unlimited revisions, imposes a heavy delay penalty of ₹2,000 per day without proof of actual loss, and transfers all source code copyright to the client immediately upon creation, before you have even received a single rupee of payment.',
    startDate: '2026-06-10',
    endDate: 'On Project Completion',
    duration: 'Approx. 2 Months (Est.)',
    partiesInvolved: [
      'Solvify Tech Solutions (Client)',
      'Kabir Das (Freelancer / Developer)'
    ],
    importantClauses: [
      {
        name: 'Scope of Work & Revisions',
        category: 'Other',
        originalExtract: 'The Developer shall build the mobile application as per the specifications in Annexure A. The Developer agrees to make all necessary revisions and modifications requested by the Client until final approval is obtained.',
        plainEnglish: 'You must build the app as written. However, you are forced to make unlimited edits for free until the client is perfectly happy.',
        riskRating: 'High',
        indianStatuteCitation: 'Section 2(d) of the Indian Contract Act, 1872'
      },
      {
        name: 'Milestone Payments',
        category: 'Payment',
        originalExtract: 'The total project fee is INR 1,50,000, payable in three milestones: 20% advance, 40% on beta delivery, and 40% on final App Store launch. Payments shall be made within 30 days of invoice receipt.',
        plainEnglish: 'Total fee is ₹1.5 Lakhs. You get 20% upfront, 40% on beta release, and the final 40% when it goes live on the App Store. The client has a long 30 days to pay after you send invoices.',
        riskRating: 'Medium',
        indianStatuteCitation: 'Section 55 of the Indian Contract Act, 1872 (Time of performance)'
      }
    ],
    riskyClauses: [
      {
        name: 'Intellectual Property Transfer Before Payment',
        originalExtract: 'Upon creation of any code, graphic, or design in connection with this project, all intellectual property rights and copyrights shall instantly vest in the Client, who shall have the sole right to modify and publish the same.',
        plainEnglish: 'The client owns all your code the second you write it, even if they never pay your milestones or decide to cancel the contract midway.',
        dangerLevel: 'Critical',
        suggestion: 'Modify this so that the copyright is only transferred to the client *upon receipt of full and final payment* of the contract amount. This prevents clients from stealing code and vanishing.',
        indianStatuteCitation: 'Section 19 of the Copyright Act, 1957 (Assignment of copyright conditions)'
      },
      {
        name: 'Heavy Daily Delay Penalty',
        originalExtract: 'Time is of the essence in this agreement. If the Developer fails to deliver the final application by the agreed deadline of August 15, 2026, the Developer shall pay a late penalty of INR 2,000 per day of delay to the Client.',
        plainEnglish: 'If you are late by even one day, you have to pay a ₹2,000 fine. If you are 3 weeks late, you lose ₹42,000 (nearly 30% of your total contract value).',
        dangerLevel: 'High',
        suggestion: 'Negotiate to delete this penalty. Under Indian law, daily penalties are treated as punitive and void unless the client can prove actual financial loss. Alternatively, cap the late penalty at 5% of the total contract value and add a grace period for client review delays.',
        indianStatuteCitation: 'Sections 73 and 74 of the Indian Contract Act, 1872 (Liquidated damages vs penalties)'
      }
    ],
    missingProtectiveClauses: [
      {
        name: 'Intellectual Property Ownership Retention (Until Payment)',
        whyItMatters: 'Protects you from having your code used or sold by the client without receiving payment.',
        explanation: 'The contract has no IP withholding mechanism, meaning you have no leverage if the client defaults on the final payment.',
        suggestedIndianDraft: 'Ownership and copyright of all source code, assets, and deliverables shall remain with the Developer, and shall only transfer to the Client upon receipt of the final payment of INR 60,000.'
      },
      {
        name: 'Limitation of Liability Cap',
        whyItMatters: 'Limits how much money the client can sue you for if the app breaks (e.g. bugs leading to loss of business).',
        explanation: 'There is no liability cap. If a bug in your code causes a client\'s server to crash and they lose business, they could theoretically sue you for lakhs, far exceeding your ₹1.5 Lakh fee.',
        suggestedIndianDraft: 'Neither party shall be liable for indirect or consequential damages. The Developer\'s maximum liability for any claims under this agreement shall be capped at 100% of the fees actually paid to the Developer.'
      }
    ],
    negotiationSuggestions: [
      'Limit revisions to a maximum of 3 rounds. Additional revisions should be billed hourly or at a flat rate of ₹5,000 per round.',
      'Add a clause that deadlines will be automatically extended by any number of days that the client takes to respond, provide assets, or approve milestones.',
      'Cap the late penalty at a maximum of 5% of the contract value, and state that penalties are only applicable if the delay is solely attributable to the developer.'
    ],
    financialObligations: [
      {
        type: 'Payment',
        amount: 'INR 1,50,000 (Milestone base)',
        details: 'Received by developer. 20% advance, 40% beta, 40% production.',
        statutoryLimitNotes: 'Standard commercial contract.'
      },
      {
        type: 'Penalty',
        amount: 'INR 2,00,000 maximum potential penalty',
        details: '₹2,000 per day penalty for late delivery.',
        statutoryLimitNotes: 'Vulnerable under Section 74 of the Contract Act if deemed punitive.'
      }
    ],
    terminationConditions: [
      'Client can terminate with 7 days notice if the developer fails to meet milestone standards.',
      'Developer can terminate with 14 days notice if payments are delayed by more than 15 days.'
    ],
    userResponsibilities: [
      'Deliver working source code and assets as per specs.',
      'Provide 30 days of post-launch bug support (warranty).',
      'Refrain from using unlicensed third-party code.'
    ],
    otherPartyResponsibilities: [
      'Provide API documentation, server credentials, and design files on time.',
      'Pay invoices within 30 days of delivery.',
      'Review and approve milestones within 5 working days of submission.'
    ],
    recommendedClausesToAdd: [
      {
        title: 'Interest on Delayed Payments',
        draftText: 'Any invoice unpaid by the Client after the 30-day grace period shall accrue interest at the rate of 12% per annum from the due date until paid.',
        benefit: 'Forces the client to pay your milestones on time and compensates you for payment delays.',
        applicableIndianLaw: 'Interest Act, 1978'
      }
    ],
    riskTimeline: {
      duringAgreement: [
        'Risk of work creep due to unlimited revisions requests.',
        'Delayed milestones if client takes too long to review, pushing out your final payment.'
      ],
      atRenewal: [
        'Not applicable.'
      ],
      atTermination: [
        'Client holding the final 40% payment while using your code since they already own the IP.'
      ],
      afterCompletion: [
        'Indefinite liability for code bugs if a liability cap is not added.'
      ]
    },
    finalVerdict: '🚨 Avoid Signing Until Revised. The immediate transfer of copyright before payment, combined with a daily delay penalty and unlimited revision requirements, represents a high-risk commercial contract. Do not start work until the IP transfer is tied to receipt of full payment, revisions are capped, and a liability limitation is added.'
  },

  'Chennai Rental Agreement': {
    agreementType: 'Rental Agreement',
    riskPercentage: 62,
    riskLevel: 'Review Carefully',
    summary: 'This is a detailed compliance audit of the residential Lease Agreement entered into by and between Mrs. T.Shri Manoj (Lessor) and Mr. Thanikaimalai (Lessee). The terms specify a lease tenure of 11 months, commencing on 01st DAY OF NOVEMBER 2023 and concluding/expiring on 30th September 2024. The audit flagged a daily delay penalty rate of INR 500 for delayed rent payments, which is high and potentially punitive under Section 74 of the Indian Contract Act, 1872.',
    startDate: '01st DAY OF NOVEMBER 2023',
    endDate: '30th September 2024',
    duration: '11 months',
    partiesInvolved: [
      'Mrs. T.Shri Manoj (Lessor)',
      'Mr. Thanikaimalai (Lessee)'
    ],
    importantClauses: [
      {
        name: 'Rent and Security Deposit',
        category: 'Payment',
        originalExtract: 'The monthly rent shall be INR 15,000 (Rupees Fifteen Thousand Only), payable on or before the 5th of every English calendar month. A security deposit of INR 75,000 (Rupees Seventy Five Thousand Only) shall be paid by the LESSEE to the LESSOR, which shall be interest-free and refundable at the time of vacating the premises.',
        plainEnglish: 'Rent is ₹15,000 per month, due by the 5th. You pay a refundable security deposit of ₹75,000 upon vacating without interest.',
        riskRating: 'Low',
        indianStatuteCitation: 'Section 105 of the Transfer of Property Act, 1882'
      },
      {
        name: 'Termination Notice Period',
        category: 'Termination',
        originalExtract: 'Either party can terminate this agreement by giving 30 days written notice to the other.',
        plainEnglish: 'Both you and the landlord must give at least 30 days notice in writing before ending the lease early.',
        riskRating: 'Low',
        indianStatuteCitation: 'Section 106 of the Transfer of Property Act, 1882'
      }
    ],
    riskyClauses: [
      {
        name: 'Daily Delayed Rent Penalty',
        originalExtract: 'If the rent is delayed by more than 10 days, a penalty of INR 500 per day shall apply.',
        plainEnglish: 'If your rent is delayed by more than 10 days, you will be penalized ₹500 for every single day of delay.',
        dangerLevel: 'High',
        suggestion: 'Under Section 74 of the Indian Contract Act, arbitrary penalties are void unless the claiming party can prove actual financial loss. Ask to reduce this daily penalty to a reasonable rate or a flat late fee.',
        indianStatuteCitation: 'Section 74 of the Indian Contract Act, 1872'
      }
    ],
    missingProtectiveClauses: [
      {
        name: 'Limitation of Liability Cap',
        whyItMatters: 'Limits your financial exposure if something goes wrong, protecting your personal assets.',
        explanation: 'The contract is missing an explicit cap on your liability, leaving you open to uncapped damages claims under Section 73 of the Indian Contract Act.',
        suggestedIndianDraft: 'Notwithstanding anything to the contrary, the Lessee\'s maximum liability under this agreement shall be capped at 100% of the total security deposit.'
      }
    ],
    negotiationSuggestions: [
      'Negotiate the daily late fee penalty down to a reasonable flat fee, citing Section 74 of the Indian Contract Act.',
      'Request a mutual notice period (e.g. 30 days for both sides) to ensure fairness.',
      'Ensure all maintenance and major repair charges are clearly allocated to the Lessor.'
    ],
    financialObligations: [
      {
        type: 'Payment',
        amount: 'INR 15,000 monthly',
        details: 'Monthly lease rent.',
        statutoryLimitNotes: 'Commercial parameters.'
      },
      {
        type: 'Deposit',
        amount: 'INR 75,000',
        details: 'Refundable security deposit.',
        statutoryLimitNotes: 'To be refunded upon vacancy.'
      },
      {
        type: 'Penalty',
        amount: 'INR 500 per day',
        details: 'Late rent penalty after 10 days delay.',
        statutoryLimitNotes: 'Subject to Section 74 verification.'
      }
    ],
    terminationConditions: [
      'Either party can terminate this agreement by giving 30 days written notice.'
    ],
    userResponsibilities: [
      'Pay monthly lease rent by the 5th of each month.',
      'Do not sublet or make structural modifications without approval.',
      'Keep the residential premises in tenantable condition.'
    ],
    otherPartyResponsibilities: [
      'Provide peaceful possession of the residential property.',
      'Refund security deposit of INR 75,000 upon vacancy.'
    ],
    recommendedClausesToAdd: [
      {
        title: 'Force Majeure Suspension',
        draftText: 'Neither party shall be liable for any delay or failure in performing its obligations under this Agreement if such delay is caused by acts of God, war, lockouts, or pandemics.',
        benefit: 'Protects you from default claims if external force majeure factors make occupancy impossible.',
        applicableIndianLaw: 'Section 56 of the Indian Contract Act, 1872'
      }
    ],
    riskTimeline: {
      duringAgreement: [
        'Pay rent on time to avoid the late penalty.',
        'Strict compliance with structural alteration restrictions.'
      ],
      atRenewal: [
        'Renegotiate terms and rent escalate parameters.'
      ],
      atTermination: [
        'Provide 30 days prior written notice.',
        'Ensure clean vacating of premises to obtain full deposit refund.'
      ],
      afterCompletion: [
        'Confidentiality and other survival obligations remain.'
      ]
    },
    finalVerdict: '🚨 Review Carefully. While it is a standard rental framework, the INR 500/day late penalty is high and punitive. Under Section 74 of the Indian Contract Act, such penalties are void unless actual loss is proven, but it is best to negotiate a flat reasonable cap before signing.'
  }
};

export function getMockReport(type: string): AnalysisReport {
  return mockAgreements[type] || mockAgreements['Employment Agreement'];
}
