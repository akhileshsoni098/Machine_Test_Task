const User = require("../model/userModel");

const jwt = require("jsonwebtoken")


// token verification 

exports.middileware = async (req, res)=>{
    try{


        
    }catch(err){
        return res.status(500).json({status:false , message:err.message})
    }
}