# GradGuide Course Recommendation Assistant — Technical & Product Write-Up

**Candidate Assessment Submission** | Target: Option 3 (Course Recommendation Assistant)  
**Submission Recipient:** fayola.m@gradguide.in | **Submission Due Date:** October 9th, 2026  
**Repository & App:** GradGuide Advisor Co-Pilot (Next.js 14 App Router, TypeScript, Tailwind CSS)  

---

## 1. The Core Counselling Problem & Consistency Challenge

In study-abroad counselling, recommendation variance is a critical operational bottleneck. Two students with nearly identical profiles (e.g., 3.4 GPA, IELTS 7.5, $40k budget) often receive disparate course lists depending on which counsellor conducts the session. Counsellors must juggle real-time student dialogue, disparate foreign currency tuition figures, embassy proof-of-funds regulations, and changing intake deadlines.

**Our Objective:** Provide an AI-powered, real-time decision-support co-pilot that establishes **recommendation consistency and algorithmic objectivity** without undermining counsellor agency and clinical discretion.

---

## 2. Live Meeting Experience & Interaction Model

* **Dual-View Co-Pilot Architecture:** The application runs side-by-side with Google Meet sessions. The left viewport simulates the live Meet call (displaying participant status, audio waveform, and live transcript feed), while the right viewport renders the live decision engine.
* **Non-Disruptive Interaction:** Counsellors do not need to manually navigate away or fill multi-step filter forms while talking. Notes taken in the live scratchpad or spoken over the microphone automatically trigger instant background extraction and auto-update recommendations in real time.

---

## 3. Product Architecture & Key Design Decisions

### A. How the Student Profile is Captured & Incomplete Information Handling
* **Profile Ingestion:** Combines regex/NLP tokenization (`src/lib/noteExtractor.ts`) and Web Speech recognition. It extracts GPA (4.0 & 10.0 CGPA), IELTS/TOEFL/GRE scores, budgets, preferred destinations, work experience, and STEM preferences.
* **Incomplete Information Strategy:** In live calls, students rarely share complete information upfront. If GPA is missing, the engine applies an average baseline while surfacing an **`Incomplete Profile Warning`**. If test scores (IELTS/TOEFL) are unstated, it displays a reminder to verify English waivers rather than dropping valid courses. If budget is unspecified, it defaults to showing all viable programs ranked by academic fit.

### B. Course Matching & Ranking Algorithm
Courses are evaluated via a deterministic, weighted scoring algorithm (`src/lib/recommendationEngine.ts`):
1. **Academic Fitness (35 pts):** Differential between normalized candidate GPA and university baseline GPA threshold.
2. **Language Proficiency (20 pts):** Evaluation against university minimum IELTS/TOEFL cutoff.
3. **Professional Background (15 pts):** Work experience credit against program prerequisites.
4. **Financial Solvency (15 pts):** Comparison of annual/total tuition against student budget.
5. **Institutional Selectivity (15 pts):** University acceptance rate calibration.

### C. Recommendation Explainability
Every course card displays an interactive **Smart Admission Breakdown** detailing exact point allocations across GPA, English, Work Exp, and Selectivity, alongside explicit **"Why This Course?"** rationale (Academic Fit, Visa Advantage, Financial Alignment, Career Outcomes).

### D. Course Knowledge Base Structure & Updates
* **Schema (`src/types/course.ts`):** 20+ structured parameters per course including global QS rank, annual & total tuition, local currency, annual living expenses, intake deadlines, STEM designation, post-study work visa years, minimum GPA/IELTS/GRE, acceptance rate, and top employer roles.
* **Data Extensibility:** Stored as structured JSON (`src/data/courses.json`). It can be extended via headless CMS, PostgreSQL/Prisma database, or automated scraper pipelines without modifying UI components.

---

## 4. The 3 Original Features

### ⚡ Feature 1: Live Voice & Scratchpad Context Extractor
* **Problem:** Counsellors lose rapport when typing search filters while conversing on video calls.
* **Why It Matters:** Preserves natural eye contact and dialogue while keeping recommendations in sync with conversation.
* **How It Works:** As notes are typed or spoken, regex and NLP parsers detect keywords (`"3.4 GPA"`, `"IELTS 7.5"`, `"$40k budget"`, `"Germany"`, `"STEM OPT"`) and instantly sync recommendation filters.

### 🎯 Feature 2: Smart Admission Tiering Dashboard (Safe vs. Moderate vs. Reach)
* **Problem:** Students over-index on ambitious universities, risking total application rejection without safety nets.
* **Why It Matters:** Ensures a balanced portfolio strategy (2 Safe, 2 Moderate, 1 Reach) to maximize admission success.
* **How It Works:** Uses a multi-criteria scoring curve to categorize options into **Safe Matches** (candidate exceeds criteria, admission odds > 75%), **Moderate Targets** (criteria matched, viability 55–74%), and **Reach / Dream** (acceptance rate < 15% or academic deficit). Displayed in 3 parallel side-by-side columns on desktop and responsive quick tabs on mobile.

### 📊 Feature 3: Side-by-Side Trade-off & ROI Comparison Matrix
* **Problem:** Students and parents struggle to compare total costs across varying currencies, living costs, and visa rights.
* **Why It Matters:** Empowers families to make objective, data-backed financial decisions during the call.
* **How It Works:** Compares up to 4 shortlisted courses side-by-side. Computes **Total Study Cost** (`Tuition + Living * Duration`), **3-Year Post-Grad ROI (%)** based on average starting salary, and post-study visa rights, with one-click exportable summary sheets.

---

## 5. Domain-Specific Innovations Beyond Generic AI

1. **Embassy Visa Risk Radar (`src/lib/visaRiskEngine.ts`):** Checks country-specific proof-of-funds rules (Germany €11,208 Sperrkonto, UKVI 28-day rule, Canada CAD $20,635 GIC, US I-20 buffer) and generates a **Visa Approval Probability Score (%)**.
2. **Live Counsellor Pitch Script Generator (`src/components/LivePitchScriptModal.tsx`):** Provides instant, spoken talking points: Parent ROI pitch, Student Career pitch, and Objection handling.
3. **Multi-Currency Live FX Converter (`src/lib/currencyConverter.ts`):** Real-time conversion across **USD ($), INR (₹ Lakhs), EUR (€), GBP (£), CAD (CA$), and AUD (A$)**.
4. **Alternative Course Exploration (`src/components/AlternativeCoursesModal.tsx`):** Surfaces cross-country or lower-tuition alternatives for any selected program.
