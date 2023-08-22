import mongoose from "mongoose";

const UserSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: true
        },
        password : {
            type: String,
            required: true
        },
        firstname: {
            type: String,
            required: true
        },
        lastname : {
            type: String,
            required: true
        },
        email : {
            type: String,
            required: true,
        },
        isAdmin : {
            type: Boolean,
            default: false,
        },
        
        profilePicture: String,
        bio:String,
        coverPicture: String,
        city: String,
        worksAt: String,
        github: String,
        linkedin: String,
        website: String,
        followers: [],
        community: [],
        hashtag: [],
        following: [],
        savedPosts:[]
    },
    {timestamps: true}
)

var UserModel= mongoose.model("Users", UserSchema);
export default UserModel;