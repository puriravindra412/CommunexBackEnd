import express from "express";
import {createCommunity,addUserToCommunity,getCommunity, getcommunityPost,getRecentUser} from "../Controllers/CommunityController.js";
const router = express.Router();
router.post('/', createCommunity)
router.put('/addUser', addUserToCommunity)
router.get('/getCommunity', getCommunity)
router.get('/getCommunityPost/:name', getcommunityPost)
router.get('/recentUser',getRecentUser)
export default router;