import PostModel from "../Models/postModel.js";
import mongoose from "mongoose";
import UserModel from "../Models/userModel.js";

// Creat new Post
export const createPost = async (req, res) => {
  const newPost = new PostModel(req.body);

  try {
    await newPost.save();
    res.status(200).json(newPost);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getAllPost = async (req, res) => {
  

  try {
    const recentPosts = await PostModel.find({})
      .sort({ createdAt: -1 }) // Sort by 'createdAt' in descending order (most recent first)
      .limit(7); // Limit the result to 7 posts
res.status(200).json(recentPosts)

  } catch (error) {
    res.status(500).json(error);
  }
};


export const getBlogs= async (req, res) => {
  

  try {
    const blogs=await PostModel.aggregate([
      {
        $group: {
          _id: "$userId",
          totalPosts: { $sum: 1 },
          totalLikes: { $sum: { $size: "$likes" } },
          totalComments: { $sum: { $size: "$comments" } }
        }
      },
      {
        $sort: {
          totalPosts: -1,
          totalLikes: -1,
          totalComments: -1
        }
      },
      {
        $limit: 5
      }
    ])


    const mostEngagedUsersData = await Promise.all(
      blogs.map(async (userStats) => {
        const user = await UserModel.findOne(
          { _id: userStats._id },
          { username: 1, profilePicture: 1 }
        );

        if (user) {
          return {
            _id: user._id,
            username: user.username,
            profilePicture: user.profilePicture,
          };
        }

        return null; // In case the user is not found
      })
    );

    // Filter out any null elements (users not found)
    const filteredData = mostEngagedUsersData.filter((data) => data !== null);

    
   
res.status(200).json(filteredData)

  } catch (error) {
    res.status(500).json(error);
  }
};









// Get a post

export const getPost = async (req, res) => {
  const id = req.params.id;

  try {
    const post = await PostModel.findById(id);
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json(error);
  }
};

// Update a post
export const updatePost = async (req, res) => {
  const postId = req.params.id;
  const { userId } = req.body;

  try {
    const post = await PostModel.findById(postId);
    if (post.userId === userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).json("Post Updated");
    } else {
      res.status(403).json("Action forbidden");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// Delete a post
export const deletePost = async (req, res) => {
  const id = req.params.id;
  const { userId } = req.body;

  try {
    const post = await PostModel.findById(id);
    if (post.userId === userId) {
      await post.deleteOne();
      res.status(200).json("POst deleted successfully");
    } else {
      res.status(403).json("Action forbidden");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// like/dislike a post
export const likePost = async (req, res) => {
  const id = req.params.id;
  const { userId } = req.body;

  try {
    const post = await PostModel.findById(id);
    if (!post.likes.includes(userId)) {
      await post.updateOne({ $push: { likes: userId } });
      res.status(200).json("Post liked");
    } else {
      await post.updateOne({ $pull: { likes: userId } });
      res.status(200).json("Post Unliked");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};


export const commentPost = async (req, res) => {
  const id = req.params.id;
  
  const { userId ,username,comment } = req.body;

 

  try {
    const Comment = await PostModel.findById(id);
    
      await Comment.updateOne({ $push: { comments:{userId,username,comment}} });
      res.status(200).json("comment added");
   
    }
   catch (error) {
    res.status(500).json(error);
  }
};

// Get Timeline POsts
export const getTimelinePosts = async (req, res) => {
  const userId = req.params.id;

  try {
    const currentUserPosts = await PostModel.find({ userId: userId });
    const followingPosts = await UserModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "posts",
          localField: "following",
          foreignField: "userId",
          as: "followingPosts",
        },
      },
      
      {
        $project: {
          followingPosts: 1,
          _id: 0,
        },
      },
    ]);

    res
      .status(200)
      .json(currentUserPosts.concat(...followingPosts[0].followingPosts)
      .sort((a,b)=>{
          return b.createdAt - a.createdAt;
      })
      );
  } catch (error) {
    res.status(500).json(error);
  }
};
