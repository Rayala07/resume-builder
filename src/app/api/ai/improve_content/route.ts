import { generateAiContent } from "@/lib/gemini";
import { ImproveContentBody } from "@/types/ai.types";
import { ApiResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body: ImproveContentBody = await req.json();

    const { content } = body;

    if (!content) {
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
You are an elite resume writer, ATS optimization specialist, technical recruiter, hiring manager, and career strategist.

Your task is to improve and rewrite resume content to maximize professionalism, ATS compatibility, clarity, impact, and recruiter appeal while preserving the original meaning.

INPUT:
- Content: ${content}

OBJECTIVE:

Transform the provided resume content into a stronger, more professional, ATS-friendly version that would be suitable for modern hiring standards in 2026.

REQUIREMENTS:

1. Preserve the original intent, meaning, and factual information.
2. Improve clarity, structure, readability, and professional tone.
3. Optimize the content for Applicant Tracking Systems (ATS).
4. Replace weak or generic wording with stronger professional language.
5. Use action-oriented language wherever appropriate.
6. Improve keyword relevance without stuffing keywords.
7. Remove redundancy, filler words, and unnecessary phrases.
8. Ensure the content sounds natural and human-written.
9. Improve grammar, punctuation, and sentence structure.
10. Make the content more concise while retaining important information.
11. Maintain credibility and realism.
12. Do not invent:
    - achievements
    - certifications
    - technologies
    - companies
    - responsibilities
    - metrics
    - percentages
    - awards
    - educational qualifications
    - years of experience
13. Do not add information that is not present in the original content.
14. Do not change technical facts.
15. Do not exaggerate experience or impact.
16. Preserve the context of the original content regardless of whether it belongs to:
    - Resume Summary
    - Project Description
    - Work Experience
    - Skills Section
    - Education Section
    - Certifications
    - Achievements
    - Any other resume section

CONTENT IMPROVEMENT GUIDELINES:

If the content is a Resume Summary:
- Strengthen positioning and professional branding.
- Improve ATS keyword alignment.
- Highlight technical capabilities and value creation.

If the content is a Project Description:
- Improve technical depth and implementation clarity.
- Emphasize technologies, architecture, and business value.

If the content is a Work Experience Bullet:
- Strengthen action verbs.
- Improve ownership and contribution language.
- Enhance technical terminology where appropriate.

If the content is a Skills Section:
- Standardize skill naming and formatting.
- Remove duplicates.
- Improve ATS compatibility.

If the content is already high quality:
- Make only minimal improvements.
- Avoid unnecessary rewriting.

OUTPUT RULES (STRICT):

1. Return ONLY the improved content.
2. Do NOT include explanations.
3. Do NOT include suggestions.
4. Do NOT include notes.
5. Do NOT include headings.
6. Do NOT include labels such as:
   - Improved Version
   - Enhanced Content
   - ATS Optimized Version
7. Do NOT include quotation marks around the response.
8. Do NOT include markdown formatting.
9. Do NOT explain what was changed.
10. The output must be immediately usable inside a professional resume.

QUALITY STANDARD:

The final output should read as if it was written by a senior recruiter and professional resume writer with deep knowledge of ATS systems, technical hiring, and modern resume best practices.

Improve the content now.
    `;

    const result = await generateAiContent(prompt);

    if (!result) {
      throw new Error("No response from Gemini");
    }

    const improvedContent = JSON.parse(result);

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "improved content created",
        data: {
          improvedContent,
        },
      },
      {
        status: 201,
      },
    );
  } catch (err) {
    console.error("error in improve_content api", err);
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
