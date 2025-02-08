

const signIn = async (req , res , next) => {
    try {
        const { username , email , password} = req.body ; 

        if(!username || !email || !password){
            throw new Error('All fields are required') ; 
        }

        
    } catch (error) {
         res.send({success: false , message : error.message}) ; 
    }
}