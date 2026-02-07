import mongoose, { Schema, Document, Types } from "mongoose";
import slugify from "slugify";

export interface IPost extends Document {
  title: string;
  slug: string;
  content: string;
  author: Types.ObjectId;
  status: "draft" | "published";
  tags: string[];
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      unique: true,
      index: true,
    },

    content: {
      type: String,
      required: true,
    },

    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },

    tags: {
      type: [String],
      default: [],
    },

    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

PostSchema.pre("save", async function () {
  if (this.title) {
    this.slug = slugify(this.title, {
      lower: true,
      strict: true,
      trim: true,
    });
  }
});

export const Post = mongoose.model<IPost>("Post", PostSchema);
