import mongoose from 'mongoose'
const CommentSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
       ref:'User',
       required:true
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
const ReelSchema= new mongoose.Schema({
    user:{
         type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    videoUrl:{
        type:String,
        required:true
    },
    caption:[{
     type:String,
     required:true
    }],
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: [], // Array of user IDs who liked the Reel
    }],
    comments:[CommentSchema],
    ceatedAt:{
        type:Date,
        default:Date.now
    },
    share:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: [], // Array of user IDs who liked the Reel
    }],
    views:{
        type:Number,
        default:0
    },
    visibility:{
        type:String,
        enum:['public','department','org'],
        default:""
    },
    tags:[{
        type:String,
        default:""
    }],
    relatedCourse:{
        type:String,
        default:''
    }
    
})

export const ReelModel=mongoose.model('Reel',ReelSchema)