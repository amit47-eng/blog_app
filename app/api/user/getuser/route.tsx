import { NextRequest, NextResponse } from "next/server";
import User from "@/model/user.model";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const email = searchParams.get("email");

        if (!email) {
            return NextResponse.json(
                { message: "Email query parameter is required" },
                { status: 400 }
            );
        }

        const response = await User.find({ email });

        return NextResponse.json({
            message: "Users retrieved successfully",
            response,
        });
    } catch (err: any) {
        console.error("Error retrieving users:", err);
        return NextResponse.json(
            { message: "Internal Server Error", error: err.message },
            { status: 500 }
        );
    }
}
