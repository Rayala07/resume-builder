import { Types } from "mongoose";

export interface PersonalInfo {
    fullname: string;
    email: string;
    mobile: string;
    location: string;
    github: string;
    linkedIn: string;
    portfolio: string;
}

export interface WorkExperience {
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
}

export interface Projects {
    title: string;
    description: string;
    githubUrl: string;
    liveUrl: string;
    techStack: string[];
}

export interface Education {
    institute: string;
    degree: string;
    startDate: string;
    endDate: string;
}

export interface Resume {
    _id?: string;
    user_id: Types.ObjectId;
    title: string;
    summary: string,
    personalInfo: PersonalInfo;
    workExperience?: WorkExperience[];
    projects: Projects[];
    skills: string[];
    education: Education[];
    certifications?: string[];
    createdAt?: Date;
    updatedAt?: Date;
}