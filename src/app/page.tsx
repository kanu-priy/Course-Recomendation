"use client";

import React, { useState, useMemo, useCallback } from "react";
import { Header } from "@/components/Header";
import { LiveMeetCall } from "@/components/LiveMeetCall";
import { LiveNoteScratchpad } from "@/components/LiveNoteScratchpad";
import { FilterControls } from "@/components/FilterControls";
import { CourseCard } from "@/components/CourseCard";
import { InlineComparisonSection } from "@/components/InlineComparisonSection";
import { CourseDetailModal } from "@/components/CourseDetailModal";
import { ComparisonMatrix } from "@/components/ComparisonMatrix";
import { AiAssistantDrawer } from "@/components/AiAssistantDrawer";
import { ExportSummaryModal } from "@/components/ExportSummaryModal";
import { VisaRiskRadarModal } from "@/components/VisaRiskRadarModal";
import { LivePitchScriptModal } from "@/components/LivePitchScriptModal";
import { AlternativeCoursesModal } from "@/components/AlternativeCoursesModal";

import { StudentProfile, Course, ScoredCourse, ExtractedContext, AdmissionTier } from "@/types/course";
import rawCourses from "@/data/courses.json";
import { searchAndScoreCourses } from "@/lib/recommendationEngine";
import { CurrencyCode } from "@/lib/currencyConverter";
import {
  ShieldCheck,
  Target,
  Rocket,
  Sparkles,
  Compass,
  Layers,
  SlidersHorizontal,
} from "lucide-react";

const allCoursesList: Course[] = (rawCourses as unknown) as Course[];

const DEFAULT_PROFILE: StudentProfile = {
  gpa: 3.4,
  gpaScale: "4.0",
  ielts: 7.5,
  toefl: undefined,
  gre: 315,
  workExperienceYears: 2,
  maxBudgetUSD: 40000,
  budgetPeriod: "annual",
  targetIntake: "Fall 2025",
  preferredCountries: ["United States", "United Kingdom"],
  preferredField: "Computer Science",
  degreeLevel: "Master's",
  stemOnly: false,
  searchKeyword: "",
};

export default function HomePage() {
  // Currency State
  const [currency, setCurrency] = useState<CurrencyCode>("USD");

  // Mobile Tier View Tab State ("All" | "Safe" | "Moderate" | "Reach")
  const [mobileTierTab, setMobileTierTab] = useState<"All" | AdmissionTier>("All");

  // Student Profile Filter State
  const [profile, setProfile] = useState<StudentProfile>(DEFAULT_PROFILE);

  // Notes & Context State (Feature 1)
  const [sessionNotes, setSessionNotes] = useState<string>(
    "Alex Chen is a CS graduate with 3.4 GPA and IELTS 7.5. Looking for a Master's in Computer Science or Data Science for Fall 2025 in US or UK under $40,000 USD tuition with STEM OPT."
  );
  const [autoSync, setAutoSync] = useState<boolean>(true);

  // Shortlist & Compare State (Feature 3)
  const [shortlistedIds, setShortlistedIds] = useState<string[]>(["us-cmu-ms-cs", "us-neu-ms-cs"]);
  const [comparedIds, setComparedIds] = useState<string[]>(["us-cmu-ms-cs", "us-neu-ms-cs", "uk-imperial-ms-ai"]);

  // Modals & Drawers
  const [selectedDetailCourse, setSelectedDetailCourse] = useState<Course | null>(null);
  const [visaRadarCourse, setVisaRadarCourse] = useState<Course | null>(null);
  const [pitchScriptCourse, setPitchScriptCourse] = useState<Course | null>(null);
  const [alternativeCourse, setAlternativeCourse] = useState<Course | null>(null);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);

  // Feature 1 Callback: Apply Extracted Context
  const handleApplyContext = useCallback((context: ExtractedContext) => {
    setProfile((prev) => {
      const updated: StudentProfile = { ...prev };
      if (context.gpa !== undefined) {
        updated.gpa = context.gpa;
        if (context.gpaScale) updated.gpaScale = context.gpaScale;
      }
      if (context.ielts !== undefined) updated.ielts = context.ielts;
      if (context.toefl !== undefined) updated.toefl = context.toefl;
      if (context.gre !== undefined) updated.gre = context.gre;
      if (context.budgetUSD !== undefined) updated.maxBudgetUSD = context.budgetUSD;
      if (context.countries && context.countries.length > 0) updated.preferredCountries = context.countries;
      if (context.field) updated.preferredField = context.field;
      if (context.workExpYears !== undefined) updated.workExperienceYears = context.workExpYears;
      if (context.stemOnly !== undefined) updated.stemOnly = context.stemOnly;
      return updated;
    });
  }, []);

  // Compute Recommendation Scores
  const scoredCourses: ScoredCourse[] = useMemo(() => {
    return searchAndScoreCourses(profile, allCoursesList);
  }, [profile]);

  // Group Courses by Admission Tiers (Feature 2)
  const safeCourses = useMemo(() => scoredCourses.filter((c) => c.match.tier === "Safe"), [scoredCourses]);
  const moderateCourses = useMemo(() => scoredCourses.filter((c) => c.match.tier === "Moderate"), [scoredCourses]);
  const reachCourses = useMemo(() => scoredCourses.filter((c) => c.match.tier === "Reach"), [scoredCourses]);

  // Compared Course Objects
  const comparedCoursesList = useMemo(() => {
    return allCoursesList.filter((c) => comparedIds.includes(c.id));
  }, [comparedIds]);

  // Shortlisted Course Objects
  const shortlistedCoursesList = useMemo(() => {
    return allCoursesList.filter((c) => shortlistedIds.includes(c.id));
  }, [shortlistedIds]);

  // Toggle Handlers
  const toggleCompare = (course: Course) => {
    setComparedIds((prev) =>
      prev.includes(course.id)
        ? prev.filter((id) => id !== course.id)
        : [...prev, course.id]
    );
  };

  const toggleShortlist = (course: Course) => {
    setShortlistedIds((prev) =>
      prev.includes(course.id)
        ? prev.filter((id) => id !== course.id)
        : [...prev, course.id]
    );
  };

  const scrollToCompareSection = () => {
    const el = document.getElementById("compare-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-indigo-600 selection:text-white antialiased">
      {/* Header Bar */}
      <Header
        totalMatches={scoredCourses.length}
        safeCount={safeCourses.length}
        modCount={moderateCourses.length}
        reachCount={reachCourses.length}
        compareCount={comparedIds.length}
        shortlistCount={shortlistedIds.length}
        onOpenCompareSection={scrollToCompareSection}
        onOpenExport={() => setIsExportOpen(true)}
        onToggleAiDrawer={() => setIsAiDrawerOpen(!isAiDrawerOpen)}
        isAiOpen={isAiDrawerOpen}
        currency={currency}
        onCurrencyChange={setCurrency}
      />

      {/* Main Single Page Dashboard Container */}
      <main className="flex-1 p-3 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6 sm:space-y-8">
        
        {/* ROW 1: Google Meet Call Simulator & Feature 1 Live Voice Scratchpad */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
          {/* Left: Google Meet Video Call Simulator (5 cols) */}
          <div className="lg:col-span-5 flex flex-col">
            <LiveMeetCall
              onTranscriptReceived={(newText) => {
                setSessionNotes((prev) => prev + " " + newText);
              }}
              extractedChipsCount={scoredCourses.length}
            />
          </div>

          {/* Right: Feature 1 Live Scratchpad & Context Extractor (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <LiveNoteScratchpad
              currentNotes={sessionNotes}
              onNotesChange={setSessionNotes}
              onApplyContext={handleApplyContext}
              autoSync={autoSync}
              setAutoSync={setAutoSync}
            />
          </div>
        </section>

        {/* ROW 2: Filter & Preference Controls */}
        <section>
          <FilterControls
            profile={profile}
            onChangeProfile={setProfile}
            onReset={() => setProfile(DEFAULT_PROFILE)}
            totalMatchesCount={scoredCourses.length}
          />
        </section>

        {/* ROW 3: Feature 2 - 3-Column Parallel Admission Tier Dashboard */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 border-b border-slate-800/80 pb-3">
            <div>
              <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2 tracking-tight">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                Admission Tiering Dashboard
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 font-bold border border-indigo-500/20">Feature 2</span>
              </h2>
              <p className="text-xs text-slate-400">
                Parallel Safe, Moderate, and Reach columns computed from student eligibility thresholds
              </p>
            </div>

            {/* Mobile Tier Quick Tabs (visible on mobile only) */}
            <div className="flex sm:hidden items-center gap-1 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs w-full overflow-x-auto">
              <button
                onClick={() => setMobileTierTab("All")}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${mobileTierTab === "All" ? "bg-slate-800 text-white" : "text-slate-400"}`}
              >
                All
              </button>
              <button
                onClick={() => setMobileTierTab("Safe")}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${mobileTierTab === "Safe" ? "bg-emerald-500/20 text-emerald-400" : "text-slate-400"}`}
              >
                Safe ({safeCourses.length})
              </button>
              <button
                onClick={() => setMobileTierTab("Moderate")}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${mobileTierTab === "Moderate" ? "bg-amber-500/20 text-amber-400" : "text-slate-400"}`}
              >
                Mod ({moderateCourses.length})
              </button>
              <button
                onClick={() => setMobileTierTab("Reach")}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${mobileTierTab === "Reach" ? "bg-purple-500/20 text-purple-300" : "text-slate-400"}`}
              >
                Reach ({reachCourses.length})
              </button>
            </div>

            {/* Desktop Legend */}
            <div className="hidden sm:flex items-center gap-3 text-xs text-slate-400 font-semibold">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Safe</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Moderate</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span> Reach</span>
            </div>
          </div>

          {/* 3 Columns Parallel Grid Layout (Responsive on mobile) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 items-start">
            
            {/* COLUMN 1: SAFE MATCHES */}
            <div className={`space-y-4 p-3.5 sm:p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-lg ${mobileTierTab !== "All" && mobileTierTab !== "Safe" ? "hidden sm:block" : "block"}`}>
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                    <ShieldCheck className="w-4 h-4" />
                  </span>
                  <div>
                    <h3 className="font-bold text-sm text-emerald-400">Safe Matches</h3>
                    <p className="text-[10px] text-slate-400">High admission confidence</p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-extrabold text-xs border border-emerald-500/25">
                  {safeCourses.length}
                </span>
              </div>

              {safeCourses.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500 bg-slate-950/40 rounded-xl border border-slate-800/60">
                  No Safe matches under current filters.
                </div>
              ) : (
                <div className="space-y-3.5">
                  {safeCourses.map((scored) => (
                    <CourseCard
                      key={scored.course.id}
                      scored={scored}
                      isCompared={comparedIds.includes(scored.course.id)}
                      onToggleCompare={toggleCompare}
                      isShortlisted={shortlistedIds.includes(scored.course.id)}
                      onToggleShortlist={toggleShortlist}
                      onSelectDetail={setSelectedDetailCourse}
                      currency={currency}
                      onOpenVisaRadar={setVisaRadarCourse}
                      onOpenPitchScript={setPitchScriptCourse}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* COLUMN 2: MODERATE TARGETS */}
            <div className={`space-y-4 p-3.5 sm:p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-lg ${mobileTierTab !== "All" && mobileTierTab !== "Moderate" ? "hidden sm:block" : "block"}`}>
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/25">
                    <Target className="w-4 h-4" />
                  </span>
                  <div>
                    <h3 className="font-bold text-sm text-amber-400">Moderate Targets</h3>
                    <p className="text-[10px] text-slate-400">Competitive match options</p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-extrabold text-xs border border-amber-500/25">
                  {moderateCourses.length}
                </span>
              </div>

              {moderateCourses.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500 bg-slate-950/40 rounded-xl border border-slate-800/60">
                  No Moderate matches under current filters.
                </div>
              ) : (
                <div className="space-y-3.5">
                  {moderateCourses.map((scored) => (
                    <CourseCard
                      key={scored.course.id}
                      scored={scored}
                      isCompared={comparedIds.includes(scored.course.id)}
                      onToggleCompare={toggleCompare}
                      isShortlisted={shortlistedIds.includes(scored.course.id)}
                      onToggleShortlist={toggleShortlist}
                      onSelectDetail={setSelectedDetailCourse}
                      currency={currency}
                      onOpenVisaRadar={setVisaRadarCourse}
                      onOpenPitchScript={setPitchScriptCourse}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* COLUMN 3: REACH / DREAM */}
            <div className={`space-y-4 p-3.5 sm:p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-lg ${mobileTierTab !== "All" && mobileTierTab !== "Reach" ? "hidden sm:block" : "block"}`}>
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-purple-500/15 text-purple-300 border border-purple-500/25">
                    <Rocket className="w-4 h-4" />
                  </span>
                  <div>
                    <h3 className="font-bold text-sm text-purple-300">Reach / Dream</h3>
                    <p className="text-[10px] text-slate-400">Selective top-tier programs</p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300 font-extrabold text-xs border border-purple-500/25">
                  {reachCourses.length}
                </span>
              </div>

              {reachCourses.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500 bg-slate-950/40 rounded-xl border border-slate-800/60">
                  No Reach options found under current filters.
                </div>
              ) : (
                <div className="space-y-3.5">
                  {reachCourses.map((scored) => (
                    <CourseCard
                      key={scored.course.id}
                      scored={scored}
                      isCompared={comparedIds.includes(scored.course.id)}
                      onToggleCompare={toggleCompare}
                      isShortlisted={shortlistedIds.includes(scored.course.id)}
                      onToggleShortlist={toggleShortlist}
                      onSelectDetail={setSelectedDetailCourse}
                      currency={currency}
                      onOpenVisaRadar={setVisaRadarCourse}
                      onOpenPitchScript={setPitchScriptCourse}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ROW 4: Feature 3 - Inline Side-by-Side Trade-off & ROI Comparison Matrix */}
        <section>
          <InlineComparisonSection
            comparedCourses={comparedCoursesList}
            onRemoveCourse={(id) => setComparedIds((prev) => prev.filter((cId) => cId !== id))}
            studentProfile={profile}
            currency={currency}
          />
        </section>
      </main>

      {/* Modals & Drawers */}
      <CourseDetailModal
        course={selectedDetailCourse}
        onClose={() => setSelectedDetailCourse(null)}
        studentProfile={profile}
        isCompared={comparedIds.includes(selectedDetailCourse?.id || "")}
        onToggleCompare={toggleCompare}
        currency={currency}
      />

      <VisaRiskRadarModal
        course={visaRadarCourse}
        onClose={() => setVisaRadarCourse(null)}
        studentProfile={profile}
        currency={currency}
      />

      <LivePitchScriptModal
        course={pitchScriptCourse}
        onClose={() => setPitchScriptCourse(null)}
        studentProfile={profile}
        currency={currency}
      />

      <AlternativeCoursesModal
        course={alternativeCourse}
        onClose={() => setAlternativeCourse(null)}
        studentProfile={profile}
        allCourses={allCoursesList}
        currency={currency}
        comparedIds={comparedIds}
        onToggleCompare={toggleCompare}
        onSelectCourse={setSelectedDetailCourse}
      />

      <ComparisonMatrix
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        comparedCourses={comparedCoursesList}
        onRemoveCourse={(id) => setComparedIds((prev) => prev.filter((cId) => cId !== id))}
        studentProfile={profile}
      />

      <ExportSummaryModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        studentProfile={profile}
        sessionNotes={sessionNotes}
        scoredCourses={scoredCourses}
        shortlist={shortlistedCoursesList}
      />

      <AiAssistantDrawer
        isOpen={isAiDrawerOpen}
        onClose={() => setIsAiDrawerOpen(false)}
        studentProfile={profile}
        scoredCourses={scoredCourses}
      />
    </div>
  );
}
