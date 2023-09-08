const express = require('express')
const mongoose =require("mongoose") ;
const jwt =require("jsonwebtoken");
var cors = require('cors');
require("dotenv").config()



const MAIN_KEY = process.env.MAIN_KEY
const REFRESH_KEY = process.env.REFRESH_KEY




const app = express()
app.use(cors())
app.use(express.urlencoded( {extended: true }) )
app.use(express.json()) ;


app.get('/' ,(req,res) => res.send('Hello'))


const userRouter = require("./features/user/user.router");
const postRouter = require("./features/post/post.router");


app.use("/user",userRouter);
app.use("/posts", postRouter);

app.post("/refresh" ,async (req,res) => {
    const refreshtoken =req.headers.authorization ;

    try{
        // if the refresh token is valid, then generate the main token
        const data =jwt.verify(refreshtoken , REFRESH_KEY);
        console.log(data)  //this will give data of that particular user
        const maintoken = jwt.sign(data, MAIN_KEY) ;
        // this above line is for generating a new main token
        return res.send( { token: maintoken }) ;
    }
    catch(e) {
        // here we will go when verify is giving error, i.e., the refresh token is not correct , or secret key of refresh token(REFRESHTOKEN1234) is not correct
       console.log(e)
        return res.send("Refresh token invalid") ;
    }
    // the job of refresh 
})





mongoose.connect("mongodb://localhost:27017/nem201").then(() => {
    app.listen(8080 ,() => {
        console.log('Server started on port 8080') } )
}).catch((er)=> {
    console.log("This is error"+er)
})