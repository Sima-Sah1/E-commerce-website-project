
import {Request,Response} from 'express'
import User from '../database/models/userModel'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { Role } from '../middleware/authMiddleware'

class AuthController{
    public static async registerUser(req:Request,res:Response):Promise<void>{
        try{
        

        const {username,email,password,role}=req.body
        //const userRole = role || Role.customer
        if(!username ||!email || !password ){
            res.status(400).json({
                message : "Please provide username,email,password "
            })
            return
        }
        if(role!==Role.Admin && role!==Role.customer ){
            res.status(400).json({
                message : "User role not valid  "
            })
            return

        }

        await User.create({
            username,
            email,
            password : bcrypt.hashSync(password,8),
            role :role
        })
        res.status(200).json({
            message : "User registered successfully"
        })
        
    }
    catch(error:any){
        res.status(500).json({
            message : error.message
        })
    }
}

    public static async loginUser(req:Request,res:Response) : Promise<void>{
        //user input
        const {email,password} =req.body
        if(!email || !password){
            res.status(400).json({
                message : "Please provide email, password"

            })
            return
            
        }
        // Check Whether user with provided email exist or not 
        const [data] = await User.findAll({
            where : {
                email:email
            }
        })
       
        if(!data ){
            res.status(404).json({
                message : "No user with that email"
            })
            return
                }

                // Check password now
                const isMatched = bcrypt.compareSync(password,data.password)
                if(!isMatched){
                    res.status(403).json({
                        message : "Invalid  password"
                    
                    })
                    return 
                }

                //generate token 
                

                const token = jwt.sign({id:data.id},process.env.SECRET_KEY as string,{
                    expiresIn : "30d"
                })
                res.status(200).json({
                    message : "Logged in successfull",
                    data : token
                })
            }

}

export default AuthController 