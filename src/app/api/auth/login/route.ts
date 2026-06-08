import { connectToDb } from "@/lib/db";
import { generateToken } from "@/lib/jwt";
import userModel from "@/models/user.model";
import { ApiResponse } from "@/types/api.types";
import { LoginBody } from "@/types/user.types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectToDb();

    const body: LoginBody = await req.json();

    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "All fields required",
        },
        {
          status: 400,
        },
      );
    }

    const isExisted = await userModel.findOne({ email });

    if (!isExisted) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 404,
        },
      );
    }

    const comparePassword = isExisted.comparePass(password);

    if (!comparePassword) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Invalid credentials",
        },
        {
          status: 401,
        },
      );
    }

    const token = generateToken({ userId: isExisted._id.toString() });

    const response = NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "User logged in successfully",
        data: {
          user: {
            _id: isExisted._id,
            name: isExisted.name,
            email: isExisted.email,
          },
        },
      },
      {
        status: 201,
      },
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 1000,
    });

    return response;
  } catch (err) {
    console.error("Error in register api", err);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Something went wrong while registering",
        error: {
          err,
        },
      },
      {
        status: 500,
      },
    );
  }
}
