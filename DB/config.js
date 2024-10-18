const mongoose=require("mongoose");

mongoose.connect('mongodb://127.0.0.1:27017/Comic').then(()=>{
    console.log("connection to database done!!");
}).catch((err)=>{
    console.log("error in connecting to local database");
})
