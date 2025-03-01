import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import { KhaltiResponse, OrderData, PaymentMethod, TraansactionVerificationResponse, TransactionStatus } from "../types/orderTypes";
import Order from "../database/models/Order";
import Payment from "../database/models/Payment";
import OrderDetail from "../database/models/OrderDetails";
import axios from "axios";



class OrderController{
    async createOrder(req:AuthRequest,res:Response):Promise<void>{
        const userId = req.user?.id
        const {phoneNumber,shippingAddress,totalAmount,paymentDetails,items}
        :OrderData=req.body
        if(!phoneNumber || !shippingAddress || !totalAmount || !paymentDetails || 
            !paymentDetails.paymentMethod || items.length == 0 ){
                res.status(400).json({
                    message : "Please provide phoneNumber,shippingAddress,totalAmount,paymentDetails,items"
                })
                return
            }
        
        const paymentData = await Payment.create({
            paymentMethod :paymentDetails.paymentMethod
        })
        const orderData = await Order.create({
            phoneNumber,
            shippingAddress,
            totalAmount,
            userId,
            paymentId : paymentData.id
        })
        for (var i = 0; i<items.length; i++){
            await OrderDetail.create({
                quantity : items[i].quantity,
                productId : items[i].productId,
                orderId : orderData.id 
            })
        }
        if(paymentDetails.paymentMethod === PaymentMethod.Khalti){
            // khalti integration
            const data = {
                return_url : "http://localhost:5173/success",
                purchase_order_id : orderData.id,
                amount : totalAmount * 100,
                website_url :"http://localhost:5173/",
                purchase_order_name : 'orderName_' + orderData.id
            }
            const response = await axios.post('https://dev.khalti.com/api/v2/epayment/initiate/',
            data,{
                headers : {
                    'Authorization' : 'key e25238483d4f4eb1972ed569d7fc49fa'
                }
            })
            const KhaltiResponse:KhaltiResponse = response.data
            paymentData.pidx = KhaltiResponse.pidx
            paymentData.save()
            res.status(200).json({
                message : "order placed successfully",
                url : KhaltiResponse.payment_url
            })

        }else{
            res.status(200).json({
                message : "Order placed successfully"
            })
        }
    }
    async verifyTransaction(req:AuthRequest,res:Response):Promise<void>{
        const {pidx}=req.body
        
        if(!pidx){
            res.status(400).json({
                message : "Please provide pidx"
            })
            return
        }
        const response = await axios.post("https://dev.khalti.com/api/v2/epayment/lookup/",{pidx},{
            headers : {
                'Authorization' : 'key e25238483d4f4eb1972ed569d7fc49fa'
            }
        })
        const data : TraansactionVerificationResponse = 
            response.data 
            if (data.status === TransactionStatus.Completed){
                await Payment.update({paymentStatus:'paid'},{
                    where : {
                        pidx : pidx
                    }
                })
                res.status(200).json({
                    message : "Payment verified successfully"
                })
            }else{
                res.status(200).json({
                    message : "Payment not verified" 
                })
            }
        }
}
export default new OrderController()