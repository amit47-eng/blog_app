import { NextRequest, NextResponse } from "next/server";
import User from "../../../../model/user.model";

export async function DELETE(req: NextRequest) {
    try {
        const { email: useremail } = await req.json();

        if (!useremail) {
            return NextResponse.json(
                { message: "Email is required" },
                { status: 400 }
            );
        }

        const response = await User.deleteMany({ email: useremail });

        return NextResponse.json({
            message: "Users deleted successfully",
            response,
        });
    } catch (err: any) {
        console.error("Error deleting users:", err);
        return NextResponse.json(
            { message: "Internal Server Error", error: err.message },
            { status: 500 }
        );
    }
}