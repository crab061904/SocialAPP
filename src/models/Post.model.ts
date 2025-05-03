import mongoose from 'mongoose'
import { CommentModel } from './comments.model';
const PostSchema= new mongoose.Schema({
    user:{
         type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    text:{
        type:String,
    },
    media:[{
     type:String
    }],
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: [], // Array of user IDs who liked the post
    }],
    comments:[CommentModel],
})

export const PostModel=mongoose.model('Post',PostSchema)