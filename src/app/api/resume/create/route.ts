import { connectToDb } from "@/lib/db";
import { getCurrentUser } from "@/lib/getCurrentUser";
import resumeModel from "@/models/resume.model";
import { ApiResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectToDb()

        const userId = await getCurrentUser()

        const newResume = await resumeModel.create({
            user_id: userId,
            title: "",
            summary: "",
            personalInfo: {},
            workExperience: [],
            projects: [],
            skills: [],
            education: [],
            certifications: []
        })

        return NextResponse.json<ApiResponse>({
            success: true,
            message: "Resume created successfully",
            data: newResume
        }, { status: 201 })


    } catch (err) {
        console.error("Error in create-resume-api", err)
        return NextResponse.json<ApiResponse>({
            success: false,
            message: "Internal server error"
        }, { status: 500 })
    }
}