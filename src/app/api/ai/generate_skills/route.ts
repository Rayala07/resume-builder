import { generateAiContent } from "@/lib/gemini";
import { GenerateSkillsBody } from "@/types/ai.types";
import { ApiResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body: GenerateSkillsBody = await req.json();

    const { experienceLevel, jobTitle } = body;

    if (!experienceLevel || !jobTitle) {
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
You are an expert technical recruiter, hiring manager, ATS optimization specialist, and software engineering career advisor.

Your task is to generate a list of relevant technical skills for a resume based on the provided job title and experience level.

INPUT:
- Job Title: ${jobTitle}
- Experience Level: ${experienceLevel}

REQUIREMENTS:

1. Generate only technical skills that are genuinely relevant to the provided job title.
2. Include a balanced mix of:
   - Programming Languages
   - Frameworks & Libraries
   - Databases
   - Tools & Platforms
   - Cloud & DevOps technologies (when relevant)
   - Core technical concepts relevant to the role
3. Tailor the skill selection to the specified experience level:
   - Fresher:
     - Focus on foundational and commonly expected technologies.
     - Avoid advanced architecture, leadership, or niche enterprise technologies.
   - Intermediate:
     - Include production-level technologies, testing tools, deployment tools, and common industry practices.
   - Experienced:
     - Include advanced technologies, architecture-related skills, cloud platforms, scalability tools, observability tools, and enterprise-grade technologies.
4. Prioritize skills that are commonly found in real job descriptions for the specified role.
5. Optimize the output for ATS systems by selecting industry-standard terminology.
6. Do not include soft skills.
7. Do not include personality traits.
8. Do not include certifications.
9. Do not include responsibilities or job duties.
10. Do not include duplicate skills.
11. Do not invent unrelated technologies.
12. Ensure all generated skills are realistic for the provided role and experience level.
13. Prefer modern technologies and hiring standards relevant for 2026.
14. Generate between 12 and 20 skills.

OUTPUT RULES (STRICT):

1. Return ONLY a valid JSON array.
2. The response must start with "[" and end with "]".
3. Do NOT wrap the JSON array in markdown code fences.
4. Do NOT include explanations, notes, comments, headings, labels, or any additional text.
5. Do NOT include text before or after the JSON array.
6. The entire response must be directly parsable by JSON.parse().
7. If the response contains anything other than a JSON array, regenerate the output until it is a valid JSON array.
8. Each array item must be a string representing a technical skill.

VALID EXAMPLE:

["JavaScript","TypeScript","React","Next.js","Node.js","Express.js","MongoDB","PostgreSQL","REST APIs","Git","Docker","AWS"]

INVALID EXAMPLES:

Here are the skills:
["JavaScript","React"]

- json
["JavaScript","React"]
    `;

    const result = await generateAiContent(prompt);

    if (!result) {
      throw new Error("No response from Gemini");
    }

    const skills = JSON.parse(result);

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "skills created",
        data: {
          skills,
        },
      },
      {
        status: 201,
      },
    );
  } catch (err) {
    console.error("error in generate-skills api", err);
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
