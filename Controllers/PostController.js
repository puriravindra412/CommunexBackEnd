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
    const posts = await PostModel.find().sort({ createdAt: -1 }); 

    const postPromises = posts.map(async (post) => {
        const user = await UserModel.findOne({ _id: post.userId }, { username: 1, profilePicture: 1 });
        
        if (user) {
            return {
                userDetails: {
                    _id: user._id,
                    username: user.username,
                    profilePicture: user.profilePicture,
                },
                post: post,
            };
        }

        return null; // In case the user is not found
    });

    const postsWithUserDetails = await Promise.all(postPromises);

    // Filter out null values (users not found)
    const validPosts = postsWithUserDetails.filter(post => post !== null);

    res.status(200).json(validPosts);
} catch (error) {
    console.error('Error:', error);
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
        const user = await UserModel.findOne({ _id: userStats._id }, { username: 1, profilePicture: 1 });
        
        if (user) {
          const recentPosts = await PostModel.find({ userId: userStats._id })
            .sort({ createdAt: -1 })
            .limit(3);

          return {
            user: {
              _id: user._id,
              username: user.username,
              profilePicture: user.profilePicture,
            },
            recentPosts: recentPosts,
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


export const getPostComments = async (req, res) => {
   const id=req.params.id
  
try {
    const post = await PostModel.findById(id);
  
    const postPromises = post.comments.map(async (comment) => {
      const user = await UserModel.findOne({ _id: comment.userId }, { username: 1, profilePicture: 1 });
      
      if (user) {
          return {
              userDetails: {
                  _id: user._id,
                  username: user.username,
                  profilePicture: user.profilePicture,
              },
              comment:comment
          };
      }

      return null; // In case the user is not found
  });

  const commentsWithUserDetails= await Promise.all(postPromises);

  // Filter out null values (users not found)
  const validComments = commentsWithUserDetails.filter(post => post !== null);
    res.status(200).json(validComments);
  } catch (error) {
    res.status(500).json(error);
  }
};



export const getsavedPosts=async(req,res)=>{
  const id=req.params.id
  try {
    const user = await UserModel.findById(id)
    
    const postPromise=user.savedPosts.map(async(savedPost)=>{
      const post = await PostModel.findOne({id:savedPost._id});
      
      const userDetails=await UserModel.findOne({_id:post.userId},{username:1,profilePicture:1})
      
      if(userDetails){
        return{
          userDetails,
          post
        }
      }
      
      return null;
    });

    const savedPosts= await Promise.all(postPromise)
    const validSavedPosts = savedPosts.filter(post => post !== null);
    res.status(200).json(validSavedPosts)
    
  } catch (error) {
    res.status(500).json(error)
    
  }
}



// Get a post

export const getPost = async (req, res) => {
  const id = req.params.id;

  try {
    const post = await PostModel.findById(id);
   
    
      const user = await UserModel.findOne({ _id: post.userId }, { username: 1, profilePicture: 1 });
      
      let result=[]
      if (user) {
        result= {
              userDetails: {
                  _id: user._id,
                  username: user.username,
                  profilePicture: user.profilePicture,
              },
              post: post,}
            
      }
      
      

  // Filter out null values (users not found)
  

  res.status(200).json(result);
    
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
    const post = await PostModel.findById(id);
    
      await post.updateOne({ $push: { comments:{userId,username,comment}} });
      const NewPost=await PostModel.findById(id);


      const postPromises = NewPost.comments.map(async (comment) => {
        const user = await UserModel.findOne({ _id: comment.userId }, { username: 1, profilePicture: 1 });
        
        if (user) {
            return {
                userDetails: {
                    _id: user._id,
                    username: user.username,
                    profilePicture: user.profilePicture,
                },
                comment:comment
            };
        }
  
        return null; // In case the user is not found
    });
  
    const commentsWithUserDetails= await Promise.all(postPromises);
  
    // Filter out null values (users not found)
    const validComments = commentsWithUserDetails.filter(post => post !== null);

      res.status(200).json(validComments);
   
    }
   catch (error) {
    res.status(500).json(error);
  }
};

export const deleteCommentPost = async (req, res) => {
  const id = req.params.id;
  
  const { _id } = req.body;

 

  try {
    const Comment = await PostModel.findById(id);
   
      await Comment.updateOne({ $pull: { comments:{_id}} });
      res.status(200).json("comment deleted");
   
    }
   catch (error) {
    res.status(500).json(error);
  }
};

// Get Timeline POsts
export const getTimelinePosts = async (req, res) => {
  const userId = req.params.id;

  try {
    const currentUserPosts = await PostModel.find({ userId: userId }).sort({ createdAt: -1 });
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
    
    const posts=currentUserPosts.concat(...followingPosts[0].followingPosts) .sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    

    

      const postPromises = posts?.map(async (post) => {
        const user = await UserModel.findOne({ _id: post.userId });
        
        if (user) {
            return {
                userDetails: {
                    _id: user._id,
                    username: user.username,
                    profilePicture: user.profilePicture,
                },
                post: post,
            };
        }
  
        return null; // In case the user is not found
    });
    const postsWithUserDetails = await Promise.all(postPromises);
  
    
    
  

  // Filter out null values (users not found)
  const validPosts = postsWithUserDetails.filter(post => post !== null)

    res
      .status(200)
      .json(validPosts)
     
  } catch (error) {
    res.status(500).json(error);
  }
};
