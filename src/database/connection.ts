import { ForeignKey, Sequelize } from "sequelize-typescript";
import * as dotenv from 'dotenv';
import Product from "./models/product";
import User from "./models/userModel";
import Category from "./models/Category";

dotenv.config(); 

const sequelize = new Sequelize({
    database : process.env.DB_NAME,
    dialect : 'mysql',
    username : process.env.DB_USERNAME,
    password : process.env.DB_PASSWORD,
    host : process.env.DB_HOST,
    port :Number(process.env.DB_PORT),
    models : [__dirname + "/models"]

})


sequelize.authenticate()
.then(()=>{
    console.log("connected")

})
.catch((err)=>{
    console.log(err)
})
sequelize.sync({force : false}).then(()=>{
    console.log("synced !!!") 
})

//Relationships

User.hasMany(Product,{foreignKey : 'UserId'})
Product.belongsTo(User,{foreignKey : 'UserId'})

Category.hasOne(Product,{foreignKey :'categoryId'})
Product.belongsTo(Category,{foreignKey :'categoryId'})


export default sequelize