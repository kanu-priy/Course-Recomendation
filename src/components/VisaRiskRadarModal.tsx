"use client";

import React from "react";
import {
  X,
  ShieldCheck,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  DollarSign,
  Globe,
  Sparkles,
  FileCheck,
  TrendingUp,
} from "lucide-react";
import { Course, StudentProfile } from "@/types/course";
import { evaluateVisaRisk } from "@/lib/visaRiskEngine";
import { CurrencyCode, formatCurrency } from "@/lib/currencyConverter";

interface VisaRiskRadarModalProps {
  course: Course | null;
  onClose: () => void;
  studentProfile: StudentProfile;
  currency: CurrencyCode;
}

export const VisaRiskRadarModal: React.FC<VisaRiskRadarModalProps> = ({
  course,
  onClose,
  studentProfile,
  currency,
}) => {
  if (!course) return null;

  const visaRisk = evaluateVisaRisk(course, studentProfile);
  const formattedProofRequired = formatCurrency(visaRisk.financialProofRequiredUSD, currency);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Embassy Visa Risk Radar & Proof-of-Funds Evaluator
              </h2>
              <p className="text-xs text-slate-400">
                Live immigration compliance check for {course.country} student visa
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

        {/* Content */}
        <div className="p-6 space-y-5 text-xs text-slate-300 max-h-[75vh] overflow-y-auto">
          {/* Top Score Banner */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                Embassy Visa Approval Probability
              </span>
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <span className={`text-2xl font-black ${
                  visaRisk.riskLevel === "Low Risk" ? "text-emerald-400" : visaRisk.riskLevel === "Moderate Risk" ? "text-amber-400" : "text-red-400"
                }`}>
                  {visaRisk.approvalProbabilityScore}%
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                  visaRisk.riskLevel === "Low Risk" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40" : visaRisk.riskLevel === "Moderate Risk" ? "bg-amber-500/20 text-amber-400 border-amber-500/40" : "bg-red-500/20 text-red-400 border-red-500/40"
                }`}>
                  {visaRisk.riskLevel}
                </span>
              </div>
            </div>

            <div className="text-center sm:text-right border-t sm:border-t-0 border-slate-800 pt-2 sm:pt-0">
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">
                Required Proof of Funds
              </span>
              <span className="text-base font-bold text-white">
                {formattedProofRequired}
              </span>
              <span className="text-[10px] text-slate-500 block">
                (${visaRisk.financialProofRequiredUSD.toLocaleString()} USD equiv.)
              </span>
            </div>
          </div>

          {/* Embassy Checklist Rules */}
          <div className="space-y-2">
            <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-blue-400" /> Country Embassy Rule Checklist ({course.country})
            </h3>
            <div className="space-y-2">
              {visaRisk.embassyRuleChecklist.map((rule, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 flex items-start gap-3"
                >
                  {rule.status === "Passed" ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : rule.status === "Warning" ? (
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-200">{rule.ruleName}</span>
                      <span className={`px-2 py-0.2 text-[9px] font-bold rounded ${
                        rule.status === "Passed" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
                      }`}>
                        {rule.status}
                      </span>
                    </div>
                    <p className="text-slate-400 text-[11px] leading-snug">{rule.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Advisor Action Plan */}
          {visaRisk.advisorActionPlan.length > 0 && (
            <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-500/30 space-y-2 text-xs">
              <h4 className="font-bold text-blue-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-blue-400" /> Advisor Recommended Action Plan for Call
              </h4>
              <ul className="space-y-1 text-slate-300">
                {visaRisk.advisorActionPlan.map((action, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-[11px]">
                    <span className="text-blue-400 font-bold">•</span>
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
