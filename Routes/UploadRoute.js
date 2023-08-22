import express from "express";
import cloudinary from "../utils/cloudinary.js";
import multerConfig from  "../Middleware/multer.js";


const router = express.Router();

router.post("/", multerConfig.single("image"), async (req, res) => {
  
  try {
    // Upload image to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);
    // Create new user
    let data = {
      url: result.secure_url,
      cloudinary_id: result.public_id,
    }
    // Save user
    
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "An error occurred during user creation." });
  }
});

export default router;