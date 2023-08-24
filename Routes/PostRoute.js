import express from "express";
import { createPost, deletePost, getPost, getTimelinePosts, likePost, updatePost,commentPost, getAllPost, getBlogs, getPostComments, deleteCommentPost, getsavedPosts,  getTrendingPosts } from "../Controllers/PostController.js";
const router = express.Router()
router.get('/blog',getBlogs)
router.get('/',getAllPost)
router.post('/', createPost)
router.get('/getTrendingPosts',getTrendingPosts)
router.get('/:id', getPost)
router.get('/:id/savedPosts', getsavedPosts)
router.put('/:id', updatePost)
router.delete("/:id", deletePost)
router.put("/:id/like", likePost)
router.put("/:id/comment", commentPost)
router.put("/:id/deleteComment", deleteCommentPost)
router.get("/:id/timeline", getTimelinePosts)
router.get("/postComments/:id", getPostComments)

export default router;