import express from 'express'
import { search } from '../Controllers/SearchController.js';
const router = express.Router()


router.get(`/:search`, search);


export default router;