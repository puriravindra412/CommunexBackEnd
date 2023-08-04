import express from "express";
import { createPost, deletePost, getPost, getTimelinePosts, likePost, updatePost,commentPost, getAllPost, getBlogs } from "../Controllers/PostController.js";
const router = express.Router()
router.get('/blog',getBlogs)
router.get('/',getAllPost)
router.post('/', createPost)

router.get('/:id', getPost)
router.put('/:id', updatePost)
router.delete("/:id", deletePost)
router.put("/:id/like", likePost)
router.put("/:id/comment", commentPost)
router.get("/:id/timeline", getTimelinePosts)
export default router;