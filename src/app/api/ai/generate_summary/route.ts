import { generateAiContent } from "@/lib/gemini";
import { GenerateSummaryBody } from "@/types/ai.types";
import { ApiResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body: GenerateSummaryBody = await req.json();

    const { experienceLevel, skills, jobTitle } = body;

    if (!experienceLevel || !skills || !jobTitle) {
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
You are an expert resume writer, recruiter, and ATS optimization specialist.

Your task is to generate a professional, ATS-friendly resume summary based on the provided information.

INPUT:
- Job Title: ${jobTitle}
- Skills: ${skills}
- Experience Level: ${experienceLevel}

REQUIREMENTS:

1. Write a concise and impactful resume summary.
2. The summary MUST be between 50 and 80 words inclusive.
3. Never exceed 80 words.
4. Optimize the summary for Applicant Tracking Systems (ATS) by naturally incorporating relevant keywords from the provided job title and skills.
5. Maintain a professional, confident, and results-oriented tone.
6. Focus on the candidate's ability to create business value, solve problems, contribute to teams, and deliver outcomes.
7. Avoid generic phrases such as:
   - "hardworking individual"
   - "team player"
   - "seeking an opportunity"
   - "looking for a challenging role"
   - "passionate professional"
8. Do not use first-person pronouns (I, me, my).
9. Do not invent achievements, metrics, years of experience, certifications, companies, educational qualifications, or responsibilities that were not provided.
10. Tailor the summary to the specified experience level:
    - Fresher: Emphasize foundational knowledge, projects, learning ability, problem-solving, and technical skills.
    - Intermediate: Highlight practical experience, collaboration, ownership, and technical contributions.
    - Experienced: Focus on leadership, architecture, scalability, business impact, and mentoring where appropriate.
11. Keep the language modern and aligned with 2026 hiring standards.
12. Ensure the summary reads naturally and does not appear AI-generated.
13. Use strong action-oriented language while remaining factual and professional.

OUTPUT RULES:

- Return only the resume summary.
- Do not include headings, labels, bullet points, markdown, explanations, or quotation marks.
- The summary must be ready to paste directly into a resume.
- Strictly maintain a word count between 50 and 80 words.
- If the generated summary exceeds 80 words, rewrite it until it falls within the limit.

Generate the resume summary now.
    `;

    const result = await generateAiContent(prompt);

    const summary = result;

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Summary created",
        data: {
          summary,
        },
      },
      {
        status: 201,
      },
    );
  } catch (err) {
    console.error("error in generate-summary api", err);
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
