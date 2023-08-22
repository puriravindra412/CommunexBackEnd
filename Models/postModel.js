import mongoose from "mongoose";

const postSchema = mongoose.Schema(
  {
    userId: { type: String, required: true },
    heading:String,
    desc: String,
    likes: [],
    comments:[{userId:String,username:String,comment:String, 
      timestamp: { type: Date, default: Date.now },
    }],
    BannerImage: String,
    hashtags: String,
    community: String
  },
  {
    timestamps: true,
  }
);

var PostModel = mongoose.model("Posts", postSchema);
export default PostModel;
