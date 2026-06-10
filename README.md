# NovaLens – AI Legal Intelligence Platform 🇮🇳

## Transform Complex Contracts into Clear Legal Insights

NovaLens is an AI-powered legal intelligence platform designed to help individuals, tenants, freelancers, employees, startup founders, and consumers understand legal agreements before signing them.

Instead of reading pages of legal jargon, users can upload a contract and instantly receive a structured legal audit based on Indian laws, including risk assessments, statutory references, financial obligations, and actionable recommendations.

---

## Problem Statement

Most people sign contracts without fully understanding:

* Hidden liabilities
* Unfair clauses
* Financial penalties
* Renewal traps
* Legal obligations
* Missing legal protections

Legal consultation is often expensive, inaccessible, or time-consuming.

NovaLens bridges this gap by providing instant AI-powered contract analysis tailored for Indian legal frameworks.

---

## Solution

NovaLens analyzes contracts and generates an easy-to-understand legal report that includes:

* Contract Risk Score
* Plain-English Summary
* Clause-by-Clause Legal Analysis
* Indian Statutory References
* Financial Obligations Breakdown
* Responsibility Mapping
* Missing Protection Detection
* Risk Timeline Visualization

The platform helps users make informed decisions before signing important agreements.

---

## Key Features

### AI Legal Verdict Engine

Provides an overall legal verdict:

* Safe
* Caution
* High Risk
* Avoid

with detailed reasoning.

### Plain-English Contract Summary

Transforms legal jargon into simple, understandable explanations.

### Circular Risk Gauge

Visual representation of overall contract risk percentage.

### Risk Factor Analysis

Highlights problematic clauses and explains why they may be risky.

### Indian Law Citation Engine

Maps clauses to applicable legal provisions, including:

* Indian Contract Act, 1872
* Information Technology Act, 2000
* RERA Guidelines
* State Rent Control Regulations

### Responsibilities Matrix

Clearly separates:

* Your Responsibilities
* Other Party Responsibilities

### Financial Obligations Dashboard

Tracks:

* Deposits
* Fees
* Penalties
* Interest Charges
* Cancellation Costs

### Signature Protection Auditor

Identifies missing safeguards such as:

* Liability Caps
* Force Majeure Clauses
* Termination Protections
* Indemnity Balancing

and suggests legally structured replacement language.

### Contract Risk Timeline

Visualizes legal risks across:

* Contract Start
* Active Period
* Renewal
* Termination
* Post-Term Obligations

### OCR Document Processing

Supports:

* PDF
* DOCX
* JPG
* PNG

using integrated OCR technology.

### Demo Mode

Built-in local evaluation system allowing judges to test the platform instantly without configuration.

---

## Technology Stack

### Frontend

* Next.js 14+
* React 19
* TypeScript
* Tailwind CSS v4

### Backend

* Next.js API Routes
* OpenAI-Compatible APIs

### Database & Authentication

* Supabase
* Supabase Auth

### Document Processing

* Tesseract.js
* pdf-parse
* mammoth

### UI Components

* Lucide Icons
* Custom SVG Visualizations
* Interactive Timelines
* Glassmorphism Design System

---


## Architecture

User Upload
↓
Document Extraction
↓
OCR / Parsing Engine
↓
AI Legal Analysis
↓
Indian Law Mapping
↓
Risk Assessment Engine
↓
Interactive Legal Report

---
## 📂 Project Structure

```text
novalens/
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Responsive navbar, banner, & footer shell
│   │   ├── page.tsx           # Premium SaaS Landing Page with FAQs & interactive preview
│   │   ├── dashboard/         # Stat metrics and report logs
│   │   ├── analyze/           # Dropzone, category selector, & OCR progress bars
│   │   ├── reports/
│   │   │   └── [id]/          # Audit dashboard (Speedometers, timelines, tabs)
│   │   └── api/
│   │       └── analyze/       # Server-side parsing & structured AI prompts
│   ├── components/
│   │   └── Layout/            # Responsive Navbar, Alert banners, and Footers
│   ├── lib/
│   │   ├── ocr.ts             # Client-side Tesseract.js worker
│   │   ├── supabase.ts        # Client config with transparent local storage fallback
│   │   └── mockData.ts        # Realistically drafted Indian legal analysis sets
│   └── types/
│       └── index.ts           # Typescript schemas
├── .env.example               # Environment variables template
└── package.json
```
## Demo Credentials

No login required.

Use the built-in Demo Mode to instantly test the platform.

---

## Judge Quick Start

1. Open the application.
2. Click "View Demo".
3. Load sample contract data.
4. Review generated legal analysis.
5. Explore risk scores, timelines, and statutory citations.

No setup required.

---

## Innovation Highlights

* Indian-law-specific legal intelligence
* AI-generated legal explanations for non-lawyers
* Missing-clause protection auditing
* Interactive risk timeline visualization
* OCR-powered document ingestion
* Zero-configuration demo environment

---

## Future Scope

* Multilingual Legal Analysis
* E-Sign Verification
* Legal Compliance Monitoring
* Contract Comparison Engine
* Enterprise Contract Management
* Lawyer Review Marketplace

---

## Impact

NovaLens empowers everyday people to understand legal agreements before committing to them, reducing legal risk and improving access to legal knowledge.

---

## Team

Team Name: NovaLens

HackIndia Vibe Coding Hackathon 2026

Built using AI-first development principles and modern legal intelligence workflows.

---

## Demo Video
https://drive.google.com/file/d/1Nj-USZdgdzPZAjAHWlGj2nZZ9P3lCSFw/view?usp=sharing




