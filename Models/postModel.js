import mongoose from "mongoose";

const postSchema = mongoose.Schema(
  {
    userId: { type: String, required: true },
    username: { type: String, required: true },
    profilePicture:String,
    heading:String,
    desc: String,
    likes: [],
    comments:[{userId:String,username:String,comment:String}],
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
