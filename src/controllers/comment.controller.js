import User from '../models/user.model.js';
import Post from '../models/post.model.js';
import Comment from '../models/comment.model.js';

const addCommentToPost = async (req, res) => {
    try{
        const {postId , comment} = req.body ; 
        if(!postId || !comment){
            res.send({success: false , message: "Post ID and Comment are required"}) ; 
        }
        // Add Comment to Post
        const post = await Post.findById(postId) ; 
        post.comments.push(comment) ; 
        await post.save() ; 
        res.send({success: true , post}) ;
    }catch(err){
        res.send({success: false , message: err.message}) ; 
    }
};

const addCommentToComment = async (req, res) => {
    try{
        const {postId , commentId , reply} = req.body ; 
        if(!postId || !commentId || !comment){
            res.send({success: false , message: "Post ID, Comment ID and Comment are required"}) ; 
        }
        // Add Comment to Comment
        const post = await Post.findById(postId) ; 
        const comment = post.comments.id(commentId) ; 
        comment.comments.push(reply) ; 
        await post.save() ; 
        res.send({success: true , post}) ;
    }catch(err){
        res.send({success: false , message: err.message}) ; 
    }
};

const likeComment = async (req, res) => {
    try{
        const {commentId} = req.body ; 
        if(!commentId){
            res.send({success: false , message: "Comment ID are required"}) ; 
        }
        // Like Comment
        const comment = await Comment.findById(commentId) ; 
        comment.likes += 1 ; 
        await comment.save() ; 
        res.send({success: true , post}) ;
    }catch(err){
        res.send({success: false , message: err.message});
    }
};

export { addCommentToPost, addCommentToComment ,likeComment };