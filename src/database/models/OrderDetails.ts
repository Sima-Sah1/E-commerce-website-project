import { table } from 'console';
import {
    Table,
    Column,
    Model,
    DataType,
    CreatedAt,
    PrimaryKey,
    AllowNull

    
}from 'sequelize-typescript'

@Table({
    tableName : 'orderdetails',
    modelName : 'OrderDetail',
    timestamps : true 
})

class OrderDetail extends Model{
    @Column({
        primaryKey : true,
        type : DataType.UUID,
        defaultValue : DataType.UUIDV4
    })
    declare id:string;

    @Column({
        type : DataType.INTEGER,
        allowNull : false

    })
    declare quantity : number
    productId: unknown;
    
}

export default OrderDetail