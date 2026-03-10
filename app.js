

const express = require("express")
const { connectDb } = require("./config/db")

const app = express()

app.use(express.json())


app.get("/", async (req, res)=>{
    return res.status(200).json({status:true , message:"App is working awesome"})
})

connectDb()

module.exports = app