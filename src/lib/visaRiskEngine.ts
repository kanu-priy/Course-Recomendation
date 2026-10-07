import { Course, StudentProfile, Country } from "@/types/course";

export interface VisaRiskAnalysis {
  riskLevel: "Low Risk" | "Moderate Risk" | "High Risk";
  approvalProbabilityScore: number; // 0 - 100
  financialProofRequiredUSD: number;
  financialSolvencyRatio: number; // Budget vs Required
  embassyRuleChecklist: {
    ruleName: string;
    status: "Passed" | "Warning" | "Critical";
    details: string;
  }[];
  advisorActionPlan: string[];
}

export function evaluateVisaRisk(
  course: Course,
  profile: StudentProfile
): VisaRiskAnalysis {
  const annualLiving = course.livingCostAnnualUSD;
  const annualTuition = course.tuitionAnnualUSD;
  const firstYearTotalUSD = annualTuition + annualLiving;

  let financialProofRequiredUSD = firstYearTotalUSD;
  const checklist: VisaRiskAnalysis["embassyRuleChecklist"] = [];
  const actionPlan: string[] = [];

  // Country specific embassy calculations
  switch (course.country) {
    case "Germany":
      // Blocked account ~ $12,500 USD + Tuition
      financialProofRequiredUSD = 12500 + annualTuition;
      checklist.push({
        ruleName: "Sperrkonto (German Blocked Account)",
        status: profile.maxBudgetUSD >= financialProofRequiredUSD ? "Passed" : "Warning",
        details: `Requires €11,208 (~$12,500 USD) deposited in Sperrkonto + 1st year tuition.`,
      });
      break;

    case "United Kingdom":
      // 28-day holding rule
      financialProofRequiredUSD = annualTuition + (course.city.toLowerCase().includes("london") ? 16500 : 13000);
      checklist.push({
        ruleName: "UKVI 28-Day Bank Statement Rule",
        status: profile.maxBudgetUSD >= financialProofRequiredUSD ? "Passed" : "Warning",
        details: `UKVI requires tuition + 9 months living funds held for 28 consecutive days before CAS release.`,
      });
      break;

    case "United States":
      // Form I-20 Proof of Funds
      financialProofRequiredUSD = Math.round(firstYearTotalUSD * 1.1); // 10% safety buffer required by US universities
      checklist.push({
        ruleName: "US Form I-20 Financial Solvency Buffer",
        status: profile.maxBudgetUSD >= financialProofRequiredUSD ? "Passed" : "Warning",
        details: `US Embassy requires 100% liquid proof of funds matching Form I-20 block (Tuition + Living + $2,500 Health Insurance).`,
      });
      break;

    case "Canada":
      // GIC + 1st year tuition
      financialProofRequiredUSD = 15000 + annualTuition; // CAD $20,635 GIC ~ $15,000 USD
      checklist.push({
        ruleName: "GIC (Guaranteed Investment Certificate)",
        status: profile.maxBudgetUSD >= financialProofRequiredUSD ? "Passed" : "Warning",
        details: `Requires purchase of $20,635 CAD GIC certificate prior to Study Permit submission.`,
      });
      break;

    case "Australia":
      // Genuine Student (GS) + AUD $24,505
      financialProofRequiredUSD = 16000 + annualTuition;
      checklist.push({
        ruleName: "Subclass 500 GS Assessment",
        status: profile.maxBudgetUSD >= financialProofRequiredUSD ? "Passed" : "Warning",
        details: `Requires Subclass 500 Genuine Student statement showing career progression in home country.`,
      });
      break;

    case "Ireland":
      financialProofRequiredUSD = 11000 + annualTuition;
      checklist.push({
        ruleName: "Irish Immigration Service Proof of Funds",
        status: profile.maxBudgetUSD >= financialProofRequiredUSD ? "Passed" : "Warning",
        details: `Requires €10,000 living expenses proof + full 1st year tuition receipt.`,
      });
      break;
  }

  // Language & Academic Gap Check
  if (profile.ielts && profile.ielts >= course.requirements.minIELTS) {
    checklist.push({
      ruleName: "English Proficiency Threshold",
      status: "Passed",
      details: `IELTS ${profile.ielts} satisfies embassy student visa criteria.`,
    });
  } else {
    checklist.push({
      ruleName: "English Proficiency Threshold",
      status: "Critical",
      details: `IELTS deficit may require pre-sessional English course or embassy interview risk.`,
    });
  }

  // Work Experience & Gap Check
  if (profile.workExperienceYears > 0) {
    checklist.push({
      ruleName: "Study Gap Justification",
      status: "Passed",
      details: `${profile.workExperienceYears} years of work experience provides legitimate career progression rationale.`,
    });
  }

  // Compute Solvency Ratio
  const budget = profile.maxBudgetUSD > 0 ? profile.maxBudgetUSD : firstYearTotalUSD;
  const financialSolvencyRatio = budget / financialProofRequiredUSD;

  let riskLevel: VisaRiskAnalysis["riskLevel"] = "Low Risk";
  let approvalProbabilityScore = 90;

  if (financialSolvencyRatio < 0.85) {
    riskLevel = "High Risk";
    approvalProbabilityScore = Math.max(35, Math.round(financialSolvencyRatio * 70));
    actionPlan.push("Advise co-borrower / education loan sponsorship certificate (SBI / HDFC Credila).");
    actionPlan.push("Request liquid bank balance top-up or fixed deposit pledge.");
  } else if (financialSolvencyRatio < 1.0) {
    riskLevel = "Moderate Risk";
    approvalProbabilityScore = Math.min(82, Math.round(financialSolvencyRatio * 85));
    actionPlan.push("Ensure financial documents are held for required holding period (e.g. 28 days for UK).");
  } else {
    riskLevel = "Low Risk";
    approvalProbabilityScore = Math.min(98, 90 + Math.round((financialSolvencyRatio - 1) * 10));
    actionPlan.push("High visa confidence. Proceed to university application & CAS/I-20 issuance.");
  }

  return {
    riskLevel,
    approvalProbabilityScore,
    financialProofRequiredUSD,
    financialSolvencyRatio: Math.round(financialSolvencyRatio * 100) / 100,
    embassyRuleChecklist: checklist,
    advisorActionPlan: actionPlan,
  };
}
