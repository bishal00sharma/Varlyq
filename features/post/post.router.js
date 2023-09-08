const express = require("express") ;
const Post = require("./post.schema") ;
const jwt =require("jsonwebtoken");
const app = express.Router() ;
app.use(express.json()) ;
require("dotenv").config()

const MAIN_KEY = process.env.MAIN_KEY


app.get("/:id", async (req,res) => {
        const { id } = req.params ;

    const token =req.headers["authorization"] ;

    if(!token){
        return res.status(401).send("Unauthorized");
    }
    try {
        const verification =jwt.verify( token, MAIN_KEY);
        //console.log("verification", verification);
        const post = await Post.findById(id) ;
        return res.send(post)
    }
    catch(e){
        console.log(e.message) ;
        return res.status(401).send("Token is invalid");
    }
})

app.post("/create", async(req,res) => {
    try{
    const post=  await Post.create(req.body);
    res.send("Post created")
    }
    catch(err){
        res.status(500).send(err.message);
    }
   
})


app.delete("/:id", async(req, res)=>{
    const { id } = req.params ;

    const token =req.headers["authorization"] ;

    if(!token){
        return res.status(401).send("Unauthorized");
    }
    try{
        let post = await Post.deleteOne({"_id":id})
        res.send(post);
   }
   catch(err){
       res.status(500).send(err.message);
   }
})

app.patch("/:id", async (req,res)=>{
    const { id } = req.params ;

    const token =req.headers["authorization"] ;

    if(!token){
        return res.status(401).send("Unauthorized");
    }
    try{
        let id = req.params.id;
        let update = await Cart.updateOne({"_id":id},{$set:{ ...req.body}});
        res.status(200).send(update);
    }
    catch(err){
        res.status(500).send(err.message);
    }
    
  })
  module.exports =app; 