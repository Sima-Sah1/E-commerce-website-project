import { Request,response,Response } from  "express";
import { AuthRequest } from "../middleware/authMiddleware";
import Cart from "../database/models/cart";
import product from "../database/models/product";
import Category from "../database/models/Category";



class CartController{
    async addToCart(req:AuthRequest,res:Response):Promise<void>{
        const userId = req.user?.id
        const {quantity,productId} = req.body
        if(!quantity || !productId) {
            res.status(400).json({
                message : "Please provide quantity,productId"
            })

        }
        //check if the product already exists in the cart table or not 
        let cartItem = await Cart.findOne({
            where : {
                productId,
                userId
            }
        })
        if(cartItem){
            cartItem.quantity+= quantity
            await cartItem.save()
        }else{
            // insert into Cart table
            cartItem = await Cart.create({
                quantity,
                userId,
                productId

            })
        }
        res.status(200).json({
            message : "Product added to cart",
            data : cartItem
        })
    }

    async getMyCarts(req:AuthRequest,res:Response):Promise<void>{
        const userId = req.user?.id
        const cartItem = await Cart.findAll({
            where : {
                userId
            },
            include : [
                {
                    model : product,
                    include : [
                        {
                            model : Category,
                            attributes : ['id','categoryName']
                        }
                    ]
                }
            ]
        })
        if(cartItem.length === 0 ){
            res.status(404).json({
                message : "No item in the cart"
            })
        }else{
            res.status(200).json({
                message : "Cart items fetched succesfully",
                data : cartItem
            })
        }
    }

        async deleteMyCartItem(req:AuthRequest,res:Response) : Promise<void>{
            const userId = req.user?.id
            const {productId} = req.params

            // check whether above productId product exist or not
            const Product = await product.findByPk(productId)
            if(!product){
                res.status(404).json({
                    message : "No product with that id"
                }) 
                return 
            }
            //delete that productIdfrom userCart
            await Cart.destroy({
                where : {
                    userId,productId
                }
            })
            res.status(200).json({
                message :"Product of cart deleted successfully"
            })
        }
        async updateCartItem(req:AuthRequest,res:Response):Promise<void>{
            const {productId} = req.params
            const userId = req.user?.id
            const {quantity} = req.body
            if(!quantity){
                res.status(400).json({
                    message : "Please provide quantity"
                })
                return
            }
            const cartData:any = await Cart.findOne({
                where : {
                    userId,
                    productId
                }
            })
            if(cartData){
            cartData.quantity = quantity
            await cartData?.save()
            res.status(200).json({
                message : "Product of cart updated successfully",
                data : cartData
            })
        }else{
            res.status(404).json({
                message : "No productId of that userId"
            })
        }
    }
}

export default new CartController()