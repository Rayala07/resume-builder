export interface GenerateSummaryBody {
  experienceLevel: string;
  skills: string[];
  jobTitle: string;
}

export interface GenerateSkillsBody {
  experienceLevel: string;
  jobTitle: string;
}

export interface GenerateProjectBody {
  experienceLevel: string;
  jobTitle: string;
  techStack: string[];
}

export interface GenerateExperienceBody {
  experienceLevel: string;
  jobRole: string;
  yearsOfExperience: number;
  company: string;
  techStack: string[];
}

export interface ImproveContentBody {
  content: string;
}

export interface AtsScoreBody {
  resumeContent: string;
  targetRole: string;
}
