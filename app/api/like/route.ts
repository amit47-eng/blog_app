import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import Like from "@/model/like.model";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get("postId");
    if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
      return NextResponse.json({ message: "Invalid postId" }, { status: 400 });
    }
    const likes = await Like.find({ article: postId });
    return NextResponse.json(likes, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ message: "Error fetching likes", error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get("postId");
    if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
      return NextResponse.json({ message: "Invalid postId" }, { status: 400 });
    }

    // Get user from cookie
    const cookieStore = await cookies();
    const token = cookieStore.get("myToken")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "") as any;
    const userId = decoded.id;

    // Prevent duplicate likes
    const existing = await Like.findOne({ article: postId, user: userId });
    if (existing) {
      return NextResponse.json({ message: "Already liked" }, { status: 200 });
    }

    await Like.create({ article: postId, user: userId });
    const likes = await Like.find({ article: postId });
    return NextResponse.json(likes, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ message: "Error liking post", error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get("postId");
    if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
      return NextResponse.json({ message: "Invalid postId" }, { status: 400 });
    }

    // Get user from cookie
    const cookieStore = await cookies();
    const token = cookieStore.get("myToken")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "") as any;
    const userId = decoded.id;

    await Like.deleteOne({ article: postId, user: userId });
    const likes = await Like.find({ article: postId });
    return NextResponse.json(likes, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ message: "Error unliking post", error: err.message }, { status: 500 });
  }
}
