import express ,{Application,Request,Response}from 'express'

const app:Application = express()
const PORT:number = 3000

import * as dotenv from 'dotenv'
dotenv.config()

import './database/connection'

import userRoute from './routes/UserRoutes'
import productRoute from './routes/productRoute'
import adminSeeder from './adminSeeder'
app.use(express.json())

//admin seeder
adminSeeder()

//localhost:3000/register
//localhost:3000/hello/register
app.use("",userRoute)
app.use("/admin/product",productRoute)

app.listen(PORT,()=>{
    console.log("Server has started at port", PORT)
})
