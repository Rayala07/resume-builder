import { generateAiContent } from "@/lib/gemini";
import { GenerateProjectBody } from "@/types/ai.types";
import { ApiResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body: GenerateProjectBody = await req.json();

    const { experienceLevel, jobTitle, techStack } = body;

    if (!experienceLevel || !jobTitle || !techStack) {
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

Your task is to generate a professional, ATS-friendly resume project description based on the provided information.

INPUT:
- Job Title: ${jobTitle}
- Experience Level: ${experienceLevel}
- Tech Stack: ${techStack}

REQUIREMENTS:

1. Generate a realistic project description that aligns with the provided job title, experience level, and tech stack.
2. The description should sound like a real project that could reasonably appear on a professional resume.
3. Focus on technical implementation, problem-solving, architecture, and business value.
4. Naturally incorporate technologies from the provided tech stack throughout the description.
5. Optimize the content for ATS systems by using industry-standard technical terminology.
6. Ensure the project demonstrates practical application of the listed technologies.
7. The description should highlight:
   - System or application purpose
   - Core functionality
   - Technical implementation
   - Key engineering considerations
   - User or business impact
8. Use strong action-oriented language.
9. Avoid generic filler content.
10. Avoid buzzwords without substance.
11. Do not use first-person pronouns (I, me, my, we, our).
12. Do not invent company names, clients, certifications, awards, revenue figures, user counts, or metrics.
13. Keep the description realistic for the specified experience level.

EXPERIENCE LEVEL GUIDELINES:

For Fresher:
- Focus on hands-on development, learning, implementation, CRUD operations, authentication, API integration, responsive UI, and database management.
- Emphasize project building and practical application of concepts.
- Avoid advanced architecture and large-scale system claims.

For Intermediate:
- Include scalable architecture decisions, performance optimization, API design, testing, deployment workflows, and collaboration-oriented development practices.
- Demonstrate ownership of significant technical components.

For Experienced:
- Include distributed systems concepts, scalability, cloud infrastructure, microservices, performance engineering, observability, security considerations, and architectural decision-making where relevant.
- Reflect senior-level engineering responsibility.

OUTPUT RULES (STRICT):

1. Return ONLY a valid JSON object.
2. The response must be directly parsable by JSON.parse().
3. Do NOT wrap the response in markdown code fences.
4. Do NOT include explanations, notes, comments, headings, or additional text.
5. Do NOT include text before or after the JSON object.

Return the project using the following structure:

{
  "title": "Project Title",
  "description": "Professional ATS-friendly project description between 80 and 150 words."
}

TITLE REQUIREMENTS:

- Generate a professional and realistic project title.
- The title should align with the provided job role and tech stack.
- Keep the title between 2 and 6 words.
- Avoid generic titles like "Web App", "Project", "Portfolio", or "Management System".

DESCRIPTION REQUIREMENTS:

- Generate a single paragraph.
- Length must be between 80 and 150 words.
- Naturally include important technologies from the tech stack.
- Maintain professional resume language.
- Focus on implementation, technical capabilities, and value delivered.

VALID EXAMPLE:

{
  "title": "Smart Inventory Platform",
  "description": "Developed a full-stack inventory management platform using React, Node.js, Express, and MongoDB to streamline product tracking and stock management. Implemented secure authentication, role-based access control, RESTful APIs, and dynamic dashboards for inventory insights. Designed responsive user interfaces, optimized database queries for efficient data retrieval, and integrated real-time inventory updates. Applied modular architecture principles and reusable components to improve maintainability while ensuring a seamless user experience across devices."
}

Generate the project JSON now.
    
    `;

    const result = await generateAiContent(prompt);

    if (!result) {
      throw new Error("No response from Gemini");
    }

    const projectDescription = JSON.parse(result);

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "projectDescription created",
        data: {
          projectDescription,
        },
      },
      {
        status: 201,
      },
    );
  } catch (err) {
    console.error("error in generate_project_description api", err);
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
