import Category from "../database/models/Category"

class CategoryController{
    categoryData = [
        {
            categoryName : "Books"
        },
        {
            categoryName : "Stationery"
        },
        {
            categoryName : "Academy Book Solutions"
        },
        {
            categoryName : "Competitive Exam Books"
        },
        {
            categoryName : "Kids Corner"
        },
        {
            categoryName : "Bundles & Gift Sets"
        }
    ]
    async seedCategory():Promise<void>{
        const datas = await Category.findAll()
        if(datas.length === 0){
            const data = await Category.bulkCreate(this.categoryData)
            console.log("Categories seeded successfully")
        }else{
            console.log("Categories already seeded")
        }
        
    }
}

export default new CategoryController()