import { timeStamp } from "console";
import mongoose from "mongoose";

const communitySchema=mongoose.Schema(
    {
        name:{type:String,required:true},
        image:String,
        users:[{
            userId:String,username:String,profile:String,bio:String,worksAt:String},
        ],
        posts:[]
        
    },
    {
        timestamps:true,
    }
);
var CommunityModel=mongoose.model('Commuinty',communitySchema);
export default CommunityModel;