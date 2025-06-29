import { NextResponse } from "next/server";
import Article from "@/model/article.model";
import mongoose from "mongoose";

async function connectToDatabase() {
  if (mongoose.connection.readyState === 0) {
    try {
      console.log("Connecting to the database...");
      await mongoose.connect(process.env.MONGO_URI || "", {
      
      });
      console.log("Database connection established.");
    } catch (error) {
      console.error("Error connecting to the database:", error);
      throw new Error("Database connection failed.");
    }
  }
}

export async function GET() {
  try {
    console.log("Request received at /api/artical/get_post");

    await connectToDatabase();

    // Fetch articles and populate 'user' with username
    const articles = await Article.find().populate("user", "username");

    console.log("Articles fetched successfully:", articles);

    return NextResponse.json(
      { message: "Posts are successfully fetched!", articles },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching articles:", error);
    return NextResponse.json(
      { message: "Something went wrong.", error: error.message },
      { status: 500 }
    );
  }
}