import { Router } from 'express' ; 
import { upload } from '../middlewares/multer.middleware.js';
import { createPost } from '../controllers/post.controller.js';


const router = Router() ; 

router.post('/create' , upload.single('media') , createPost) ;

 
 export default router ; 