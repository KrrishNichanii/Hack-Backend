import { Router } from 'express' ; 
import { addCommentToComment, addCommentToPost } from '../controllers/comment.controller.js';


const router = Router() ; 

router.post('/post/create', addCommentToPost) ;
router.post('/comment/create', addCommentToComment) ;

 
export default router ; 