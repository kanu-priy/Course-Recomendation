# 🎓 GradGuide AI Course Recommendation Assistant Co-Pilot

> **Option 3 Assessment Submission for GradGuide**  
> **Target Role / Feature:** Live Google Meet Counselling Assistant & Decision-Support System  
> **Repository:** https://github.com/kanu-priy/Course-Recomendation  
> **Contact:** `fayola.m@gradguide.in` | **Submission Deadline:** October 9th, 2026  

[![Technical Write-up](https://img.shields.io/badge/Technical%20Write--up-Read%20Here-blue.svg)](./TECHNICAL_DECISIONS_WRITEUP.md)
[![Build Status](https://img.shields.io/badge/Build-Passing%20(Next.js%2014)-brightgreen.svg)]()

---

## 📹 Video Walkthrough & Live Demo

- **Live Hosted Application:** *[Add your Vercel URL here, e.g. https://course-recomendation.vercel.app]*
- **Video Walkthrough (Loom/Drive):** *[Add your video recording link here]*
- **Technical & Product Decisions Write-up:** Available at [`TECHNICAL_DECISIONS_WRITEUP.md`](./TECHNICAL_DECISIONS_WRITEUP.md)

---

## 📋 Assessment Specification Mapping

| Hiring Assignment Requirement | Implementation in Application | Status |
| :--- | :--- | :---: |
| **Recommend relevant courses based on student profile** | Weighted multi-criteria eligibility engine (`src/lib/recommendationEngine.ts`) calculating 0–100% fit scores across GPA, English, Work Exp, Budget, and Selectivity. | ✅ Complete |
| **Show useful info (university, country, fees, intake, eligibility)** | Displayed on Course Cards, Details Modal, and Comparison Matrix with real-time currency conversion. | ✅ Complete |
| **Explain why a course may be relevant to the student** | Expandable "Smart Admission Viability Breakdown" on every card detailing point allocations and explicit "Why Relevant" rationale. | ✅ Complete |
| **Allow counsellor to explore alternative recommendations** | Dedicated "Alternatives" modal (`AlternativeCoursesModal.tsx`) surfacing similar programs with lower tuition or cross-country options. | ✅ Complete |
| **Allow counsellor to search or ask questions about courses** | Keyword multi-field search + slide-over "Ask Co-Pilot AI" drawer with natural language Q&A (Google Gemini API + smart offline fallback). | ✅ Complete |
| **Live Google Meet Experience** | Dual-view layout (Meet simulator on the left, Assistant on the right) with audio waveform, live transcript stream, and collapsible floating mode. | ✅ Complete |
| **Incomplete Information Handling** | Graceful defaults, English waiver indicators, and "Incomplete Profile Warning" badges when GPA/test scores are not provided. | ✅ Complete |
| **Structured Course Data & Updates** | Structured JSON dataset (`src/data/courses.json`) with 20+ fields per program; easily updatable via headless CMS or DB pipeline. | ✅ Complete |

---

## 🌟 The 3 Original Features

### ⚡ Feature 1: Live Voice & Scratchpad Context Extractor
- **The Problem:** Counsellors break conversational eye-contact and rapport on video calls having to type into search filters.
- **Why It Matters:** Keeps recommendations synchronized with live dialogue effortlessly without interrupting student flow.
- **How It Works:** Counsellor speaks into the mic or types live notes (`Web Speech API` + NLP parser). GPA, IELTS/TOEFL scores, budget limits, target intakes, and destination countries are automatically extracted and synced to recommendations in real time.

### 🎯 Feature 2: Smart Admission Tiering Dashboard (Safe vs. Moderate vs. Reach)
- **Problem:** Students often over-index on ambitious universities without backup options, leading to total rejection risks.
- **Why It Matters:** Enforces a balanced, realistic application strategy (Safe, Moderate, Reach) to maximize acceptance odds.
- **How It Works:** Categorizes programs into 3 parallel columns:
  - 🟢 **Safe Matches:** Candidate exceeds criteria (>75% admission probability).
  - 🟡 **Moderate Targets:** Candidate meets criteria with solid competitiveness (55–74%).
  - 🟣 **Reach / Dream:** Top-tier selective programs (<15% acceptance rate or academic deficit).

### 📊 Feature 3: Side-by-Side Trade-off & ROI Comparison Matrix
- **Problem:** Students and parents get confused comparing multiple currencies, living costs, and post-study work visa rights across countries.
- **Why It Matters:** Provides transparent, data-backed financial clarity during the live session.
- **How It Works:** Side-by-side trade-off matrix comparing Total Study Cost (`Tuition + Living * Duration`), Post-Study Work Visa duration (3-Yr US STEM OPT vs 2-Yr UK PSW), and 3-Year Estimated ROI %, with a one-click "Copy Formatted Matrix Sheet" button for session summaries.

---

## 🛡️ Additional Domain-Specific Innovations Beyond Generic AI

1. **Embassy Visa Risk Radar (`src/lib/visaRiskEngine.ts`):** Evaluates country-specific visa proof-of-funds rules (Germany €11,208 Sperrkonto, UKVI 28-day holding rule, Canada CAD $20,635 GIC, US Form I-20 buffer) and computes a **Visa Approval Probability Score (%)**.
2. **Live Counsellor Pitch Script Generator (`src/components/LivePitchScriptModal.tsx`):** Generates 3 ready-to-speak talking points tailored for live calls: Parent ROI Pitch, Student Career Pitch, and Objection Handler.
3. **Multi-Currency Live FX Converter (`src/lib/currencyConverter.ts`):** Live conversion across **USD ($), INR (₹ Lakhs), EUR (€), GBP (£), CAD (CA$), and AUD (A$)**.

---

## 🚀 Local Run Instructions

### Prerequisites
- **Node.js**: v18.0.0 or higher (Tested on Node v22.12.0)
- **Package Manager**: `npm`

### Step-by-Step Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/kanu-priy/Course-Recomendation.git
   cd Course-Recomendation
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Run Development Server:**
   ```bash
   npm run dev
   ```

4. **Open Application:**
   Open your browser at `http://localhost:3000`.

5. **(Optional) Add Gemini API Key:**
   Copy `.env.local.example` to `.env.local` and add `GEMINI_API_KEY=your_key`. If omitted, the app automatically runs on its smart offline rule-based AI engine.

---

## 🛠 Tech Stack

- **Framework:** Next.js 14 (App Router, TypeScript)
- **Styling & Icons:** Tailwind CSS + Lucide Icons + Framer Motion
- **AI Integration:** Google Gemini API (`@google/generative-ai`) with offline rule engine fallback
- **Data Knowledge Base:** Structured JSON (`src/data/courses.json`)
