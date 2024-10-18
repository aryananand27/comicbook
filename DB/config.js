const mongoose=require("mongoose");
require('dotenv').config();
const DB=process.env.DATABASE;

mongoose.connect(DB).then(()=>{
    console.log("connection to database done!!");
}).catch((err)=>{
    console.log("error in connecting to local database");
})
