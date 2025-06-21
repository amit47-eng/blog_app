import User from "../../../../model/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server"; // Use Next.js server request/response
import dbConnect from "../../../../utils/dbConnect"; // Ensure database connection

export async function POST(req: NextRequest) {
  try {
    await dbConnect(); // Ensure database is connected

    let { email, phoneNumber, password } = await req.json(); // Parse JSON body

    if (!process.env.JWT_SECRET) {
      return NextResponse.json({ message: "JWT_SECRET is not defined in environment variables" }, { status: 500 });
    }

    // Allow login with either email or phoneNumber
    let user = null;
    if (email) {
      user = await User.findOne({ email: email });
    } else if (phoneNumber) {
      user = await User.findOne({ phoneNumber: phoneNumber });
    }

    if (!user) {
      return NextResponse.json({ message: "User does not exist, please register" }, { status: 401 });
    }

    let isVerified = await bcrypt.compare(password, user.password);

    if (!isVerified) {
      return NextResponse.json({ message: "Password is incorrect" }, { status: 401 });
    }

    let token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h", algorithm: "HS256" }
    );

    if (token) {
      const response = NextResponse.json({ message: "You have successfully logged in" }, { status: 200 });
      response.cookies.set("myToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 3600,
        path: "/",
      });
      return response;
    }
  } catch (err) {
    console.error(err); // Log the error for debugging
    return NextResponse.json({ message: "Something went wrong", error: err }, { status: 500 });
  }
}