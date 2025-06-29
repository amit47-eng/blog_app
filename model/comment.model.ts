import mongoose, { Schema, Document } from "mongoose";

export interface IComment extends Document {
  article: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  content: string;
  createdAt: Date;
}

const commentSchema = new Schema<IComment>(
  {
    article: { type: mongoose.Schema.Types.ObjectId, ref: "Article", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

const Comment = mongoose.models.Comment || mongoose.model<IComment>("Comment", commentSchema);
export default Comment;