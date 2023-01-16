const express = require('express')
const { connections } = require('./config/db')
const { UserModel } = require('./models/user.model')
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const { postRoutes } = require('./routes/post.route')
const app=express()


app.use(express.json())
require("dotenv").config()


app.get("/",(req,res,next) => {
    res.send("hellow")
})
app.use('/post',postRoutes)

app.post("/signup",async(req,res,next)=>{
const {email,name,gender,password}=req.body

const userPresent=await UserModel.findOne({email})
if(userPresent){
    res.send("User already exist ,Please Log In")
}else {
    try {
        bcrypt.hash(password, 4,async(err,hash)=>{
            if(err){
                console.log(err)
            }else{
                const user=new UserModel({email,name,gender,password:hash})
                await user.save()
                res.send("Signup successfully")
            }
        })
    } catch (error) {
        console.log(error)
        console.log("Error in Signup")
    }
}
})

app.post("/login",async(req,res,)=>{
    const {email,password}=req.body
    try {
        const user=await UserModel.find({email})
        if(user.length>0){
            const hashed_pass=user[0].password
            bcrypt.compare(password,hashed_pass,(err,result)=>{
                if(result){
                    const token=jwt.sign({userID:user[0]._id },"private")
                    res.send({msg:"Login successfully",token:token})
                }else{
                    res.send("Login Failed")
                }
            })
        }else{
            res.send("Login Failed")
        }
    } catch (err) {
        console.log(err)
        res.send("Something went wrong")
    }
})


app.listen(process.env.port,async(req,res,next)=>{
    try {
        await connections;
        console.log("Connected to db successfully")
    } catch (error) {
        console.log("Failed to connect to")
        console.log(error)
    }
    console.log("Listening on port 3000")
})