import mongoose, { Document, Schema } from "mongoose"
const articleSchema = new mongoose.Schema(
  {
    article_title: {
      type: String,
      required: [true, "Kindly provide the Post"],
    },
    article_description: {
      type: String,
      minLength: 10,
      maxLength: 200,
      required: [true, "Kindly Provide the Article Description"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    article_image_url: {
      type: String,
      default: "",
    },
    tags: {
      type: String,
      enum: ["lifestyle", "tech", "food"],
      required: true,
      default: "lifestyle",
    },
  },
  { timestamps: true }
);

const Article = mongoose.models.Article || mongoose.model("Article", articleSchema);
export default  Article ;