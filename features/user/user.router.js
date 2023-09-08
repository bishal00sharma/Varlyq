const express = require("express") ;
const User = require("./user.schema") ;
const jwt =require("jsonwebtoken");
const app = express.Router() ;
app.use(express.json()) ;
const bcrypt = require('bcrypt')
require("dotenv").config()

const MAIN_KEY = process.env.MAIN_KEY
const REFRESH_KEY = process.env.REFRESH_KEY

const MAIN_EXP = process.env.MAIN_EXP
const REFRESH_EXP = process.env.REFRESH_EXP



app.post("/signup", async(req,res) => {

    try{
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(req.body.password, salt);
       const { name, email,password, mobile } =req.body ;
    const user=  await User.create({ name, email,password: hashedPass, mobile });
    res.send("User created")
    }
    catch(e) {
        res.status(500).send(err.message);
    }
   
})

app.post("/login",async(req,res) =>{
    try{
   
    const user =await User.findOne( {email: req.body.email}) ;
    if(!user){
       return res.send("Invalid credintials" ) ;
    }
    
    
    const token = jwt.sign( 
        { id: user._id , email: user.email , mobile: user.mobile } ,
        MAIN_KEY,{
            expiresIn: MAIN_EXP ,
        } //we have option to give expiry of token also
    );
    const refreshtoken= jwt.sign( {id: user._id , email: user.email , mobile: user.mobile} , REFRESH_KEY ,{ expiresIn :REFRESH_EXP}) ;
    // we are generating the refresh token here
    

    bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          console.error('Error comparing passwords:', err);
          return res.status(500).json({ message: 'Internal server error' });
        }
    
        if (result) {
          // Passwords match, user is authenticated
          return res.send({message: "Login in succesfully" , token ,refreshtoken});
        } else {
          // Passwords do not match, authentication failed
          return res.status(401).json({ message: 'Authentication failed' });
        }
      });
    }
    catch(e) {
        res.status(500).send(err.message);
    }

}) 

app.delete("/:id", async(req, res)=>{
    try{
        let id = req.params.id;
        let user = await User.deleteOne({"_id":id})
        res.send(user);
   }
   catch(err){
       res.status(500).send(err.message);
   }
})

app.patch("/:id", async (req,res)=>{
    try{
        let id = req.params.id;
        let update = await User.updateOne({"_id":id},{$set:{ ...req.body } });
        res.status(200).send(update);
    }
    catch(err){
        res.status(500).send(err.message);
    }
    
  })


module.exports =app; 