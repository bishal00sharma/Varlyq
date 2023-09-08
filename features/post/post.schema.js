const mongoose = require("mongoose");

const postSchema= new mongoose.Schema({
    createdBy : { type: mongoose.Schema.Types.ObjectId , ref: "user" , required :true  },
    createdAt: { type:Date },
    updatedAt: { type:Date } ,
    likes_count: { type: Number, required: true },
    comments: [{
       sentBy : { type: mongoose.Schema.Types.ObjectId , ref: "user" } ,
       sendAt: { type:Date },
       liked : { type: mongoose.Schema.Types.ObjectId , ref: "user" } 
    }]
   
})

const Post = mongoose.model( "post" ,postSchema)

module.exports = Post;