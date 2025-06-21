import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

import User from "@/model/user.model";
import Article from "@/model/article.model";

export async function DELETE(req: NextRequest) {
  try {
    // 1) Validate postId
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get("postId");
    if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
      return NextResponse.json(
        { message: "Invalid or missing postId" },
        { status: 400 }
      );
    }

    // 2) Extract & verify token from cookie
    const cookieStore = await cookies();
    const token = cookieStore.get("myToken")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "") as any;
    const userId = decoded.id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { message: "Invalid token: bad user ID" },
        { status: 401 }
      );
    }

    // 3) Fetch the article and check ownership
    const post = await Article.findById(postId);
    if (!post) {
      return NextResponse.json(
        { message: "Post not found" },
        { status: 404 }
      );
    }
    if (post.user.toString() !== userId) {
      return NextResponse.json(
        { message: "You are not authorized to delete this post" },
        { status: 403 }
      );
    }

    // 4) Delete article and pull it from the user's array
    await Article.findByIdAndDelete(postId);
    await User.findByIdAndUpdate(userId, {
      $pull: { article: postId },
    });

    return NextResponse.json(
      { message: "Post deleted successfully" },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Error in DELETE handler:", err);
    return NextResponse.json(
      { message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}
