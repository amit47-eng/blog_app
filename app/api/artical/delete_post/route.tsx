import { NextRequest, NextResponse } from "next/server";
import User from "@/model/user.model";
import Article from "@/model/article.model";

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get("postId");
    const userId = searchParams.get("userId");

    if (!postId || !userId) {
      return NextResponse.json({ message: "Missing postId or userId" }, { status: 400 });
    }

    const user = await User.findOne({ _id: userId });
    if (!user || !user.article.includes(postId)) {
      return NextResponse.json({ message: "You are not authorized to delete this post" }, { status: 400 });
    }

    const post = await Article.findOneAndDelete({ _id: postId });
    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Post deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
  }
}