import mongoose from 'mongoose'


const CommentSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
       ref:'User',
       required:true
   },
   parent:{
    type:String,
    enum:["Post","Reel"],
    id:{
        type: mongoose.Schema.Types.ObjectId,
        required:true
    }
   },
   text:{
    type:String,
    required:true,
   },
   ceatedAt:{
    type:Date,
    default:Date.now
   }
})

export const CommentModel=mongoose.model('CommentSchema',CommentSchema)