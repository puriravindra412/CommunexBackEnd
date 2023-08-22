import CommunityModel from "../Models/communityModel.js";
import PostModel from "../Models/postModel.js";
import UserModel from "../Models/userModel.js";

export const search = async (req, res) => {
    const query=req.params.search;
    
    try {
      const posts = await PostModel.find({
        $or: [
          { username: { $regex: query, $options: "i" } },
          { community: { $regex: query, $options: "i" } }
        ]
      });
  
      const communities = await CommunityModel.find({
        name: { $regex: query, $options: "i" }
      });
  
      const users = await UserModel.find({
        $or: [
          { username: { $regex: query, $options: "i" } },
          { firstname: { $regex: query, $options: "i" } },
          { lastname: { $regex: query, $options: "i" } },
          { email: { $regex: query, $options: "i" } },
          { city: { $regex: query, $options: "i" } },
          { worksAt: { $regex: query, $options: "i" } }
        ]
      }).select('-password');;

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
      
      const result = { posts: validPosts, community: communities, users: users };
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json(error);
    }
  };