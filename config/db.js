
const mongoose = require("mongoose")

exports.connectDb = ()=>{
    mongoose.connect(process.env.MONGO_URI)
    .then(()=>{console.log("Database Contected Successfully")})
    .catch((err)=>{console.log(err.message)})
}
