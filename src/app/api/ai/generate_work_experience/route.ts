import { generateAiContent } from "@/lib/gemini";
import { GenerateExperienceBody } from "@/types/ai.types";
import { ApiResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body: GenerateExperienceBody = await req.json();

    const { experienceLevel, jobRole, techStack, yearsOfExperience, company } =
      body;

    if (
      !experienceLevel ||
      !jobRole ||
      !techStack ||
      !yearsOfExperience ||
      !company
    ) {
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
You are an expert resume writer, technical recruiter, hiring manager, and ATS optimization specialist.

Your task is to generate a professional, ATS-friendly work experience entry for a resume based on the provided information.

INPUT:
- Job Role: ${jobRole}
- Experience Level: ${experienceLevel}
- Years of Experience: ${yearsOfExperience}
- Company: ${company}
- Tech Stack: ${techStack}

REQUIREMENTS:

1. Generate a realistic and professional work experience entry that aligns with the provided role, experience level, years of experience, company, and tech stack.
2. Optimize the content for Applicant Tracking Systems (ATS) using industry-standard technical terminology.
3. Focus on technical contributions, ownership, implementation, engineering practices, and business impact.
4. Naturally incorporate technologies from the provided tech stack throughout the experience points.
5. Ensure the responsibilities and contributions are realistic for the specified role and experience level.
6. Use strong action-oriented language.
7. Avoid generic filler content and meaningless buzzwords.
8. Do not use first-person pronouns (I, me, my, we, our).
9. Do not generate fake certifications, awards, patents, publications, or educational qualifications.
10. Do not invent unrealistic achievements.
11. Keep all statements believable and suitable for a professional resume.
12. Use concise, recruiter-friendly language.

EXPERIENCE LEVEL GUIDELINES:

Fresher:
- Focus on implementation, feature development, bug fixing, API integration, testing, database operations, and collaboration with senior developers.
- Reflect entry-level responsibilities.
- Avoid architectural ownership and leadership responsibilities.

Intermediate:
- Include feature ownership, system design participation, performance optimization, API development, code reviews, deployment activities, testing, and cross-functional collaboration.
- Demonstrate independent contribution and technical ownership.

Experienced:
- Include architecture decisions, scalability improvements, mentoring, technical leadership, system optimization, cloud infrastructure, security practices, and engineering strategy where relevant.
- Demonstrate senior-level ownership and impact.

OUTPUT RULES (STRICT):

1. Return ONLY a valid JSON object.
2. The response must be directly parsable by JSON.parse().
3. Do NOT wrap the response in markdown code fences.
4. Do NOT include explanations, notes, comments, headings, labels, or any additional text.
5. Do NOT include text before or after the JSON object.

JSON STRUCTURE:

{
  "company": "Company Name",
  "jobTitle": "Job Role",
  "experience": "Years of Experience",
  "responsibilities": [
    "Responsibility 1",
    "Responsibility 2",
    "Responsibility 3",
    "Responsibility 4",
    "Responsibility 5"
  ]
}

RESPONSIBILITY REQUIREMENTS:

1. Generate exactly 5 responsibility bullet points.
2. Each responsibility must be between 15 and 30 words.
3. Start every responsibility with a strong action verb such as:
   - Developed
   - Built
   - Implemented
   - Designed
   - Optimized
   - Integrated
   - Maintained
   - Collaborated
   - Enhanced
   - Automated
4. Naturally incorporate relevant technologies from the provided tech stack.
5. Focus on technical contributions rather than generic job duties.
6. Avoid repeating the same action verb excessively.
7. Do not fabricate numerical achievements, percentages, revenue impact, user counts, or metrics.
8. Ensure responsibilities collectively showcase a broad range of technical skills and contributions.

VALID EXAMPLE:

{
  "company": "Tech Solutions",
  "jobTitle": "Backend Developer",
  "experience": "2 Years",
  "responsibilities": [
    "Developed RESTful APIs using Spring Boot and PostgreSQL to support secure and efficient data management across multiple application modules.",
    "Implemented authentication and authorization workflows using JWT and role-based access control mechanisms.",
    "Optimized database queries and indexing strategies to improve application responsiveness and data retrieval efficiency.",
    "Collaborated with frontend developers to integrate backend services and ensure seamless communication between application layers.",
    "Maintained containerized deployment workflows using Docker while contributing to testing and debugging activities throughout the development lifecycle."
  ]
}

Generate the work experience JSON now. 
    `;

    const result = await generateAiContent(prompt);

    if (!result) {
      throw new Error("No response from Gemini");
    }

    const workExperience = JSON.parse(result);

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "workExperience created",
        data: {
          workExperience,
        },
      },
      {
        status: 201,
      },
    );
  } catch (err) {
    console.error("error in generate_work_experience api", err);
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
