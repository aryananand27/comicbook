const mongoose = require("mongoose");

const BookSchema=new mongoose.Schema({

    managerId:{
        type:String,
        require:true,
        unique:true
    },
    comicBooks:[
        {
            bookName:{
                type:String,
                require:true,
                unique:true
            },
            authorName:{
                type:String,
                require:true,
                unique:true
            },
            yearOfPublication:{
                type:String,
                require:true,
            },
            price:{
                type:String,
                require:true,
            },
            numberOfPages:{
                type:Number,
                require:true,
            },
            condition:{
                type:String,
                require:true,
                default:"New"
            },
            discount:{
                type:String,
                default:null
            },
            
            
            description:{
                type:String,
                default:null
            }
        }
    ]

  
});

module.exports=mongoose.model('inventories',BookSchema);