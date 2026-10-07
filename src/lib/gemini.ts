import { GoogleGenerativeAI } from "@google/generative-ai";
import { Course, StudentProfile, ScoredCourse } from "@/types/course";
import { searchAndScoreCourses } from "./recommendationEngine";

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function generateCourseRecommendationAI(
  userQuery: string,
  profile: StudentProfile,
  scoredCourses: ScoredCourse[]
): Promise<string> {
  const top5 = scoredCourses.slice(0, 5);

  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `
You are an expert Study Abroad Counsellor Co-Pilot assisting a counsellor live during a student session.
Student Profile:
- GPA: ${profile.gpa} (Scale: ${profile.gpaScale})
- IELTS: ${profile.ielts || "N/A"}, TOEFL: ${profile.toefl || "N/A"}, GRE: ${profile.gre || "N/A"}
- Work Experience: ${profile.workExperienceYears} years
- Max Budget: $${profile.maxBudgetUSD.toLocaleString()} (${profile.budgetPeriod})
- Target Intake: ${profile.targetIntake}
- Preferred Countries: ${profile.preferredCountries.join(", ") || "All"}
- Preferred Field: ${profile.preferredField || "Any STEM/Tech"}

Top Filtered Courses:
${top5
  .map(
    (item, index) =>
      `${index + 1}. ${item.course.name} at ${item.course.university} (${item.course.country})
   - Tier: ${item.match.tier} | Eligibility Score: ${item.match.eligibilityScore}%
   - Total Cost: $${item.course.tuitionTotalUSD.toLocaleString()} | PSW Visa: ${item.course.postStudyWorkVisaYears} Years
   - Key Match Reason: ${(item.match.whyRelevant || item.match.reasons || []).slice(0, 2).join(" ")}`
  )
  .join("\n")}

Counsellor Query: "${userQuery}"

Provide a concise, professional 3-4 bullet response tailored for the counsellor to speak to the student immediately. Focus on admission viability, cost trade-offs, and career/visa outcomes.
`;

      const response = await model.generateContent(prompt);
      return response.response.text();
    } catch (err) {
      console.warn("Gemini API call failed, falling back to smart local AI engine:", err);
    }
  }

  // Smart local fallback response
  return generateLocalRuleAIResponse(userQuery, profile, top5);
}

function generateLocalRuleAIResponse(
  userQuery: string,
  profile: StudentProfile,
  topCourses: ScoredCourse[]
): string {
  const q = userQuery.toLowerCase();

  if (topCourses.length === 0) {
    return "Based on your criteria, no exact course matches were found. Try broadening the budget threshold or expanding preferred destination countries.";
  }

  const safeCourses = topCourses.filter((c) => c.match.tier === "Safe");
  const modCourses = topCourses.filter((c) => c.match.tier === "Moderate");
  const reachCourses = topCourses.filter((c) => c.match.tier === "Reach");

  if (q.includes("safe") || q.includes("backup")) {
    if (safeCourses.length > 0) {
      const topSafe = safeCourses[0];
      return `🎯 **Recommended Safe Option**: **${topSafe.course.name}** at **${topSafe.course.university}** (${topSafe.course.country}).\n` +
        `• **Why Safe**: Student GPA (${profile.gpa}) exceeds the requirement (${topSafe.course.requirements.minGPA}). High admission probability (${topSafe.match.eligibilityScore}% match).\n` +
        `• **Visa & ROI**: ${topSafe.course.postStudyWorkVisaYears}-year post-study visa. Avg starting salary: $${topSafe.course.avgGraduateSalaryUSD.toLocaleString()}/yr.`;
    } else {
      return `Currently, most matches fall under Moderate or Reach tiers due to university selectivity. Consider adding ${topCourses[0].course.university} as a strong Moderate target.`;
    }
  }

  if (q.includes("visa") || q.includes("post study") || q.includes("opt") || q.includes("stem")) {
    const stemOption = topCourses.find((c) => c.course.isStem);
    if (stemOption) {
      return `✈️ **Visa & Post-Study Work Summary**:\n` +
        `• **${stemOption.course.name}** (${stemOption.course.country}) is **STEM Designated**, granting **${stemOption.course.postStudyWorkVisaYears} Years** of post-study work authorization.\n` +
        `• Excellent for international students seeking extended corporate sponsorship in ${stemOption.course.country}.`;
    }
  }

  if (q.includes("budget") || q.includes("cost") || q.includes("cheap") || q.includes("affordable")) {
    const sortedByCost = [...topCourses].sort(
      (a, b) => a.course.tuitionTotalUSD - b.course.tuitionTotalUSD
    );
    const lowestCost = sortedByCost[0];
    return `💰 **Most Budget-Friendly Option**: **${lowestCost.course.name}** at **${lowestCost.course.university}** (${lowestCost.course.country}).\n` +
      `• **Total Tuition**: $${lowestCost.course.tuitionTotalUSD.toLocaleString()} (${lowestCost.course.durationYears} Years).\n` +
      `• **Living Expenses**: ~$${lowestCost.course.livingCostAnnualUSD.toLocaleString()}/yr in ${lowestCost.course.city}.`;
  }

  // Default balanced recommendation
  const primary = topCourses[0];
  return `💡 **Top Recommendation**: **${primary.course.name}** at **${primary.course.university}** (${primary.course.country})\n` +
    `• **Admission Tier**: ${primary.match.tier} (${primary.match.eligibilityScore}% Match Score)\n` +
    `• **Key Strengths**: ${primary.match.highlights.slice(0, 2).join(" | ")}\n` +
    `• **Admission Advice**: ${(primary.match.whyRelevant || primary.match.reasons || [])[0] || "Fits student academic background well."}`;
}
