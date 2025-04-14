import { NextRequest, NextResponse } from "next/server";
import User from "@/model/user.model";

export async function PATCH(req: NextRequest) {
    try {
        const { id } = await req.json();

        if (!id) {
            return NextResponse.json(
                { message: "User ID is required" },
                { status: 400 }
            );
        }

        const updateUser = await User.findByIdAndUpdate(id, {
            isSubscribed: true,
        });

        if (!updateUser) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ message: "User is subscribed" });
    } catch (err: any) {
        console.error("Error subscribing user:", err);
        return NextResponse.json(
            { message: "Internal Server Error", error: err.message },
            { status: 500 }
        );
    }
}
