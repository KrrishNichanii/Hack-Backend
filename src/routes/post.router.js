import { Router } from 'express' ; 
import { upload } from '../middlewares/multer.middleware.js';
import { createPost, deletePost, getAllPosts, getPostsByUserId, likePost } from '../controllers/post.controller.js';


const router = Router() ; 

router.post('/create' , upload.single('media') , createPost) ;
router.post('/like', likePost) ;
router.delete('/delete', deletePost) ;
router.get('/user/:userId', getPostsByUserId) ;
router.get('/', getAllPosts) ;

 
export default router ; 