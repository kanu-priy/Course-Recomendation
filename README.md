# 🎓 GradGuide AI Course Recommendation Assistant Co-Pilot

> **Option 3 Assessment Submission for GradGuide**  
> **Target Role / Feature:** Live Google Meet Counselling Assistant & Decision-Support System  
> **Repository:** https://github.com/kanu-priy/Course-Recomendation  
> **Contact:** `fayola.m@gradguide.in` | **Submission Deadline:** October 9th, 2026  

[![Technical Write-up](https://img.shields.io/badge/Technical%20Write--up-Read%20Here-blue.svg)](./TECHNICAL_DECISIONS_WRITEUP.md)
[![Build Status](https://img.shields.io/badge/Build-Passing%20(Next.js%2014)-brightgreen.svg)]()

---

## 🌟 What Makes This Stand Out & Unique?

While generic AI tools simply wrap text prompts, **GradGuide Co-Pilot** incorporates **3 Standout Domain-Specific Innovations** designed for study abroad counsellors during live video calls:

1. 🛡️ **Embassy Visa Risk Radar**: Evaluates country-specific visa proof-of-funds rules (Germany €11,208 Blocked Account, UKVI 28-day holding rule, Canada CAD $20,635 GIC, US Form I-20 buffer) and provides a **Visa Approval Probability Score (%)**.
2. 🎙️ **Live Pitch Script Generator**: Generates 3 ready-to-speak scripts for counselors on live calls (Parent ROI Pitch, Student Career Pitch, and Objection Handler).
3. 💱 **Multi-Currency Live FX Converter**: Toggles instant currency conversion across **USD ($), INR (₹ Lakhs), EUR (€), GBP (£), CAD (CA$), and AUD (A$)**.

---

## ✨ Key Original Features

### ⚡ 1. Live Voice / Note Context Extractor & Quick Auto-Search
- **Simulated Google Meet Call & Scratchpad**: Dual-view UI with a live Meet call interface on the left and live voice notes extractor on the right.
- **Real-time Keyword & Speech Parser**: Parses advisor notes and speech for GPA, IELTS/TOEFL/GRE scores, tuition budget limits, target intakes (`Fall 2025`), destination countries (`US`, `UK`, `Canada`, `Australia`, `Germany`, `Ireland`), and STEM preferences.

### 🎯 2. Smart Admission Tiering Dashboard (Safe vs. Moderate vs. Reach)
- **3 Parallel Column Dashboard**: Displays **Safe Matches** (🟢), **Moderate Targets** (🟡), and **Reach / Dream** (🔴) options side-by-side on the exact same page.
- **Explainable Match Scorecard**: Displays detailed point breakdowns for GPA, language proficiency, work experience, and selectivity.

### 📊 3. Side-by-Side Trade-off & ROI / Visa Comparison Matrix
- **Inline Comparative Matrix**: Compare selected courses side-by-side without opening modals.
- **Financial & Visa Analytics**: Calculates Total Study Cost, Post-Study Work Visa (PSW) durations (3-Year US STEM OPT, 2-Year UK PSW, Germany, Canada PGWP), and 3-Year Post-Grad ROI %.

---

## 🚀 Quick Start & Local Run Instructions

### Prerequisites
- **Node.js**: v18.0.0 or higher (Tested on Node v22.12.0)
- **Package Manager**: `npm`

### Step-by-Step Setup

1. **Navigate to Project Directory:**
   ```bash
   cd "d:\Course Recomendation"
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
   Open your browser and navigate to `http://localhost:3000`.

---

## 🛠 Tech Stack

- **Framework:** Next.js 14 (App Router, TypeScript)
- **Styling:** Tailwind CSS + Lucide Icons + Framer Motion
- **AI Integration:** Google Gemini API (`@google/generative-ai`) with offline rule engine fallback
- **Data Store:** Structured JSON (`src/data/courses.json`) containing 20+ realistic international master's programs
