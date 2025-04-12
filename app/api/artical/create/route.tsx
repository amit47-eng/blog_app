import { NextResponse } from "next/server"; // Corrected import
import Article from "@/model/article.model";
import mongoose from "mongoose";

// Utility function to connect to the database
async function connectToDatabase() {
  if (mongoose.connection.readyState === 0) {
    try {
      console.log("Connecting to the database...");
      await mongoose.connect(process.env.MONGO_URI || "", {
        // Removed deprecated options
      });
      console.log("Database connection established.");
    } catch (error) {
      console.error("Error connecting to the database:", error);
      throw new Error("Database connection failed.");
    }
  }
}

export async function POST(req: Request) {
  try {
    console.log("Request received at /api/artical/create");
    console.log("Request method:", req.method);
    console.log("Request headers:", JSON.stringify(Object.fromEntries(req.headers.entries())));

    const body = await req.json();
    console.log("Request body:", body);

    const { title, description, user, tags } = body;

    // Validate required fields
    if (!title) {
      console.error("Validation error: Title is missing.");
      return NextResponse.json(
        { message: "Title must be filled." },
        { status: 400 }
      );
    }
    if (!description) {
      console.error("Validation error: Description is missing.");
      return NextResponse.json(
        { message: "Description must be filled." },
        { status: 400 }
      );
    }

    // Ensure database connection
    await connectToDatabase();

    // Create the article
    const newArticle = new Article({
      article_title: title,
      article_description: description,
      user,
      tags,
    });

    await newArticle.save();
    console.log("Article created successfully:", newArticle);

    return NextResponse.json(
      { message: "Article created successfully!", article: newArticle },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating article:", error);

    // Handle Mongoose buffering errors
    if (error.name === "MongooseError" && error.message.includes("buffering timed out")) {
      return NextResponse.json(
        { message: "Database operation timed out. Please try again later." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "An error occurred while creating the article.", error: error.message },
      { status: 500 }
    );
  }
}
