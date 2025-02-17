import { promises } from 'dns';
import{Request,Response} from 'express'
import Product from '../database/models/product'
import { AuthRequest } from '../middleware/authMiddleware';
import User from '../database/models/userModel';
import Category from '../database/models/Category';

class ProductController{
    async addProduct(req:AuthRequest,res:Response):Promise<void>{
        const UserId = req.user?.id
        const{ productName,productDescription,productTotalStockQty,productPrice,categoryId} = req.body
        let fileName:string;
        if(req.file){
            fileName = req.file?.filename 
        }else{
            fileName = "https://www.bing.com/images/search?view=detailV2&ccid=mfMseThu&id=7CD7E0F0F5051480A30D6A10761E7306D5B75947&thid=OIP.mfMseThuqFfK_zZ7-78QowHaHa&mediaurl=https%3a%2f%2fimg.freepik.com%2fpremium-vector%2fpile-school-books_905719-1170.jpg&cdnurl=https%3a%2f%2fth.bing.com%2fth%2fid%2fR.99f32c79386ea857caff367bfbbf10a3%3frik%3dR1m31QZzHnYQag%26pid%3dImgRaw%26r%3d0&exph=626&expw=626&q=book&simid=608055284380612655&FORM=IRPRST&ck=FDF0C78CD8D4DBE6E73044AF29C23121&selectedIndex=14&itb=0"
        }
         
        if(!productName || !productDescription || !productTotalStockQty || !productPrice || !categoryId){
            res.status(400).json({
                message : "Please provide productName,productDescription,productTotalStockQty,productPrice,categoryId"
            })
            return
        }
        await Product.create({
            productName,
            productDescription,
            productPrice,
            productTotalStockQty,
            productImageUrl : fileName,
            UserId : UserId,
            categoryId : categoryId
           
        })
        res.status(200).json({
            message : "Product added successfully"
        })

    }
    async getAllProducts(req:Request,res:Response):Promise<void>{
        const data = await Product.findAll(
            {
                include : [
                    {
                        model : User,
                        attributes : ['id','email','username']
                    },
                    {
                        model : Category,
                        attributes : ['id','categoryName']
                    }
                ]
            }
        )
        res.status(200).json({
            message : "Products fetched successfully",
            data
        })
    }
    async getSingleProduct(req:Request,res:Response):Promise<void>{
        //
        const id = req.params.id
        const data = await Product.findAll({
            where : {
                id : id
            },
            include : [
                {
                    model :User,
                    attributes : ['id','email','username']
                },
                {
                    model : Category,
                    attributes :['id','categoryName']
                }
            ]
        })
        if(data.length == 0 ){
            res.status(404).json({
                message : "No product with that id"
            })
        }else{
            res.status(200).json({
                message : "Product fetched successfully",
                data
            })
        }
    }

    async deleteProduct(req:Request,res:Response):Promise<void>{
        const {id} = req.params
        const data = await Product.findAll({
            where : {
                id : id
            }
        })
        if(data.length > 0 ){
            await Product.destroy({
                where : {
                    id : id
                }
            })
            res.status(200).json({
                message : "Product deleted successfully"
            })
        }else{
            res.status(404).json({
                message : "No product with that id"
            })
        }
    }
}

export default new ProductController()