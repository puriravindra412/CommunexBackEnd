import { timeStamp } from "console";
import mongoose from "mongoose";

const communitySchema=mongoose.Schema(
    {
        name:{type:String,required:true},
        image:String,
        intro:String,
        users:[{userId:String}],
        posts:[]
        
    },
    {
        timestamps:true,
    }
);
var CommunityModel=mongoose.model('Commuinty',communitySchema);
export default CommunityModel;