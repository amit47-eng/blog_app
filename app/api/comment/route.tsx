import { NextRequest, NextResponse } from "next/server";
import Comment from "@/model/comment.model";
import Article from "@/model/article.model";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json(); // Parse the request body
    const { article, comment } = body;

    // 1) Validate input
    if (!article || !comment) {
      return NextResponse.json(
        { message: "Article and comment content are required" },
        { status: 400 }
      );
    }

    // 2) Get user from cookie
    const cookieStore = await cookies();
    const token = cookieStore.get("myToken")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "") as any;
    const userId = decoded.id;

    // 3) Create the comment
    const commentDoc = await Comment.create({
      article,
      user: userId,
      content: comment,
    });

    // 4) Add comment to article
    const post = await Article.findOne({ _id: article });
    if (!post) {
      return NextResponse.json({ message: "Article not found" }, { status: 404 });
    }
    if (!post.comments) post.comments = [];
    post.comments.push(commentDoc._id);
    await post.save();

    return NextResponse.json(
      {
        message: "Comment is created successfully!",
        response: commentDoc,
      },
      { status: 201 }
    );
  } catch (error) {
    const err = error as Error;
    console.error("Error creating comment:", err);
    return NextResponse.json(
      { message: "Something went wrong!", error: err.message },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get("postId");
    if (!postId) {
      return NextResponse.json({ message: "Missing postId" }, { status: 400 });
    }
    // Find comments for the article, populate username if needed
    const comments = await Comment.find({ article: postId })
      .populate("user", "username")
      .sort({ createdAt: 1 });
    return NextResponse.json(comments, { status: 200 });
  } catch (error) {
    const err = error as Error;
    console.error("Error fetching comments:", err);
    return NextResponse.json(
      { message: "Something went wrong!", error: err.message },
      { status: 500 }
    );
  }
}


