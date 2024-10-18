const mongoose=require("mongoose");
const bcrypt=require("bcrypt")

const UserSchema=new mongoose.Schema({
    name:{
        type:String,
        require:true,
    },
    role:{
        type:String,
        require:true,
    },
    email:{
        type:String,
        require:true,
        unique:true
    },
    password:{
        type:String,
        require:true
    }
})

UserSchema.pre('save',async function(next){
    // BcrypJs for encypting the password for security reasons.
    this.password= bcrypt.hash(this.password,10);
   
    next();
})

module.exports=mongoose.model('users',UserSchema);