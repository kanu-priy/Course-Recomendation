"use client";

import React, { useState } from "react";
import {
  X,
  Mic,
  Copy,
  Check,
  Sparkles,
  TrendingUp,
  DollarSign,
  ShieldCheck,
  Volume2,
  BookOpen,
} from "lucide-react";
import { Course, StudentProfile } from "@/types/course";
import { evaluateCourseMatch } from "@/lib/recommendationEngine";
import { evaluateVisaRisk } from "@/lib/visaRiskEngine";
import { CurrencyCode, formatCurrency } from "@/lib/currencyConverter";

interface LivePitchScriptModalProps {
  course: Course | null;
  onClose: () => void;
  studentProfile: StudentProfile;
  currency: CurrencyCode;
}

export const LivePitchScriptModal: React.FC<LivePitchScriptModalProps> = ({
  course,
  onClose,
  studentProfile,
  currency,
}) => {
  const [copiedPitch, setCopiedPitch] = useState<string | null>(null);

  if (!course) return null;

  const match = evaluateCourseMatch(course, studentProfile);
  const visaRisk = evaluateVisaRisk(course, studentProfile);

  const formattedTuition = formatCurrency(course.tuitionTotalUSD, currency);
  const formattedSalary = formatCurrency(course.avgGraduateSalaryUSD, currency);

  // Generate 3 Script Types
  const parentPitch = `Parent Pitch: "Mr./Mrs. Chen, while ${course.university} requires a total tuition investment of ${formattedTuition}, graduates earn an average starting salary of ${formattedSalary} per year in ${course.country}. With ${course.postStudyWorkVisaYears} years of full post-study work authorization, Alex will be able to recover the entire study cost within 18 to 24 months of graduation."`;

  const studentPitch = `Student Pitch: "Alex, ${course.name} at ${course.university} is ranked QS #${course.qsRanking} globally. ${course.isStem ? "It is STEM designated, which gives you up to 3 years of work authorization." : ""} You will be studying right in ${course.city}, which puts you in direct recruiting proximity to companies like ${course.careerOutcomes.join(", ")}."`;

  const objectionPitch = `Objection Handler: "${match.gpaFit === "Below" ? `I know your GPA is slightly below their preferred threshold, but because you have ${studentProfile.workExperienceYears} years of hands-on experience, we can frame your SOP to highlight practical projects and offset the academic gap.` : `This program is categorized as a ${match.tier} match for you with a ${match.eligibilityScore}% eligibility fit score. Application deadlines for ${course.intakes[0]} close on ${Object.values(course.deadlines)[0] || "soon"}, so securing your application early gives us the highest scholarship probability.`}"`;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPitch(label);
    setTimeout(() => setCopiedPitch(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-md">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Live Counsellor Pitch Script Generator
                <Sparkles className="w-4 h-4 text-purple-400" />
              </h2>
              <p className="text-xs text-slate-400">
                Ready-to-speak talking points tailored for live Meet calls with students & parents
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Course Banner */}
        <div className="p-4 bg-slate-950/60 border-b border-slate-800/80 flex items-center justify-between text-xs">
          <div>
            <h3 className="font-bold text-slate-100 text-sm">{course.name}</h3>
            <p className="text-slate-400">{course.university} ({course.country}) • QS #{course.qsRanking}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 font-bold border border-blue-500/20">
              {match.tier} ({match.eligibilityScore}% Fit)
            </span>
          </div>
        </div>

        {/* Pitch Scripts */}
        <div className="p-6 space-y-4 text-xs text-slate-300 max-h-[70vh] overflow-y-auto">
          {/* Script 1: Parent ROI */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-400 flex items-center gap-1.5 uppercase text-[11px] tracking-wider">
                <DollarSign className="w-4 h-4" /> 1. Parent ROI & Financial Solvency Script
              </span>
              <button
                onClick={() => handleCopy(parentPitch, "parent")}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] border border-slate-700 transition-all"
              >
                {copiedPitch === "parent" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPitch === "parent" ? "Copied!" : "Copy Script"}</span>
              </button>
            </div>
            <p className="italic text-slate-200 leading-relaxed bg-slate-900/80 p-3 rounded-lg border border-slate-800 font-mono text-[11px]">
              "{parentPitch.replace('Parent Pitch: "', '').slice(0, -1)}"
            </p>
          </div>

          {/* Script 2: Student Career */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-blue-400 flex items-center gap-1.5 uppercase text-[11px] tracking-wider">
                <BookOpen className="w-4 h-4" /> 2. Student Career & Curriculum Script
              </span>
              <button
                onClick={() => handleCopy(studentPitch, "student")}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] border border-slate-700 transition-all"
              >
                {copiedPitch === "student" ? <Check className="w-3.5 h-3.5 text-blue-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPitch === "student" ? "Copied!" : "Copy Script"}</span>
              </button>
            </div>
            <p className="italic text-slate-200 leading-relaxed bg-slate-900/80 p-3 rounded-lg border border-slate-800 font-mono text-[11px]">
              "{studentPitch.replace('Student Pitch: "', '').slice(0, -1)}"
            </p>
          </div>

          {/* Script 3: Objection Handler */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-400 flex items-center gap-1.5 uppercase text-[11px] tracking-wider">
                <Volume2 className="w-4 h-4" /> 3. Objection Handler & Deadline Rationale
              </span>
              <button
                onClick={() => handleCopy(objectionPitch, "objection")}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] border border-slate-700 transition-all"
              >
                {copiedPitch === "objection" ? <Check className="w-3.5 h-3.5 text-amber-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPitch === "objection" ? "Copied!" : "Copy Script"}</span>
              </button>
            </div>
            <p className="italic text-slate-200 leading-relaxed bg-slate-900/80 p-3 rounded-lg border border-slate-800 font-mono text-[11px]">
              "{objectionPitch.replace('Objection Handler: "', '').slice(0, -1)}"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
