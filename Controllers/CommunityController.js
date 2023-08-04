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
    
    const { name,userId,username,profile,bio,worksAt} = req.body;
  
    try {
        
       const existingUser= await CommunityModel.findOne({$and:[{ 'name':name},{'users.userId':userId}]});
       if(!existingUser){
        await CommunityModel.findOneAndUpdate({'name':name},{ $push: { users: {userId:userId,username:username,profile:profile,bio:bio,worksAt:worksAt} } });
        await UserModel.findOneAndUpdate({_id:userId},{$push:{community:name}})
        res.status(200).json("user added ")
       }else{
        res.status(200).json("you are already added")
       }
      
    } catch (error) {
      res.status(500).json(error);
    }
  };

  export const getcommunityPost=async(req,res)=>{
      const name=req.params.name;
      try {
        
        const communityPosts=await PostModel.find({community:name})
        res.status(200).json(communityPosts);
      } catch (error) {
        res.status(500).json(error);
        
      }

  }
  