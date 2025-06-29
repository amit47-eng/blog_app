import mongoose, { Schema, Document } from "mongoose";

export interface IArticle extends Document {
  article_title: string;
  article_description: string;
  user: mongoose.Types.ObjectId;
  article_image_url?: string;
  tags: string[]; // Allow any tags
  content?: string; // Add a content field for longer text
  summary?: string; // Optional summary
  comments?: mongoose.Types.ObjectId[]; // Add comments field
}

const articleSchema = new Schema<IArticle>(
  {
    article_title: {
      type: String,
      required: [true, "Kindly provide the Post"],
    },
    article_description: {
      type: String,
      minLength: 10,
      maxLength: 200,
      required: [true, "Kindly provide the Article Description"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    article_image_url: {
      type: String,
      default: "",
    },
    tags: {
      type: [String], // Array of strings, any tag
      default: [],
    },
    content: {
      type: String,
      default: "",
    },
    summary: {
      type: String,
      default: "",
    },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment", default: [] }], // Comments array
  },
  { timestamps: true }
);

// Optional index to speed up queries by user
articleSchema.index({ user: 1 });

// Clean up JSON output
articleSchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});

const Article =
  mongoose.models.Article ||
  mongoose.model<IArticle>("Article", articleSchema);
export default Article;
