import mongoose, { Document, Schema } from "mongoose"

const commentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: [true, '"Kindly fill the comment'],
    },
    article: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Article",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);
export default Comment ;