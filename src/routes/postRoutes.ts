import { Router, type Response } from "express";
import mongoose from "mongoose";
import { Post } from "../models/PostModel.js";
import { protect, type AuthRequest } from "../middleware/authMiddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/appError.js";

const postRouter: Router = Router();

// ======================================================
// POST - Create Post (Auth Required)

postRouter.post(
  "/",
  protect,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { title, content, tags, status } = req.body;

    const post = await Post.create({
      title,
      content,
      tags,
      status,
      author: new mongoose.Types.ObjectId(req.user),
    });

    res.status(201).json(post);
  }),
);

// ======================================================
// GET - Public Posts With Pagination + Filtering

postRouter.get(
  "/",
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search as string;
    const tag = req.query.tag as string;
    const author = req.query.author as string;
    const status = req.query.status as string;

    const skip = (page - 1) * limit;

    const query: any = {
      deletedAt: null,
    };

    if (status && req.user) {
      query.status = status;
    } else {
      query.status = "published";
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }

    if (tag) {
      query.tags = tag;
    }

    if (author) {
      if (!mongoose.Types.ObjectId.isValid(author)) {
        throw new AppError("Invalid author id", 400);
      }
      query.author = author;
    }

    const posts = await Post.find(query)
      .populate("author", "email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments(query);

    res.json({
      page,
      totalPages: Math.ceil(total / limit),
      total,
      data: posts,
    });
  }),
);

// ======================================================
// GET - Single Published Post by Slug

postRouter.get(
  "/:slug",
  asyncHandler(async (req, res) => {
    const post = await Post.findOne({
      slug: req.params.slug,
      status: "published",
      deletedAt: null,
    }).populate("author", "email");

    if (!post) {
      throw new AppError("Post not found", 404);
    }

    res.json(post);
  }),
);

// ======================================================
// PUT - Update Post (Author Only)

postRouter.put(
  "/:id",
  protect,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throw new AppError("Invalid post id", 400);
    }

    const post = await Post.findById(req.params.id);

    if (!post || post.deletedAt) {
      throw new AppError("Post not found", 404);
    }

    if (post.author.toString() !== req.user) {
      throw new AppError("Not authorized", 403);
    }

    const { title, content, tags, status } = req.body;

    if (title !== undefined) post.title = title;
    if (content !== undefined) post.content = content;
    if (tags !== undefined) post.tags = tags;
    if (status !== undefined) post.status = status;

    await post.save();

    res.json(post);
  }),
);

// ======================================================
// DELETE - Soft Delete Post (Author Only)

postRouter.delete(
  "/:id",
  protect,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throw new AppError("Invalid post id", 400);
    }

    const post = await Post.findById(req.params.id);

    if (!post || post.deletedAt) {
      throw new AppError("Post not found", 404);
    }

    if (post.author.toString() !== req.user) {
      throw new AppError("Not authorized", 403);
    }

    post.deletedAt = new Date();
    await post.save();

    res.json({ message: "Post deleted" });
  }),
);

export default postRouter;
