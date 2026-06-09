import { generateAiContent } from "@/lib/gemini";
import { AtsScoreBody } from "@/types/ai.types";
import { ApiResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body: AtsScoreBody = await req.json();

    const { resumeContent, targetRole } = body;

    if (!resumeContent || !targetRole) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Missing fields",
        },
        {
          status: 400,
        },
      );
    }

    const prompt = `
You are an elite ATS analyzer, technical recruiter, hiring manager, and resume review specialist with deep expertise in modern hiring practices, applicant tracking systems, and technical recruiting.

Your task is to analyze the provided resume against the target role and generate a realistic ATS assessment report.

INPUT:

Target Role:
${targetRole}

Resume Content:
${resumeContent}

OBJECTIVE:

Evaluate how effectively the resume aligns with the target role from both:

1. An Applicant Tracking System (ATS) perspective
2. A Human Recruiter perspective

Assess the resume's ability to pass ATS screening, match role-specific requirements, demonstrate relevant experience, showcase technical competency, and attract recruiter interest.

ROLE ALIGNMENT ANALYSIS:

Analyze the resume specifically against the target role and evaluate:

- Relevance of technical skills
- Relevance of projects
- Relevance of work experience
- Presence of role-specific keywords
- Demonstration of required competencies
- Overall suitability for the target role

SCORING CATEGORIES:

Evaluate the resume across the following categories:

1. ATS Compatibility
2. Role Match
3. Keyword Optimization
4. Resume Summary
5. Work Experience
6. Projects
7. Technical Skills
8. Content Impact
9. Readability & Structure
10. Professional Presentation
11. Recruiter Appeal

SCORING RULES:

1. Generate an overall ATS score between 0 and 100.
2. Generate category scores between 0 and 100.
3. Scores must realistically reflect the resume quality.
4. Do not automatically assign high scores.
5. Consider both ATS performance and recruiter perception.
6. Consider alignment with the target role when scoring.

Score Guidelines:

- 90-100: Exceptional
- 80-89: Strong
- 70-79: Good
- 60-69: Average
- Below 60: Needs Significant Improvement

ANALYSIS REQUIREMENTS:

1. Identify strengths that improve ATS performance.
2. Identify weaknesses that may reduce interview chances.
3. Identify missing or underdeveloped resume sections.
4. Identify keyword gaps relative to the target role.
5. Identify content weaknesses.
6. Identify recruiter concerns.
7. Identify opportunities to better align with the target role.
8. Provide practical and actionable recommendations.

KEYWORD ANALYSIS REQUIREMENTS:

1. Evaluate whether the resume contains sufficient role-relevant keywords.
2. Identify important missing keywords or skill areas.
3. Consider:
   - Technologies
   - Frameworks
   - Tools
   - Technical concepts
   - Industry terminology
4. Do not invent skills that are unrelated to the target role.

RECOMMENDATION REQUIREMENTS:

Recommendations should:

- Be specific
- Be actionable
- Improve ATS performance
- Improve recruiter appeal
- Improve alignment with the target role
- Improve content quality
- Improve resume structure when necessary

Do not:

- Invent achievements
- Invent certifications
- Invent experience
- Invent projects
- Invent skills already absent from the candidate's background

OUTPUT RULES (STRICT):

1. Return ONLY a valid JSON object.
2. The response must be directly parsable by JSON.parse().
3. Do NOT wrap the response in markdown code fences.
4. Do NOT include explanations outside the JSON object.
5. Do NOT include any text before or after the JSON object.

RETURN THIS EXACT STRUCTURE:

{
  "overallScore": 0,
  "summary": "A concise ATS assessment summary between 30 and 60 words.",
  "categoryScores": {
    "atsCompatibility": 0,
    "roleMatch": 0,
    "keywordOptimization": 0,
    "resumeSummary": 0,
    "workExperience": 0,
    "projects": 0,
    "technicalSkills": 0,
    "contentImpact": 0,
    "readability": 0,
    "professionalPresentation": 0,
    "recruiterAppeal": 0
  },
  "strengths": [
    "Strength 1",
    "Strength 2",
    "Strength 3"
  ],
  "weaknesses": [
    "Weakness 1",
    "Weakness 2",
    "Weakness 3"
  ],
  "missingSections": [
    "Missing Section 1"
  ],
  "keywordGaps": [
    "Missing keyword or skill area 1"
  ],
  "recommendations": [
    "Recommendation 1",
    "Recommendation 2",
    "Recommendation 3",
    "Recommendation 4",
    "Recommendation 5"
  ]
}

ADDITIONAL RULES:

1. overallScore must be an integer.
2. All category scores must be integers.
3. Generate 3-6 strengths.
4. Generate 3-6 weaknesses.
5. Generate 0-5 missing sections.
6. Generate 3-8 keyword gaps.
7. Generate 5-10 recommendations.
8. Keep all feedback concise and recruiter-focused.
9. The summary must clearly explain the resume's suitability for the target role.
10. Ensure the analysis is realistic, objective, and role-specific.
11. Avoid generic feedback whenever possible.
12. Prioritize insights that would most improve interview conversion rates.

Analyze the resume now.
    `;

    const result = await generateAiContent(prompt);

    if (!result) {
      throw new Error("No response from Gemini");
    }

    const atsScore = JSON.parse(result);

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "ats score created",
        data: {
          atsScore,
        },
      },
      {
        status: 201,
      },
    );
  } catch (err) {
    console.error("error in ats_score api", err);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Something went wrong",
      },
      {
        status: 500,
      },
    );
  }
}
