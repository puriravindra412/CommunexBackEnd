import UserModel from "../Models/userModel.js";
import bcrypt from "bcrypt";
// get a User
export const getUser = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await UserModel.findById(id);

    if (user) {
      const { password, ...otherDetails } = user._doc;

      res.status(200).json(otherDetails);
    } else {
      res.status(404).json("No such user exists");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// update a user
export const updateUser = async (req, res) => {
  
  const id = req.params.id;
  
  const currentUserId = req.body._id;
  const currentUserAdminStatus = req.body.isAdmin;
  
console.log(id===currentUserId)
  if (id === currentUserId || currentUserAdminStatus) {
    try {
      

      const user = await UserModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("Access Denied! you can only update your own profile");
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  const id = req.params.id;

  const { currentUserId, currentUserAdminStatus } = req.body;

  if (currentUserId === id || currentUserAdminStatus) {
    try {
      await UserModel.findByIdAndDelete(id);
      res.status(200).json("User deleted successfully");
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("Access Denied! you can only delete your own profile");
  }
};

// Follow a User
// changed
export const followUser = async (req, res) => {
  const id = req.params.id;
  const { _id } = req.body;
  console.log(id, _id)
  if (_id == id) {
    res.status(403).json("Action Forbidden");
  } else {
    try {
      const followUser = await UserModel.findById(id);
      const followingUser = await UserModel.findById(_id);

      if (!followUser.followers.includes(_id)) {
        await followUser.updateOne({ $push: { followers: _id } });
        await followingUser.updateOne({ $push: { following: id } });
        res.status(200).json("User followed!");
      } else {
        res.status(403).json("you are already following this id");
      }
    } catch (error) {
      console.log(error)
      res.status(500).json(error);
    }
  }
};

// Unfollow a User
// changed
export const unfollowUser = async (req, res) => {
  const id = req.params.id;
  const { _id } = req.body;

  if(_id === id)
  {
    res.status(403).json("Action Forbidden")
  }
  else{
    try {
      const unFollowUser = await UserModel.findById(id)
      const unFollowingUser = await UserModel.findById(_id)


      if (unFollowUser.followers.includes(_id))
      {
        await unFollowUser.updateOne({$pull : {followers: _id}})
        await unFollowingUser.updateOne({$pull : {following: id}})
        res.status(200).json("Unfollowed Successfully!")
      }
      else{
        res.status(403).json("You are not following this User")
      }
    } catch (error) {
      res.status(500).json(error)
    }
  }
};

// Add a community to a user
export const addCommunityUser = async (req, res) => {
  const id = req.params.id;
  const {community}=req.body;
 
    try {
      const addCommunity = await UserModel.findById(id);
      
     
      if (!addCommunity.community.includes(community)) {
        await addCommunity.updateOne({ $push: { community: community} });
        
        res.status(200).json("community added!");
      } else {
        res.status(403).json("adlready added to community");
      }
    } catch (error) {
      res.status(500).json(error);
    }
 
};

export const addHashtagUser = async (req, res) => {
  const id = req.params.id;
  const {hashtag}=req.body;
 
    try {
      const addhashtag = await UserModel.findById(id);
      
     
      if (!addhashtag.hashtag.includes(hashtag)) {
        await addhashtag.updateOne({ $push: { hashtag: hashtag} });
        
        res.status(200).json("hashtag added!");
      } else {
        res.status(403).json("adlready added to community");
      }
    } catch (error) {
      res.status(500).json(error);
    }
 
};
