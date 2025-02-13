import User from "./database/models/userModel";
import bcrypt from 'bcrypt'

const adminSeeder = async():Promise<void>=>{
    const [data] = await User.findAll({
        where :{
            email : "pro2admin@gmail.com",
        }
    })
    if(!data){
        await User.create({
            email : "pro2admin@gmail.com",
            password : bcrypt.hashSync("pro2password",8),
            username : "pro2admin",
            role : 'admin'
        })
        console.log("admin credentials seeded successfully")
    }else{
        console.log("admin credentials already seeded")
    }
}
export default adminSeeder