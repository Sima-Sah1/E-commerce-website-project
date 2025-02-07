
import {Sequelize, DataTypes} from 'sequelize' 
import dbconfig from '../config/dbConfig'

const sequelize = new Sequelize(dbconfig.db,dbconfig.user,dbconfig.password,{
    host : dbconfig.host,
    dialect :dbconfig.dialect,
    port : 3306,
    pool : {
        acquire : dbconfig.pool.acquire,
        min : dbconfig.pool.min,
        max : dbconfig.pool.max,
        idle :dbconfig.pool.idle
    }
})
sequelize
.authenticate()
.then(()=>{
    console.log("connected")
})
.catch((err)=>{
    console.log(err)
})

const db:any = {}
db.sequelize = sequelize
db.Sequelize = Sequelize

db.sequelize.sync({force : false}).then(()=>{
    console.log("Yes migrated")
})

export default db