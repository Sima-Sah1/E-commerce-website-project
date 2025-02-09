import express ,{Application,Request,Response}from 'express'

const app:Application = express()
const PORT:number = 3000

import * as dotenv from 'dotenv'
dotenv.config()

import './database/connection'

import userRoute from './routes/UserRoutes'

app.get("/",(req:Request,res:Response)=>{
    res.send("Hello World")

})
app.get("/about",(req:Request,res:Response)=>{
    res.send("About Page")
})

app.listen(PORT,()=>{
    console.log("Server has started at port", PORT)
})
