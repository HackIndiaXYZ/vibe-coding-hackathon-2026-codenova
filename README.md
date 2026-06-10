# NovaLens - AI Legal Intelligence Platform (Indian Law Edition)

NovaLens is a premium, production-ready AI Legal Intelligence Platform that helps ordinary people audit and demystify complex legal contracts and agreements before signing. 

The application is tailored specifically to evaluate terms, liabilities, and obligations under the **Indian Constitution and Indian statutes** (e.g., the Indian Contract Act, 1872, RERA, Information Technology Act, 2000, and state Rent Control acts).

---

## 🚀 Key Product Features

1. **AI Legal Verdict (Safe, Caution, High Risk, Avoid)**: Prominent risk indicator categorizing contracts with clear legal reasoning.
2. **Layman's Simple Summary**: Explains legal terminology in plain-English paragraphs.
3. **Circular Risk Gauge & Bulleted Risk Factors**: Displays risk percentages alongside list details explaining why scores were assigned.
4. **Indian Statutory Citations**: Links audited clauses directly to specific legal sections (e.g., *Section 27 of the Indian Contract Act for restraint of trade*).
5. **Two-Column Responsibilities breakdown**: Splits obligations ("Your Responsibilities" vs "Other Party's Obligations").
6. **Financial Fees & Penalties ledger**: Tabulates deposits, delay interests, or cancelation costs.
7. **Signature Protections Auditor (Signature Feature)**: Audits contracts for missing safety nets (like missing liability caps or force majeure clauses) and provides copyable drafted text compliant with Indian law.
8. **Risk Timelines**: Chronological roadmap of risks during, at renewal, at termination, and after the contract's term.
9. **Built-in OCR (Tesseract.js)**: Runs client-side text scans of PNG/JPG contract images in real time with progress trackers.
10. **Zero-Config Sandbox & Judge Demo Mode**: Evaluates documents out of the box using `localStorage` and a local matching rules engine, providing immediate testing without any setup.

---

## 🛠 Tech Stack

- **Framework**: Next.js 14+ (App Router, Tailwind CSS v4, TypeScript, React 19)
- **Database & Auth**: Supabase REST + Supabase Auth
- **AI Processing**: OpenAI / OpenAI-compatible API endpoints
- **Document Processing**: Tesseract.js (OCR), mammoth (DOCX text), pdf-parse (PDF text)
- **Visuals**: Lucide Icons, Custom animated SVG Speedometers, CSS Timelines, glassmorphism templates

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

---

## ⚙️ Running Locally

Follow these quick commands to test the application:

1. **Set Active Workspace**:
   Instruct your editor/terminal to target the project directory:
   ```bash
   cd C:\Users\shria\.gemini\antigravity\scratch\novalens
   ```

2. **Verify Dependencies**:
   Ensure all packages are installed:
   ```bash
   npm install
   ```

3. **Run Development Server**:
   Start the Next.js development server:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to [http://localhost:3000](http://localhost:3000).

4. **Launch Demo Mode**:
   - Go to the **Landing Page** and click **View Demo** to see an interactive mock evaluation.
   - Go to the **Dashboard** and click **Pre-Load Demo Data** (or click presets on the upload page) to instantly populate your dashboard with Indian legal reports.

---

## 🔗 Connecting Live Credentials (Optional)

To connect the application to your cloud infrastructure:

1. Duplicate `.env.example` to `.env.local` inside `novalens/`.
2. To hook up the database: Create a Supabase project, initialize an `agreements` table matching the schema, and copy the Project URL and Anon Key.
3. To hook up live AI: Enter your `OPENAI_API_KEY`. You can also target alternative models or local LLM bases by adjusting the URL.
