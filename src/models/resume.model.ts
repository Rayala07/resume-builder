import mongoose from "mongoose";
import { Resume } from "../types/resume.types";

const resumeSchema = new mongoose.Schema<Resume>({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "user_id is required"]
    },
    title: {
        type: String,
        default: ""
    },
    personalInfo: {
        type: {
            fullname: String,
            email: String,
            mobile: String,
            location: String,
            github: String,
            linkedIn: String,
            portfolio: String
        },
        default: {}
    },
    education: {
        type: [
            {
                institute: String,
                degree: String,
                startDate: String,
                endDate: String
            } 
        ],
        default: []
    },
    workExperience: {
        type: [
            {
                company: String,
                position: String,
                startDate: String,
                endDate: String,
                description: String
            }
        ],
        default: []
    },
    projects: {
        type: [
            {
                title: String,
                description: String,
                techStack: [String],
                githubUrl: String,
                liveUrl: String
            }
        ],
        default: []
    },
    skills: {
        type: [String],
        default: []
    },
    certifications: {
        type: [String],
        default: []
    }
}, { timestamps: true })

const resumeModel = mongoose.model('Resume', resumeSchema)

export default resumeModel;