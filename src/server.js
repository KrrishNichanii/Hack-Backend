import express from "express" ; 
import dotenv from 'dotenv' ; 
import cors from 'cors' ; 
dotenv.config();
import cookieParser from 'cookie-parser' ; 
import mongoose from 'mongoose' ; 
import userRouter from './routes/user.router.js' ; 
import postRouter from './routes/post.router.js' ; 

const app = express();
app.use(cors({
  origin: '*',
  credentials: true
}));    

app.use(express.json({limit:"32kb"})) ; 
app.use(express.urlencoded({extended:true ,limit: "32kb"})) ; 
app.use(express.static("public")) ; 
app.use(cookieParser()) ; 



app.get("/ping", (req, res) => {
  res.send('Pong') ; 
}) ; 


// Routes
app.use('/user',userRouter) ; 
app.use('/post',postRouter) ; 

const PORT = process.env.PORT || 8000 ; 

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Successfully connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

app.listen(PORT , () => {
  console.log(`Server running on ${PORT}`);
  
})
 