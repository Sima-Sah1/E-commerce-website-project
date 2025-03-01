import OrderDetail from "../database/models/OrderDetails"


export interface OrderData{
    phoneNumber : string,
    shippingAddress :string,
    totalAmount : number,
    paymentDetails : {
        paymentMethod : PaymentMethod,
        paymentStatus?: PaymentStatus,
        pidx?: string
    },
    items : OrderDetail[]
}


export interface OrderDetails{
    quantity : number,
    productId : string
}
export enum PaymentMethod{
    Cod = 'cod',
    Khalti ='khalti'
}
enum PaymentStatus{
    Paid ='paid',
    Unpaid ='unpaid'
}
export interface KhaltiResponse{
    pidx : string,
    payment_url : string,
    expires_at : Date | string,
    expires_in : number,
    user_fee : number
}

export interface TraansactionVerificationResponse{
    
        pidx: string,
        total_amount: number,
        status: TransactionStatus ,
        transaction_id: string,
        fee: number,
        refunded:boolean 
     
}

export enum TransactionStatus{
    Completed = 'Completed',
    Refunded = 'refunded',
    Pending = 'pending',
    Initiated = 'initiated'
}
