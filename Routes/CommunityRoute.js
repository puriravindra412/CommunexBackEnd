import express from "express";
import {createCommunity,addUserToCommunity,getCommunity, getcommunityPost} from "../Controllers/CommunityController.js";
const router = express.Router();
router.post('/', createCommunity)
router.put('/addUser', addUserToCommunity)
router.get('/getCommunity', getCommunity)
router.get('/getCommunityPost/:name', getcommunityPost)
export default router;