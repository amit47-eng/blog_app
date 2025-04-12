import { NextRequest, NextResponse } from "next/server";
import Comment from "@/model/comment.model";
import Article from "@/model/article.model";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json(); // Parse the request body
    const comment = await Comment.create(body);

    if (comment) {
      const post = await Article.findOne({ _id: comment.article });
      if (!post) {
        return NextResponse.json({ message: "Article not found" }, { status: 404 });
      }

      post.comments.push(comment._id);
      await post.save();

      return NextResponse.json(
        {
          message: "Comment is created successfully!",
          response: comment,
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Something went wrong!", error: error.message },
      { status: 500 }
    );
  }
}


