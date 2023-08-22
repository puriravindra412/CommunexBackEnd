import CommunityModel from "../Models/communityModel.js";
import UserModel from'../Models/userModel.js';
import PostModel from '../Models/postModel.js'
export const createCommunity = async (req, res) => {
  const name=req.body.name;
  const existingCommunity =await CommunityModel.findOne({name:name});
    const newCommunity = new CommunityModel(req.body);
  
    try {
      if(existingCommunity==null){
        await newCommunity.save();
        res.status(200).json("Community created!");
      }
      else{
        res.status(403).json("community already exist");
      }
      
    } catch (error) {
      res.status(500).json(error);
    }
  };


  export const getCommunity = async (req, res) => {
   
  
    try {
      const Communities=await CommunityModel.find();
      res.status(200).json(Communities);
    } catch (error) {
      res.status(500).json(error);
    }
  };
 

  export const addUserToCommunity = async (req, res) => {
    
    const { name,userId} = req.body;
  
    try {
        
       const existingUser= await CommunityModel.findOne({$and:[{ 'name':name},{'users.userId':userId}]});
       console.log(existingUser)
       if(!existingUser){
        const user=await CommunityModel.findOneAndUpdate({'name':name},{$push:{users:{userId:userId}}});
        console.log(user)
        await UserModel.findOneAndUpdate({_id:userId},{$push:{community:name}})
        res.status(200).json("user added ")
       }else{
        res.status(200).json("you are already added")
       }
      
    } catch (error) {
      res.status(500).json(error);
    }
  };

  export const getcommunityPost = async (req, res) => {
    const name = req.params.name;

    try {
        // Find the community by name
        const community = await CommunityModel.findOne({ name: name });

        if (!community) {
            return res.status(404).json({ message: 'Community not found' });
        }

        // Find posts related to the community
        const posts = await PostModel.find({ community: community.name });

        // Fetch user IDs from the community
        const userIds = community.users.map(user => user.userId);

        // Fetch user data for the fetched user IDs
        const usersData = await UserModel.find({ _id: { $in: userIds } }).select('-password');

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
    const validPosts = postsWithUserDetails.filter(post => post !== null);
        // Create an array to hold user data and their associated posts
        const result = {
          usersData,
          post:validPosts
        }

        res.status(200).json({ community: community, result: result });
        
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json(error);
    }
};

export const getRecentUser= async (req, res) => {
  try {
    const recentUsers=await UserModel.find({},{username:1,profilePicture:1,following:1,followers:1,worksAt:1}).limit(10).sort({createdAt:-1})
    res.status(200).json(recentUsers)
    
  } catch (error) {
    res.status(500).json(error)
    
  }
};