import mongoose from 'mongoose' ; 
import { Schema, model } from 'mongoose';

const postSchema = new Schema({
    content: {
        type: String,
        required: [true, 'Content is required'],
    },
    title: {
        type: String,
        required: [true, 'Title is required'],
    },
    likes: {
        type: Number,
        default: 0,
    },
    comments: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment',
        }]
    },
    media: {
        public_id: {
            type: String,
        },
        secure_url: {
            type: String,
        }
    } , 
    tags: [{
        type: String , 
        default: 'Discussion' , 
    }] , 
    user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User' , 
    } , 
    
     
}, {
    timestamps: true
});

const Post = model('Post', postSchema);

export default Post;
