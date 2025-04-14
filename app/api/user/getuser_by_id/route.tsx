import { NextRequest, NextResponse } from "next/server";
import User from "@/model/user.model";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                { message: "User ID is required" },
                { status: 400 }
            );
        }

        const response = await User.findOne({ _id: id });

        if (!response) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: "User fetched successfully",
            response,
        });
    } catch (error: any) {
        console.error("Error fetching user by ID:", error);
        return NextResponse.json(
            { message: "Internal Server Error", error: error.message },
            { status: 500 }
        );
    }
}