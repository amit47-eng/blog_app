import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";


import Article from "@/model/article.model";
import User from "@/model/user.model";

async function connectToDatabase() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI || "");
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();

    const body = await req.json();
    const { title, description, tags } = body;

    if (!title || !description) {
      return NextResponse.json(
        { message: "Title and description are required." },
        { status: 400 }
      );
    }

    // 1) Read token from HTTP-only cookie
    // IMPORT at top

// … inside your handler …
const cookieStore = await cookies();
const token       = cookieStore.get("myToken")?.value;
if (!token) {
  return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
}


    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized: no token provided" },
        { status: 401 }
      );
    }

    // 2) Verify & extract userId
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "") as any;
    const userId = decoded.id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { message: "Invalid token: bad user ID" },
        { status: 401 }
      );
    }

    // 3) Create article
    const newArticle = new Article({
      article_title: title,
      article_description: description,
      user: userId,
      tags,
    });
    await newArticle.save();


    await User.findByIdAndUpdate(userId, {
      $push: { article: newArticle._id },
    });

    return NextResponse.json(
      { message: "Article created successfully!", article: newArticle },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Error creating article:", err);
    return NextResponse.json(
      { message: "Error creating article", error: err.message },
      { status: 500 }
    );
  }
}
